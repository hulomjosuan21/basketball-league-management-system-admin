'use client'

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMatchStageSheet } from './store'
import { useLeagueAdmin } from '@/hooks/useLeagueAdmin'
import { useHandleErrorWithToast } from '@/lib/utils/handleError'
import { FormatType, MatchCategory } from '@/models/match/match-types'
import { generateStagingMatch } from '@/services/league-service'
import { useLeagueStaging } from '@/hooks/useLeagueStaging'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'

const formSchema = z.object({
    category: z.string(),
    format_type: z.string(),
    pairing_method: z.string(),
    durationMinutes: z.coerce.number().int().positive(),
})

export type StagingGenerateOptionType ={
    options: {
        league_id: string;
        division_id: string;
        generated_by: string | undefined;
        category: string;
        format_type: string;
        pairing_method: string;
        durationMinutes: number;
    };
}

export function MatchStagingOptionsSheet() {
    const { data, open, closeSheet } = useMatchStageSheet()
    const { leagueStagingRefetch, leagueStagingLoading } = useLeagueStaging()
    const { data: admin, isLoading, error } = useLeagueAdmin()
    const [isProcessing, setIsProcessing] = useState(false)
    const handleError = useHandleErrorWithToast()

    const matchCategories = Object.values(MatchCategory)
    const formatTypes = Object.values(FormatType)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: matchCategories[0],
            format_type: formatTypes[0],
            pairing_method: 'random',
            durationMinutes: 40,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (isLoading) return
        if (error) return

        if (!data?.league_id || !data?.division_id) {
            console.error("Missing league_id or division_id")
            return
        }
        setIsProcessing(true)
        try {
            const payload: StagingGenerateOptionType = {
                options: {
                    ...values,
                    league_id: data.league_id,
                    division_id: data.division_id,
                    generated_by: admin?.league_administrator_id,
                }
            }
            const response = await generateStagingMatch(payload)
            await leagueStagingRefetch()
            closeSheet()
            toast.success(response.message);
        } catch (e) {
            handleError(e)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={closeSheet}>
            <SheetContent className="flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle>Match Options</SheetTitle>
                    <SheetDescription>Configure your match generation options below.</SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={cn("flex-1 flex flex-col justify-between overflow-y-auto", isProcessing && "disable-on-loading-10")}
                    >
                        <div className="space-y-4 pt-4 px-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    matchCategories.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            {category}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="format_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Format Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select format" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    formatTypes.map((format) => (
                                                        <SelectItem key={format} value={format}>
                                                            {format}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="pairing_method"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pairing Method</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select pairing" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="random">Random</SelectItem>
                                                <SelectItem value="seeding">Seeding</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="durationMinutes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Match Duration (minutes)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="border-t py-4 mt-6 px-1 sticky bottom-0 bg-white dark:bg-background">
                            <Button type="submit" className="w-full" disabled={leagueStagingLoading || isProcessing}>
                                {(leagueStagingLoading || isProcessing) && <Loader2Icon className="animate-spin" />}
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}
