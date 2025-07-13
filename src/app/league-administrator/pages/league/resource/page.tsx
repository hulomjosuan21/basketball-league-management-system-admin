'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { CircleQuestionMark, Loader2Icon } from 'lucide-react'
import { CourtType, LeagueResourceType, RefereeType, SponsorType } from '@/models/league'
import { updateLeagueResource } from '@/services/league-service'
import { useHandleErrorWithToast } from '@/lib/utils/handleError'
import { toast } from 'sonner'
import { ErrorAlert, LoadingAlert } from '@/components/alerts'
import { EditableTable } from './table'
import {
  ColumnDef,
} from "@tanstack/react-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from '@/components/ui/separator'
import { TableHeaderWithHelper } from '@/components/table-header-with-helper'
import { useLeagueResource } from '@/hooks/useLeagueResource'

export default function LeagueResourcePage() {
  const { leagueMeta, leagueResource, leagueResourceLoading, leagueResourceError, refetchLeagueResource } = useLeagueResource()
  const handleError = useHandleErrorWithToast()
  const [showInfo, setShowInfo] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const initialCourts = useRef<CourtType[]>([])
  const initialReferees = useRef<RefereeType[]>([])
  const initialSponsors = useRef<SponsorType[]>([])

  const [courts, setCourts] = useState(initialCourts.current)
  const [referees, setReferees] = useState(initialReferees.current)
  const [sponsors, setSponsors] = useState(initialSponsors.current)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const filteredCourts = courts.filter(c => c.court_name || c.court_address)
    const filteredInitialCourts = initialCourts.current.filter(c => c.court_name || c.court_address)

    const filteredReferees = referees.filter(r => r.referee_full_name || r.referee_address || r.referee_contact_number)
    const filteredInitialReferees = initialReferees.current.filter(r => r.referee_full_name || r.referee_address || r.referee_contact_number)

    const filteredSponsors = sponsors.filter(s => s.sponsor_name || s.sponsorship_value)
    const filteredInitialSponsors = initialSponsors.current.filter(s => s.sponsor_name || s.sponsorship_value)

    const isCourtsChanged = JSON.stringify(filteredCourts) !== JSON.stringify(filteredInitialCourts)
    const isRefereesChanged = JSON.stringify(filteredReferees) !== JSON.stringify(filteredInitialReferees)
    const isSponsorsChanged = JSON.stringify(filteredSponsors) !== JSON.stringify(filteredInitialSponsors)

    setHasChanges(isCourtsChanged || isRefereesChanged || isSponsorsChanged)
  }, [courts, referees, sponsors])

  const updateCourt = (index: number, key: keyof CourtType, value: string) => {
    const updated = [...courts]
    updated[index][key] = value
    setCourts(updated)
  }

  const updateReferee = (index: number, key: keyof RefereeType, value: string) => {
    const updated = [...referees]
    updated[index][key] = value
    setReferees(updated)
  }

  const updateSponsor = (index: number, key: keyof SponsorType, value: string) => {
    const updated = [...sponsors]
    updated[index][key] = value
    setSponsors(updated)
  }

  const handleSave = async () => {
    const payload: Partial<LeagueResourceType> = {
      league_courts: courts.filter(c => c.court_name || c.court_address),
      league_referees: referees.filter(r => r.referee_full_name || r.referee_address || r.referee_contact_number),
      league_sponsors: sponsors.filter(s => s.sponsor_name || s.sponsorship_value),
    }

    initialCourts.current = JSON.parse(JSON.stringify(payload.league_courts))
    initialReferees.current = JSON.parse(JSON.stringify(payload.league_referees))
    initialSponsors.current = JSON.parse(JSON.stringify(payload.league_sponsors))

    setIsUpdating(true)

    try {
      if (!leagueMeta?.league_meta) {
        throw new Error("No league ID found.")
      }

      await updateLeagueResource({
        league_id: leagueMeta.league_meta.league_id,
        data: payload,
      })

      refetchLeagueResource()
      setHasChanges(false)
      toast.success("Successfully updated league resources.")
    } catch (e) {
      handleError(e)
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    if (leagueResource) {
      const { league_courts = [], league_referees = [], league_sponsors = [] } = leagueResource

      setCourts(league_courts)
      setReferees(league_referees)
      setSponsors(league_sponsors)
      if (initialCourts.current.length === 0 && initialReferees.current.length === 0 && initialSponsors.current.length === 0) {
        initialCourts.current = JSON.parse(JSON.stringify(league_courts))
        initialReferees.current = JSON.parse(JSON.stringify(league_referees))
        initialSponsors.current = JSON.parse(JSON.stringify(league_sponsors))
      }
    }
  }, [leagueResource])

  const courtColumns: ColumnDef<CourtType>[] = [
    {
      accessorKey: "court_name",
      header: () => <TableHeaderWithHelper headerText='Court Name' helperText='(e.g. Barangay Court)' />,
      cell: ({ row }: { row: { original: CourtType; index: number } }) => (
        <Input
          value={row.original.court_name}
          onChange={(e) => updateCourt(row.index, "court_name", e.target.value)}
        />
      ),
    },
    {
      accessorKey: "court_address",
      header: () => <TableHeaderWithHelper headerText='Court Address' helperText='(e.g., Bogo City, Cebu)' />,
      cell: ({ row }: { row: { original: CourtType; index: number } }) => (
        <Input
          value={row.original.court_address}
          onChange={(e) => updateCourt(row.index, "court_address", e.target.value)}
        />
      ),
    },
  ]

  const sponsorColumns: ColumnDef<SponsorType>[] = [
    {
      accessorKey: "sponsor_name",
      header: () => <TableHeaderWithHelper headerText='Sponsor Name' helperText='(e.g., Jollibee Corp.)' />,
      cell: ({ row }: { row: { original: SponsorType; index: number } }) => (
        <Input
          value={row.original.sponsor_name}
          onChange={(e) => updateSponsor(row.index, "sponsor_name", e.target.value)}
        />
      ),
    },
    {
      accessorKey: "sponsorship_value",
      header: () => <TableHeaderWithHelper headerText='Sponsor Value' helperText='(Amount (e.g., 5000 PHP) or item (e.g., basketballs, uniforms))' />,
      cell: ({ row }: { row: { original: SponsorType; index: number } }) => (
        <Input
          value={row.original.sponsorship_value}
          onChange={(e) => updateSponsor(row.index, "sponsorship_value", e.target.value)}
        />
      ),
    },
  ]

  const refereeColumns: ColumnDef<RefereeType>[] = [
    {
      accessorKey: "referee_full_name",
      header: () => <TableHeaderWithHelper headerText='Full Name' helperText='(e.g., Juan Dela Cruz)' />,
      cell: ({ row }: { row: { original: RefereeType; index: number } }) => (
        <Input
          value={row.original.referee_full_name}
          onChange={(e) => updateReferee(row.index, "referee_full_name", e.target.value)}
        />
      ),
    },
    {
      accessorKey: "referee_address",
      header: () => <TableHeaderWithHelper headerText='Address' helperText='(e.g., Barangay San Vicente, Bogo City)' />,
      cell: ({ row }: { row: { original: RefereeType; index: number } }) => (
        <Input
          value={row.original.referee_address}
          onChange={(e) => updateReferee(row.index, "referee_address", e.target.value)}
        />
      ),
    },
    {
      accessorKey: "referee_contact_number",
      header: () => <TableHeaderWithHelper headerText='Contact Number' helperText='(e.g., 0917 123 4567))' />,
      cell: ({ row }: { row: { original: RefereeType; index: number } }) => (
        <Input
          value={row.original.referee_contact_number}
          onChange={(e) => updateReferee(row.index, "referee_contact_number", e.target.value)}
        />
      ),
    },
  ]

  const resourceEntries = (
    <>
      <TabsContent value='court'>
        <EditableTable<CourtType>
          data={courts}
          columns={courtColumns}
          onUpdate={updateCourt}
          onDelete={(index) => setCourts(courts.filter((_, i) => i !== index))}
          onAdd={() => setCourts([...courts, { court_name: "", court_address: "" }])}
          filterColumn="court_name"
        />
      </TabsContent>

      <TabsContent value='sponsors'>
        <EditableTable<SponsorType>
          data={sponsors}
          columns={sponsorColumns}
          onUpdate={updateSponsor}
          onDelete={(index) => setSponsors(sponsors.filter((_, i) => i !== index))}
          onAdd={() => setSponsors([...sponsors, { sponsor_name: "", sponsorship_value: "" }])}
          filterColumn="sponsor_name"
        />
      </TabsContent>

      <TabsContent value='referee'>
        <EditableTable<RefereeType>
          data={referees}
          columns={refereeColumns}
          onUpdate={updateReferee}
          onDelete={(index) => setReferees(referees.filter((_, i) => i !== index))}
          onAdd={() =>
            setReferees([
              ...referees,
              {
                referee_full_name: "",
                referee_address: "",
                referee_contact_number: "",
              },
            ])
          }
          filterColumn="referee_full_name"
        />
      </TabsContent>
    </>
  )

  const header = (
    <header className="sticky top-0 z-10 bg-background border-b flex items-center gap-2 py-1">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">League Resource</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={() => setShowInfo(prev => !prev)}
          >
            <CircleQuestionMark />
          </Button>
        </div>
      </div>
    </header>
  )

  return (
    <SidebarInset>
      <div className="flex flex-col h-screen w-full">

        {header}

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {showInfo && <div className="text-muted-foreground text-sm">
            This section provides the essential data related to a specific league's operational setup. It includes information about the courts where games will be held, the referees who will officiate, and the sponsors supporting the league. This data helps administrators manage and organize league activities effectively.
          </div>}
          {leagueResourceLoading && <LoadingAlert title="Fetching League Resource..." description="Please wait while we load the league information." />}
          {leagueResourceError && <ErrorAlert errorMessage={`Failed to fetch league meta: ${leagueResourceError.message}`} />}
          {!leagueResourceLoading && !leagueResourceError && leagueMeta && (
            <Tabs defaultValue="court">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="court">Court</TabsTrigger>
                  <TabsTrigger value="referee">Referee</TabsTrigger>
                  <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
                </TabsList>
                {hasChanges && (
                  <Button onClick={handleSave} disabled={isUpdating} size={'sm'}>
                    {isUpdating && <Loader2Icon className="animate-spin mr-2" />}
                    Save Changes
                  </Button>
                )}
              </div>
              {resourceEntries}
            </Tabs>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}
