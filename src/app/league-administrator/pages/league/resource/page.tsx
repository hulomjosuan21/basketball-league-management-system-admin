'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Loader2Icon, CircleQuestionMark, CircleX } from 'lucide-react'
import { CourtType, LeagueResourceType, RefereeType, SponsorType } from '@/models/league'
import { useLeagueMeta } from '@/lib/stores/useLeagueMeta'
import { useQuery } from '@tanstack/react-query'
import { fetchLeagueResource, updateLeagueResource } from '@/services/league-service'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useHandleErrorWithToast } from '@/lib/utils/handleError'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function LeagueResourcePage() {
  const { leagueMeta } = useLeagueMeta()
  const handleError = useHandleErrorWithToast()
  const [showInfo, setShowInfo] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { data, isLoading, error } = useQuery({
    queryKey: ['league-resource'],
    queryFn: () => fetchLeagueResource(leagueMeta.league_meta?.league_id),
    staleTime: 5 * 60_000,
  })
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

    const hasNewValidData =
      filteredCourts.length > 0 ||
      filteredReferees.length > 0 ||
      filteredSponsors.length > 0

    setHasChanges((isCourtsChanged || isRefereesChanged || isSponsorsChanged) && hasNewValidData)
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

    const noDataToSave =
      (payload.league_courts ?? []).length === 0 &&
      (payload.league_referees ?? []).length === 0 &&
      (payload.league_sponsors ?? []).length === 0

    if (noDataToSave) {
      toast.error("Please fill in at least one input before saving.")
      return
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

      setHasChanges(false)
      toast.success("Successfully updated league resources.")
    } catch (e) {
      handleError(e)
    } finally {
      setIsUpdating(false)
    }
  }

  const didSetInitials = useRef(false)

  useEffect(() => {
    if (data && !didSetInitials.current) {
      const {
        league_courts: fetchedCourts = [],
        league_referees: fetchedReferees = [],
        league_sponsors: fetchedSponsors = [],
      } = data

      initialCourts.current = JSON.parse(JSON.stringify(fetchedCourts))
      initialReferees.current = JSON.parse(JSON.stringify(fetchedReferees))
      initialSponsors.current = JSON.parse(JSON.stringify(fetchedSponsors))

      setCourts(fetchedCourts)
      setReferees(fetchedReferees)
      setSponsors(fetchedSponsors)

      didSetInitials.current = true
    }
  }, [data])

  const resourceCards = (
    <div className={cn((isLoading || isUpdating) && "disable-on-loading-50")}>
      <div
        className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg">Courts</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setCourts([...courts, { court_name: '', court_address: '' }])
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {courts.map((court, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
                <div>
                  <Input
                    placeholder="Court Name"
                    value={court.court_name}
                    onChange={(e) => updateCourt(index, 'court_name', e.target.value)}
                  />
                  {court.court_name.trim() === "" && <p className="text-helper">
                    e.g., Don Celestino Martinez Sr. Sports Complex
                  </p>}
                </div>

                <div>
                  <Input
                    placeholder="Court Address"
                    value={court.court_address}
                    onChange={(e) => updateCourt(index, 'court_address', e.target.value)}
                  />
                  {court.court_address.trim() === "" && <p className="text-helper">
                    e.g., Bogo City, Cebu
                  </p>}
                </div>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setCourts(courts.filter((_, i) => i !== index))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg">Sponsors</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setSponsors([...sponsors, { sponsor_name: '', sponsorship_value: '' }])
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {sponsors.map((sponsor, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
                <div>
                  <Input
                    placeholder="Sponsor Name"
                    value={sponsor.sponsor_name}
                    onChange={(e) => updateSponsor(index, 'sponsor_name', e.target.value)}
                  />
                  {sponsor.sponsor_name.trim() === "" && <p className="text-helper">
                    e.g., Jollibee Corp.
                  </p>}
                </div>

                <div>
                  <Input
                    placeholder="Sponsorship Value"
                    value={sponsor.sponsorship_value}
                    onChange={(e) => updateSponsor(index, 'sponsorship_value', e.target.value)}
                  />
                  {sponsor.sponsorship_value.trim() === "" && <p className="text-helper">
                    Amount (e.g., 5000 PHP) or item (e.g., basketballs, uniforms)
                  </p>}
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setSponsors(sponsors.filter((_, i) => i !== index))
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className='mt-4'>
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg">Referees</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setReferees([...referees, {
                  referee_full_name: '',
                  referee_address: '',
                  referee_contact_number: '',
                }])
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {referees.map((ref, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-start"
              >
                <div>
                  <Input
                    placeholder="Full Name"
                    value={ref.referee_full_name}
                    onChange={(e) => updateReferee(index, 'referee_full_name', e.target.value)}
                  />
                  {ref.referee_full_name.trim() === "" && <p className="text-helper">
                    e.g., Juan Dela Cruz
                  </p>}
                </div>

                <div>
                  <Input
                    placeholder="Address"
                    value={ref.referee_address}
                    onChange={(e) => updateReferee(index, 'referee_address', e.target.value)}
                  />
                  {ref.referee_address.trim() === "" && <p className="text-helper">
                    e.g., Barangay Poblacion, Bogo City
                  </p>}
                </div>

                <div>
                  <Input
                    placeholder="Contact Number"
                    value={ref.referee_contact_number}
                    onChange={(e) => updateReferee(index, 'referee_contact_number', e.target.value)}
                  />
                  {ref.referee_contact_number.trim() === "" && (
                    <p className="text-helper">
                      e.g., 0917 123 4567
                    </p>
                  )}
                </div>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setReferees(referees.filter((_, i) => i !== index))
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {hasChanges && (
        <Button onClick={handleSave} className="self-center mt-4" disabled={isUpdating}>
          {isUpdating && <Loader2Icon className="animate-spin" />}
          Save Changes
        </Button>
      )}
    </div>
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

          {isLoading && (
            <Alert>
              <Loader2Icon className="animate-spin" />
              <AlertTitle>Fetching League Resource...</AlertTitle>
              <AlertDescription>
                Please wait while we load the league information.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <CircleX />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to fetch league resource: {error.message}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && resourceCards}
        </div>
      </div>
    </SidebarInset>
  )
}
