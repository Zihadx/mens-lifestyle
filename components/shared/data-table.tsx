"use client";

import {
  type Column,
  type ColumnDef,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { Inbox } from "lucide-react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  getRowId?: (row: TData) => string;
}

// Pulls a plain-text label for a column, for use as the key in the mobile
// card view. Returns null for columns whose header is a custom renderer
// with no string (e.g. a select-all checkbox) — those cells render
// unlabeled and full-width in the card instead.
function getColumnLabel<TData>(column: Column<TData, unknown>): string | null {
  const meta = column.columnDef.meta as { label?: string } | undefined;
  if (meta?.label) return meta.label;
  const header = column.columnDef.header;
  if (typeof header === "string") return header;
  return null;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  isError,
  onRetry,
  emptyTitle = "No results",
  emptyDescription = "Nothing matches the current filters.",
  page,
  totalPages,
  onPageChange,
  rowSelection,
  onRowSelectionChange,
  getRowId,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: rowSelection !== undefined ? { rowSelection } : undefined,
    onRowSelectionChange: onRowSelectionChange
      ? (updater) => {
          const next = typeof updater === "function" ? updater(rowSelection ?? {}) : updater;
          onRowSelectionChange(next);
        }
      : undefined,
    getRowId: getRowId as any,
    enableRowSelection: !!onRowSelectionChange,
  });

  if (isLoading) {
    return (
      <div className="min-w-0 overflow-x-auto rounded-lg border border-border p-4">
        <TableSkeleton rows={6} cols={columns.length} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-w-0 rounded-lg border border-border">
        <ErrorState title="Couldn't load data" onRetry={onRetry} />
      </div>
    );
  }

  const rows = table.getRowModel().rows;

  return (
    <div className="min-w-0 space-y-4">
      {data.length === 0 ? (
        <div className="rounded-lg border border-border">
          <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <>
          {/* ============================================================
              DESKTOP / TABLET — real table, sm and up.
              Horizontal scroll stays as a safety net for very wide tables
              even on tablet/laptop widths.
          ============================================================ */}
          <div className="hidden min-w-0 overflow-hidden rounded-lg border border-border sm:block">
            <div className="w-full overflow-x-auto overscroll-x-contain">
              <Table className="min-w-max">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="whitespace-nowrap">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* ============================================================
              MOBILE — stacked cards, below sm.
              Each row becomes a card; each cell becomes a label/value line
              (unlabeled + full width if the column has no string header,
              e.g. a checkbox or actions column).
          ============================================================ */}
          <div className="space-y-3 sm:hidden">
            {rows.map((row) => (
              <div
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className="rounded-lg border border-border bg-card p-3 shadow-sm data-[state=selected]:border-primary data-[state=selected]:bg-primary/5"
              >
                <div className="space-y-2">
                  {row.getVisibleCells().map((cell) => {
                    const label = getColumnLabel(cell.column);
                    const content = flexRender(cell.column.columnDef.cell, cell.getContext());

                    if (!label) {
                      return (
                        <div key={cell.id} className="flex items-center justify-between gap-2">
                          {content}
                        </div>
                      );
                    }

                    return (
                      <div key={cell.id} className="flex items-start justify-between gap-3 text-sm">
                        <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {label}
                        </span>
                        <span className="min-w-0 text-right wrap-break-word">{content}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {page !== undefined && totalPages !== undefined && onPageChange && (
        <div className="flex justify-center overflow-x-auto">
          <Pagination className="py-4" page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}