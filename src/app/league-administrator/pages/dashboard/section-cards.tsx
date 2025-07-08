"use client"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useLeagueMeta } from "@/lib/stores/useLeagueMeta"

export function SectionCards() {
    const { leagueMeta, setLeagueMeta } = useLeagueMeta()

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Current League</CardDescription>
          <CardTitle className="text-md font-semibold tabular-nums @[250px]/card:text-sm">
            {leagueMeta.league_meta?.league_title ?? 'No data'}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Teams</CardDescription>
          <CardTitle className="text-lg font-semibold tabular-nums @[250px]/card:text-md">
            0
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              Categories 0
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Players</CardDescription>
          <CardTitle className="text-lg font-semibold tabular-nums @[250px]/card:text-md">
            0
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Division</CardDescription>
          <CardTitle className="text-lg font-semibold tabular-nums @[250px]/card:text-md">
            0
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Division</CardDescription>
          <CardTitle className="text-lg font-semibold tabular-nums @[250px]/card:text-md">
            0
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
