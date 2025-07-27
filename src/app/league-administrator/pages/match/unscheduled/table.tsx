"use client"

import {
    ColumnDef,
    SortingState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    VisibilityState,
    flexRender,
} from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MatchType } from "@/models/match/match-types"
import { usePersistentMatchStore } from "./matchTeamStore"

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
                const m = row.original as MatchType;
                const scheduledDate = m.scheduled_date;
                const { openSheet } = usePersistentMatchStore();

                const handleSetTeam = () => {
                    openSheet(m);
                };

                if (!scheduledDate) {
                    return (
                        <Button
                            size="sm"
                            className="text-xs px-2 py-0"
                            onClick={handleSetTeam}
                        >
                            Set Schedule
                        </Button>
                    );
                }

                return (
                    <span className="text-sm">
                        {new Date(scheduledDate).toLocaleString()}
                    </span>
                );
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
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* Add dropdown actions here if needed */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        }
    ]

type Props = {
    data: MatchType[];
    isLoading: boolean;
}

export function UnscheduledMatchTable({ data, isLoading }: Props) {
    const [updating, setUpdating] = useState<Record<string, boolean>>({});

    const handleUpdate = async () => {
        // handle update logic here
    }

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: data,
        columns: columns({ handleUpdate, updating }),
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
        },
    });

    useEffect(() => {
        table.setPageSize(10);
    }, [table]);

    return (
        <div className="w-full">
            <div className="rounded-md border mt-4">
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
                                    {isLoading ? 'Loading...' : 'No Matches.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getSelectedRowModel().rows.length} of{" "}
                    {table.getRowModel().rows.length} row(s) selected.
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
    );
}
