'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus } from 'lucide-react'

type CourtType = {
  court_name: string
  court_address: string
}

type RefereeType = {
  referee_full_name: string
}

export default function LeagueResourcePage() {
  const initialCourts = useRef<CourtType[]>([
    { court_name: 'ABC Gym', court_address: 'Bogo City' },
    { court_name: 'XYZ Arena', court_address: 'Mandaue City' },
  ])

  const initialReferees = useRef<RefereeType[]>([
    { referee_full_name: 'Jane Ref' },
    { referee_full_name: 'John Official' },
  ])

  const [courts, setCourts] = useState<CourtType[]>(initialCourts.current)
  const [referees, setReferees] = useState<RefereeType[]>(initialReferees.current)
  const [hasChanges, setHasChanges] = useState(false)

  const updateCourt = (index: number, key: keyof CourtType, value: string) => {
    const updated = [...courts]
    updated[index][key] = value
    setCourts(updated)
    setHasChanges(true)
  }

  const updateReferee = (index: number, value: string) => {
    const updated = [...referees]
    updated[index].referee_full_name = value
    setReferees(updated)
    setHasChanges(true)
  }

  const handleSave = () => {
    const payload = {
      league_courts: courts,
      league_referees: referees,
    }

    console.log('Saving league resources:', payload)

    // Reset reference for change tracking
    initialCourts.current = JSON.parse(JSON.stringify(courts))
    initialReferees.current = JSON.parse(JSON.stringify(referees))
    setHasChanges(false)

    // TODO: Connect to backend API (POST or PUT)
  }

  return (
    <SidebarInset>
      <div className="flex flex-col h-screen w-full">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background border-b flex items-center gap-2 py-1">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <h1 className="text-base font-medium">League Resource</h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* COURTS COLUMN */}
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-lg">Courts</CardTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    setCourts([...courts, { court_name: '', court_address: '' }])
                    setHasChanges(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {courts.map((court, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
                    <Input
                      placeholder="Court Name"
                      value={court.court_name}
                      onChange={(e) =>
                        updateCourt(index, 'court_name', e.target.value)
                      }
                    />
                    <Input
                      placeholder="Court Address"
                      value={court.court_address}
                      onChange={(e) =>
                        updateCourt(index, 'court_address', e.target.value)
                      }
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setCourts(courts.filter((_, i) => i !== index))
                        setHasChanges(true)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* REFEREES COLUMN */}
            <Card className='@container/card'>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-lg">Referees</CardTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    setReferees([...referees, { referee_full_name: '' }])
                    setHasChanges(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {referees.map((ref, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Referee Full Name"
                      value={ref.referee_full_name}
                      onChange={(e) => updateReferee(index, e.target.value)}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setReferees(referees.filter((_, i) => i !== index))
                        setHasChanges(true)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* SAVE BUTTON */}
          {hasChanges && (
            <Button onClick={handleSave} className="self-center mt-4">
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}
