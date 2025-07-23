"use client"

import { useState, useEffect } from "react"
import { TabsContent } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCheckMatchExists } from "@/hooks/userMatchQueries"
import { useLeagueMeta } from "@/lib/stores/useLeagueMeta"
import { useHandleErrorWithToast } from "@/lib/utils/handleError"
import { ApiResponse } from "@/lib/apiResponse"
import { GenerateUnscheduledMatches, RematchUnscheduledMatches } from "@/services/match-service"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"
import teamImageExample from "@/data/images/logo-1.png"
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { GenerateOptions, MatchCategory } from "@/models/match/match-types"

type Props = {
    value: string
}

type MatchStatus = {
    exists: boolean
    total: number
    message?: string
}

export default function GenerateMatchupTabContent({ value }: Props) {
    const { leagueMeta } = useLeagueMeta()
    const league_id = leagueMeta.league_meta?.league_id
    const handleError = useHandleErrorWithToast()

    const [formCategory, setFormCategory] = useState("Elimination")
    const [durationMinutes, setDurationMinutes] = useState(40)
    const [matchStatus, setMatchStatus] = useState<MatchStatus | null>(null)
    const [wasGenerated, setWasGenerated] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const { data, isLoading } = useCheckMatchExists(
        {
            category: "Elimination",
            league_id: league_id ?? "",
            division_id: value,
        },
        !!league_id
    )

    useEffect(() => {
        if (data?.payload) {
            setMatchStatus({
                exists: data.payload.exists,
                total: data.payload.total,
                message: data.message,
            })
            setWasGenerated(false)
        }
    }, [data])

    const options: Partial<GenerateOptions> = {
        category: formCategory as MatchCategory,
        durationMinutes,
        league_id: league_id!,
        division_id: value,
    }

    const handleGenerate = async () => {
        try {
            setIsProcessing(true)
            const res: ApiResponse<{ exists: boolean; total: number }> =
                await GenerateUnscheduledMatches(options)

            if (res.status && res.payload) {
                setMatchStatus({
                    exists: res.payload.exists,
                    total: res.payload.total,
                    message: res.message,
                })
                toast.success(res.message)
                setWasGenerated(true)
            }
        } catch (e) {
            handleError(e)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRematch = async () => {
        try {
            setIsProcessing(true)
            const res: ApiResponse<{ exists: boolean; total: number }> =
                await RematchUnscheduledMatches(options)

            if (res.status && res.payload) {
                setMatchStatus({
                    exists: res.payload.exists,
                    total: res.payload.total,
                    message: res.message,
                })
                toast.success(res.message)
                setWasGenerated(true)
            }
        } catch (e) {
            handleError(e)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <TabsContent value={value} className="flex-1 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center py-8">
                {isLoading ? (
                    <span>Checking matchups...</span>
                ) : matchStatus?.exists ? (
                    <div className="space-y-4 text-center">
                        <p className="font-medium">
                            {matchStatus.message}
                        </p>
                        {/* <div className="grid grid-cols-2 gap-4 justify-center">
                            {
                            Array.from({length: 10}, (_, i) => (
                                <VsMatchCard/>
                            ))
                        }
                        </div> */}
                        <Button
                            className="w-full max-w-sm"
                            onClick={handleRematch}
                            disabled={isProcessing}
                            variant="destructive"
                        >
                            {isProcessing && <Loader2Icon className="animate-spin" />}
                            Rematch (Regenerate)
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 w-full max-w-sm text-center">
                        <h2 className="text-lg font-semibold">No matchups yet</h2>

                        <Select value={formCategory} onValueChange={setFormCategory} disabled={isProcessing}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(MatchCategory).map(([key, value]) => (
                                    <SelectItem key={key} value={value}>
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            type="number"
                            min={10}
                            value={durationMinutes}
                            onChange={(e) => setDurationMinutes(Number(e.target.value))}
                            placeholder="Duration Minutes"
                            disabled={isProcessing}
                        />

                        <Button
                            className="w-full"
                            onClick={handleGenerate}
                            disabled={isProcessing}
                        >
                            {isProcessing && <Loader2Icon className="animate-spin" />}
                            Generate Matches
                        </Button>
                    </div>
                )}
            </div>
        </TabsContent>
    )
}



export function VsMatchCard() {
  return (
     <div className="flex items-center max-w-sm overflow-hidden justify-center gap-4 border p-2 rounded-md bg-muted">
          <div className="flex flex-col items-center gap-2">
            <Image
              src={teamImageExample}
              alt={'teamA'}
              width={60}
              height={60}
              className="rounded-md"
            />
            <span className="text-sm truncate max-w-38">teamA</span>
          </div>

          <div className="text-2xl font-extrabold">VS</div>

          <div className="flex flex-col items-center gap-2">
            <Image
              src={teamImageExample}
              alt={'teamA'}
              width={60}
              height={60}
              className="rounded-md"
            />
            <span className="text-sm truncate max-w-38">teamB</span>
          </div>
        </div>
  );
}