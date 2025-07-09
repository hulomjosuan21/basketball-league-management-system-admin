'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLeagueMeta } from "@/lib/stores/useLeagueMeta"

export function SectionCards() {
  const { leagueMeta } = useLeagueMeta()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mx-auto px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Current League</CardDescription>
          <CardTitle className="text-md font-semibold tabular-nums @[250px]/card:text-sm">
            {leagueMeta.league_meta?.league_title ?? "No data"}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Teams</CardDescription>
          <CardTitle className="text-md font-semibold tabular-nums @[250px]/card:text-sm">0</CardTitle>
          <div className="mt-2">
            <Badge variant="outline">Categories 0</Badge>
          </div>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Players</CardDescription>
          <CardTitle className="text-md font-semibold tabular-nums @[250px]/card:text-sm">0</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
