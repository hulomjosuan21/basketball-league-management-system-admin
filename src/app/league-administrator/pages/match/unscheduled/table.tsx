"use client"

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
import { useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { LeagueTeamSubmission } from "@/models/league"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useLeagueTeams } from "@/hooks/useLeagueTeam"
import { useHandleErrorWithToast } from "@/lib/utils/handleError"
import { updateLeagueTeam } from "@/services/league-service"
import { MatchStatus, MatchType } from "@/models/match/match-types"
import { useLeagueMeta } from "@/lib/stores/useLeagueMeta"
import { useMatch } from "@/hooks/userMatchQueries"
import { Badge } from "@/components/ui/badge"
import { useToMatchTeamStore } from "./matchTeamStore"

type ColumnProps = {
    handleUpdate: () => void
    updating: Record<string, boolean>
}

export const columns = ({
    handleUpdate,
    updating,
}: ColumnProps): ColumnDef<MatchType>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "match",
            header: "Match",
            cell: ({ row }) => {
                const match = row.original;
                const home = match.home_team?.team_name || "TBD";
                const away = match.away_team?.team_name || "TBD";

                return (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-xs">
                            <span>{home}</span>
                            <span className="text-primary">vs</span>
                            <span>{away}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "scheduled_date",
            header: "Scheduled Date",
            cell: ({ row }) => {
                const match = row.original as MatchType
                const scheduledDate = match.scheduled_date
                const {setMatch} = useToMatchTeamStore()
                
                const handleSetTeam = () => {
                    setMatch(match)
                }

                if (!scheduledDate) {
                    return (
                        <Button
                            size="sm"
                            className="text-xs px-2 py-0"
                            onClick={handleSetTeam}
                        >
                            Set Schedule
                        </Button>
                    )
                }

                return (
                    <span className="text-sm">
                        {new Date(scheduledDate).toLocaleString()}
                    </span>
                )
            }
        },
        {
            accessorKey: 'category',
            header: 'Match category'
        },
        {
            accessorKey: 'round_number',
            header: 'Round number'
        },
        {
            accessorKey: 'bracket_side',
            header: 'Bracket side'
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        }
    ]

type Props = {
    value: string;
}

export function UnscheduledMatchTable({ value }: Props) {
    const { leagueMeta } = useLeagueMeta()
    const league_id = leagueMeta.league_meta?.league_id;
    const { match, matchLoading } = useMatch({ league_id: league_id, division_id: value, status: MatchStatus.UNSCHEDULED })

    const handleRefresh = async () => {

    }

    const [updating, setUpdating] = useState<Record<string, boolean>>({})

    const handleUpdate = async () => {

    }

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data: match,
        columns: columns({ handleUpdate, updating }),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
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

                <div className="flex items-center gap-2">
                    {/* <Button onClick={handleRefresh} size="sm" variant="secondary">
                    <RefreshCw
                        className={cn(
                            "mr-1 h-4 w-4 transition-transform",
                            isRefreshing && "animate-spin"
                        )}
                    />
                    Refresh
                </Button> */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
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
                                        <TableCell key={cell.id}>
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
                                    {matchLoading ? 'Loading...' : 'No Matches.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}