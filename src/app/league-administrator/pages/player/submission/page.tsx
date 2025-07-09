"use client"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, CircleX, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React from "react"
import { TablePlayerSubmission } from "./table"
import { useLeagueMeta } from "@/lib/stores/useLeagueMeta"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { NoLeagueFoundAlert } from "@/components/alerts"

export type TeamSubmission = {
  team_id: string
  team_name: string
  status: "pending" | "processing" | "success" | "failed"
  ammount: number,
  player_count: number,
}

const data: TeamSubmission[] = [
  {
    team_id: "1",
    team_name: "Falcons",
    status: "success",
    ammount: 10,
    player_count: 12
  },
  {
    team_id: "2",
    team_name: "Eagles",
    status: "pending",
    ammount: 10,
    player_count: 12
  },
  {
    team_id: "3",
    team_name: "Wolves",
    status: "processing",
    ammount: 10,
    player_count: 12
  },
  {
    team_id: "4",
    team_name: "Sharks",
    status: "failed",
    ammount: 10,
    player_count: 12
  },
  {
    team_id: "5",
    team_name: "Tigers",
    status: "success",
    ammount: 10,
    player_count: 12
  },
  {
    team_id: "6",
    team_name: "Lions",
    status: "pending",
    ammount: 10,
    player_count: 12
  },
  {
    team_id: "7",
    team_name: "Panthers",
    status: "processing",
    ammount: 10,
    player_count: 12
  },
  {
    team_id: "8",
    team_name: "Hawks",
    status: "success",
    ammount: 10,
    player_count: 12
  },
  {
    team_id: "9",
    team_name: "Cobras",
    status: "failed",
    ammount: 10,
    player_count: 12
  },
  {
    team_id: "10",
    team_name: "Rhinos",
    status: "success",
    ammount: 10,
    player_count: 12
  },
  {
    team_id: "11",
    team_name: "CCS",
    status: "success",
    ammount: 10,
    player_count: 12
  },
]
export default function TeamSubmissionPage() {

  const { leagueMeta } = useLeagueMeta()

  const header = (
    <header className="sticky top-0 z-10 bg-background border-b flex items-center gap-2 py-1">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Team Submissions</h1>
        <div className="ml-auto flex items-center gap-2"></div>
      </div>
    </header>
  )

  return (
    <SidebarInset>
      <div className="flex flex-col h-screen w-full overflow-x-hidden overflow-y-auto">
        {header}
        <div className="flex flex-col gap-4 px-4 pb-4">

          {!leagueMeta && <NoLeagueFoundAlert/>}

          {leagueMeta && <TablePlayerSubmission data={data} />}
        </div>
      </div>
    </SidebarInset>
  )
}

