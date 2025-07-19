"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useMatchTeamStore } from "./matchTeamStore"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMatchTeams } from "@/hooks/useMatchTeam"
import { MatchTeam } from "@/models/league"

export const columns = ({
    isTeamSelected,
    onSelect,
}: {
    isTeamSelected: (team: MatchTeam) => boolean
    onSelect: (team: MatchTeam) => void
}): ColumnDef<MatchTeam>[] => [
        {
            id: "select",
            header: () => "Select",
            cell: ({ row }) => {
                const team = row.original
                return (
                    <div className="flex justify-start">
                        <Checkbox
                            checked={isTeamSelected(team)}
                            onCheckedChange={() => onSelect(team)}
                            aria-label="Select team"
                        />
                    </div>
                )
            },
            size: 10,
        },
        {
            id: "team",
            header: () => "Team",
            cell: ({ row }) => {
                const team = row.original

                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-sm overflow-hidden">
                            <AvatarImage src={team.team_logo_url} alt={team.team_name} className="object-cover" />
                            <AvatarFallback className="text-xs">T</AvatarFallback>
                        </Avatar>
                        <span>{team.team_name}</span>
                    </div>
                )
            },
        },

        {
            id: "actions",
            enableHiding: false,
            header: "",
            cell: ({ row }) => (
                <div className="flex justify-end pr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" />
                    </DropdownMenu>
                </div>
            ),
        }
    ]

export function MatchTeamTable({ category_id }: { category_id: string }) {
    const {matchTeams: data, matchTeamsLoading} = useMatchTeams(category_id)

    const { homeTeam, awayTeam, setHomeTeam, setAwayTeam } = useMatchTeamStore()
    const [selectionOrder, setSelectionOrder] = useState<string[]>([])

    const isTeamSelected = useCallback(
        (team: MatchTeam) => {
            return (
                homeTeam?.league_team_id === team.league_team_id ||
                awayTeam?.league_team_id === team.league_team_id
            )
        },
        [homeTeam, awayTeam]
    )

    const onSelect = useCallback(
        (team: MatchTeam) => {
            setSelectionOrder((prev) => {
                const exists = prev.includes(team.league_team_id)

                let newOrder: string[] = []

                if (exists) {
                    // Remove the team if already selected
                    newOrder = prev.filter(id => id !== team.league_team_id)
                } else {
                    // Add team, but keep max 2
                    newOrder = [...prev, team.league_team_id].slice(-2)
                }

                // Get corresponding team objects
                const selectedTeams = newOrder.map(
                    id => data.find(t => t.league_team_id === id)!
                )

                setHomeTeam(selectedTeams[0] || null)
                setAwayTeam(selectedTeams[1] || null)

                return newOrder
            })
        },
        [data, setHomeTeam, setAwayTeam]
    )

    const table = useReactTable({
        data,
        columns: useMemo(() => columns({ isTeamSelected, onSelect }), [isTeamSelected, onSelect]),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    useEffect(() => {
        table.setPageSize(10)
    }, [table])

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Filter team name..."
                    value={(table.getColumn("team_name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("team_name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-md border">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="text-left p-2"
                                        style={{ width: header.column.getSize() }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="text-left p-2"
                                            style={{ width: cell.column.getSize() }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    {matchTeamsLoading ? 'Loading...' : 'No Teams.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft />
                </Button>
                <Button
                    variant="outline"
                    className="size-8"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight />
                </Button>
            </div>
        </div>
    )
}
