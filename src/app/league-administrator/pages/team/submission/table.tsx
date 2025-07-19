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
import { PaymentStatus, PaymentStatusBadge, SubmissionStatus, SubmissionStatusBadge } from "./badges"
import { usePaymentSheetStore } from "./store"
import { useLeagueTeams } from "@/hooks/useLeagueTeam"
import { useHandleErrorWithToast } from "@/lib/utils/handleError"
import { updateLeagueTeam } from "@/services/league-service"

type ColumnProps = {
    handleUpdateStatus: (league_team_id: string, status: string) => void
    updating: Record<string, boolean>
}

export const columns = ({
    handleUpdateStatus,
    updating,
}: ColumnProps): ColumnDef<LeagueTeamSubmission>[] => {
    return [
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
            accessorKey: "team_logo_url",
            header: "Logo",
            cell: ({ row }) => {
                const logo = row.getValue("team_logo_url") as string
                const team = row.original.team_name

                return (
                    <Avatar className="h-10 w-10 rounded-md overflow-hidden">
                        <AvatarImage src={logo} alt={team} className="object-cover" />
                        <AvatarFallback className="text-xs">T</AvatarFallback>
                    </Avatar>
                )
            },
            enableSorting: false,
        },
        {
            accessorKey: "team_name",
            header: "Team Name",
        },
        {
            accessorKey: "email",
            header: "Email"
        },
        {
            accessorKey: "contact_number",
            header: "Contact #"
        },
        {
            accessorKey: "payment_status",
            header: "Fee Status", cell: ({ row }) => {
                const status = row.getValue("payment_status")
                return <PaymentStatusBadge status={status} />
            },
        },
        {
            accessorKey: "status",
            header: "Submission Status",
            cell: ({ row }) => {
                const status = row.getValue("status")
                const teamId = row.original.league_team_id

                const isLoading = updating[teamId]

                return isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                    <SubmissionStatusBadge status={status} />
                )
            },
        },
        {
            accessorKey: "amount_paid",
            header: () => <div className="text-right">Amount</div>,
            cell: ({ row }) => {
                const value = row.getValue("amount_paid") as number
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "PHP",
                }).format(value)
                return <div className="text-right font-medium">{formatted}</div>
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const { openSheet } = usePaymentSheetStore()
                const submission = row.original
                const isLoading = updating[submission.team_id]

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
                                <DropdownMenuItem
                                    onClick={() => openSheet({ id: submission.league_team_id, description: submission.team_name, amount_paid: submission.amount_paid, payment_status: submission.payment_status, category_id: submission.category_id })}
                                >
                                    Set Manual Payment
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleUpdateStatus(submission.league_team_id, "Accepted")}>Accept</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(submission.league_team_id, "Rejected")}>Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        }
    ]
}

export function TableTeamSubmission({ category_id }: { category_id: string }) {
    const {
        leagueTeams: data,
        refetchLeagueTeams: refresh,
        leagueTeamsLoading
    } = useLeagueTeams(category_id)

    const memoizedData = useMemo(() => data ?? [], [data])
    const handleError = useHandleErrorWithToast()
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = async () => {
        if (!refresh) return
        setIsRefreshing(true)
        try {
            await refresh()
        } finally {
            setIsRefreshing(false)
        }
    }

    const [updating, setUpdating] = useState<Record<string, boolean>>({})

    const handleUpdateStatus = async (league_team_id: string, status: string) => {
        try {
            setUpdating((prev) => ({ ...prev, [league_team_id]: true }))
            await updateLeagueTeam({
                league_team_id,
                fields: { status },
            })
            await refresh?.()
        } catch (e) {
            handleError(e)
        } finally {
            setUpdating((prev) => ({ ...prev, [league_team_id]: false }))
        }
    }

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data: memoizedData,
        columns: columns({ handleUpdateStatus, updating }),
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
                    <Button onClick={handleRefresh} size="sm" variant="secondary">
                        <RefreshCw
                            className={cn(
                                "mr-1 h-4 w-4 transition-transform",
                                isRefreshing && "animate-spin"
                            )}
                        />
                        Refresh
                    </Button>
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
                                    {leagueTeamsLoading ? 'Loading...':'No Teams.'}
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