"use client"

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    ColumnDef,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
} from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

import { Checkbox } from "@/components/ui/checkbox"

export type EditableTableProps<T> = {
    data: T[]
    columns: ColumnDef<T>[]
    onUpdate: (rowIndex: number, key: keyof T, value: string) => void
    onDelete: (rowIndex: number) => void
    onAdd: () => void
    filterColumn?: keyof T
}

export function EditableTable<T>({
    data,
    columns,
    onUpdate,
    onDelete,
    onAdd,
    filterColumn,
}: EditableTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
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
        <div className="space-y-2 w-full">
            <div className="flex items-center py-4 gap-2">
                <Button onClick={onAdd} size="sm">
                    <Plus className="w-4 h-4 mr-1" /> Add
                </Button>

                {filterColumn && table.getColumn(filterColumn as string) && (
                    <Input
                        placeholder={`Filter ${String(filterColumn).replace(/_/g, ' ')}...`}
                        value={(table.getColumn(filterColumn as string)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(filterColumn as string)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    className="capitalize"
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="overflow-auto rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                                <TableHead></TableHead>
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <Input
                                                value={cell.getValue() as string}
                                                onChange={(e) =>
                                                    onUpdate(row.index, cell.column.id as keyof T, e.target.value)
                                                }
                                            />
                                        </TableCell>
                                    ))}
                                    <TableCell className="w-[1%] text-right">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => onDelete(row.index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                                    No entries.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 pb-4">
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