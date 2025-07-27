'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectGroup, SelectLabel } from '@/components/ui/select'
import { SelectTrigger } from '@/components/ui/select'
import { SelectValue } from '@/components/ui/select'
import { SelectContent } from '@/components/ui/select'
import { SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormField } from '@/components/ui/form'
import { FormItem } from '@/components/ui/form'
import { FormLabel } from '@/components/ui/form'
import { FormControl } from '@/components/ui/form'
import { FormMessage } from '@/components/ui/form'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useLeagueResource } from '@/hooks/useLeagueResource'
import { MultiSelect } from '@/components/MultiSelect'
import { ErrorAlert, SmallLoadingAlert } from '@/components/alerts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MatchTeamType, MatchType } from '@/models/match/match-types'
import { useHandleErrorWithToast } from '@/lib/utils/handleError'
import { useState } from 'react'
import { scheduleMatch } from '@/services/match-service'
import { toast } from 'sonner'
import { Loader2Icon } from 'lucide-react'
import { usePersistentMatchStore } from './matchTeamStore'

const formSchema = z.object({
    scheduled_date: z.string().min(1),
    duration_minutes: z.coerce.number().min(1),
    referees: z.array(z.string()).length(3, 'Select exactly 3 referees'),
    court: z.string().min(1),
    match_notes: z.string().nullable(),
})

export default function MatchCreateForm() {
    const { match, resetMatch } = usePersistentMatchStore();
    const handleError = useHandleErrorWithToast()
    const [isProcessing, setProcess] = useState(false)
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            scheduled_date: '',
            duration_minutes: 40,
            referees: [],
            court: '',
            match_notes: '',
        },
    })

    const {
        leagueResource,
        leagueResourceLoading,
        leagueResourceError,
    } = useLeagueResource()

    const refereeOptions = leagueResource?.league_referees ?? []
    const courtOptions = leagueResource?.league_courts ?? []

    const onSubmit = async (d: z.infer<typeof formSchema>) => {
        const data: Partial<MatchType> = {
            match_id: match?.match_id,
            scheduled_date: new Date(d.scheduled_date).toISOString(),
            referees: d.referees,
            court: d.court,
        }
        if (d.match_notes) {
            data.match_notes = d.match_notes
        }
        if (d.duration_minutes) {
            data.duration_minutes = d.duration_minutes
        }
        setProcess(true)
        try {
            const response = await scheduleMatch(data)

            // await matchRefetch()
            if (response.status && response.message) {
                toast.success(response.message)
                resetMatch()
                form.reset()
            }
        } catch (e) {
            handleError(e)
        } finally {
            setProcess(false)
        }
        console.log('Data: ', JSON.stringify(data, null, 2))
    }

    if (leagueResourceLoading) return <SmallLoadingAlert description='Loading...' />
    if (leagueResourceError) return <ErrorAlert errorMessage='Error loading resources' />

    const teamCard = (t: MatchTeamType) => (
        (
            <div className="flex items-center gap-3 justify-center">
                <Avatar className="h-10 w-10 rounded-sm overflow-hidde">
                    <AvatarImage src={t.team_logo_url} className="object-cover" />
                    <AvatarFallback>{t.team_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                    <p className="text-sm font-medium leading-none">{t.team_name}</p>
                    <p className="text-xs text-muted-foreground">#{t.league_team_id}</p>
                </div>
            </div>
        )
    )

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full"
            >

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="scheduled_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Schedule Date</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="duration_minutes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration (Minutes)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="court"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Court</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a court" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Current League Courts</SelectLabel>
                                            {courtOptions.map((court) => (
                                                <SelectItem key={court.court_name} value={court.court_name}>
                                                    {court.court_name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="referees"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select 3 Referees</FormLabel>
                                <MultiSelect
                                    options={refereeOptions.map((ref) => ({
                                        value: ref.referee_full_name,
                                        label: ref.referee_full_name,
                                    }))}
                                    value={field.value || []}
                                    onChange={field.onChange}
                                    placeholder="Select referees"
                                    maxSelected={3}
                                    heading='Current League Referees'
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="match_notes"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Match Notes</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Any additional info..." {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="md:col-span-3 flex items-center gap-4">
                        <div className="flex-[1.5] border border-dashed rounded-lg p-4 min-h-[120px] text-center bg-muted/40 flex flex-col items-center justify-center">
                            <p className="font-semibold mb-2">Home Team</p>
                            {match?.home_team ? (
                                teamCard(match.home_team)
                            ) : (
                                <p className="text-muted-foreground text-sm">Not selected</p>
                            )}
                        </div>

                        <div className="w-12 text-center font-bold text-lg text-muted-foreground">V.S.</div>

                        <div className="flex-[1.5] border border-dashed rounded-lg p-4 min-h-[120px] text-center bg-muted/40 flex flex-col items-center justify-center">
                            <p className="font-semibold mb-2">Away Team</p>
                            {match?.away_team ? (
                                teamCard(match.away_team)
                            ) : (
                                <p className="text-muted-foreground text-sm">Not selected</p>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <Button type="submit" className="w-full" disabled={isProcessing}>
                            {isProcessing && <Loader2Icon className="animate-spin" />}
                            Schedule Match
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
