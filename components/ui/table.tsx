import * as React from "react"
import { cn } from "@/lib/utils"

type TableProps = React.TableHTMLAttributes<HTMLTableElement>
type TableSectionProps = React.HTMLAttributes<HTMLTableSectionElement>
type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>
type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom text-sm sm:text-base",
        className
      )}
      {...props}
    />
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
  )
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-b-0", className)} {...props} />
  )
)
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("bg-slate-50", className)} {...props} />
  )
)
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "transition-colors data-[state=selected]:bg-slate-100/60 even:bg-slate-50/50",
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-slate-700 [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
)
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("px-4 py-3 align-middle text-sm text-slate-600", className)}
      {...props}
    />
  )
)
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-slate-500", className)}
      {...props}
    />
  )
)
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}
