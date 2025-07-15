"use client"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Minus, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

import { usePaymentSheetStore } from "./store"
import { useHandleErrorWithToast } from "@/lib/utils/handleError"
import { LeagueTeamSubmission } from "@/models/league"
import { updateLeagueTeam } from "@/services/league-service"
import { useLeagueTeam } from "@/hooks/useLeagueTeam"
import { cn } from "@/lib/utils"

export function PaymentSheet() {
  const { open, data, closeSheet } = usePaymentSheetStore()
  const { refetchTeamResource } = useLeagueTeam()

  const [fields, setFields] = useState<Partial<LeagueTeamSubmission>>({})
  const [adjustAmount, setAdjustAmount] = useState<number>(0)
  const [liveAmount, setLiveAmount] = useState<number>(0)
  const [isLoading, setLoading] = useState(false)
  const handleError = useHandleErrorWithToast()

  useEffect(() => {
    if (data?.amount_paid != null) {
      setLiveAmount(data.amount_paid)
      setFields(prev => ({ ...prev, amount_paid: data.amount_paid }))
    }
  }, [data])

  const applyLiveChange = (type: "add" | "subtract") => {
    setLiveAmount(prev => {
      const updated =
        type === "add" ? prev + adjustAmount : Math.max(0, prev - adjustAmount)
      setFields(prevFields => ({
        ...prevFields,
        amount_paid: updated,
      }))
      return updated
    })
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      if (!data) throw new Error("Something went wrong!")
      const response = await updateLeagueTeam({
        league_team_id: data.id,
        fields: {
          ...fields,
          amount_paid: liveAmount,
        },
      })
      await refetchTeamResource()
      toast.success(response.message)
      setFields({})
      setLiveAmount(0)
      setAdjustAmount(0)
      closeSheet()
    } catch (e) {
      handleError(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={closeSheet}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Set Manual Payment</SheetTitle>
          <SheetDescription>
            {data?.description || "No description provided."}
          </SheetDescription>
        </SheetHeader>

        <div className={cn(
          'grid flex-1 auto-rows-min gap-6 px-4',
          isLoading && 'disable-on-loading-50'
        )}>

          <div className="grid gap-3">
            <Label htmlFor="adjustAmount">Adjust Amount</Label>
            <div className="flex items-center gap-2">
              <Input
                id="adjustAmount"
                type="number"
                min="0"
                defaultValue={adjustAmount}
                onChange={(e) => setAdjustAmount(Number(e.target.value))}
              />
              <Button type="button" variant="outline" onClick={() => applyLiveChange("add")}>
                <Plus className="w-4 h-4" />
              </Button>
              <Button type="button" variant="outline" onClick={() => applyLiveChange("subtract")}>
                <Minus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Live Amount: ₱{liveAmount.toLocaleString()}
            </p>
          </div>

          {/* Payment Status */}
          <div className="grid gap-3">
            <Label htmlFor="payment_status">Payment Status</Label>
            <Select
              value={fields?.payment_status ?? ""}
              onValueChange={(value) =>
                setFields(prev => ({
                  ...prev,
                  payment_status: value,
                }))
              }
            >
              <SelectTrigger id="payment_status">
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Payment status</SelectLabel>
                  {["Pending", "Paid Online", "Paid On Site", "Waived"]
                    .filter((status) => status !== data?.payment_status)
                    .map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                </SelectGroup>

              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter>
          <Button disabled={isLoading} onClick={handleUpdate}>
            {isLoading && <Loader2Icon className="animate-spin" />}
            Submit
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
