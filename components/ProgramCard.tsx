"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, MapPin, MoreVertical, Pencil, Trash2 } from "lucide-react"

type Program = {
  id: string
  name: string
  status: string
  category: string
  location: string
  description: string
  createdAt: string
  updatedAt: string
  participants: number
  startDate: string
  untilDate: string
}

type ProgramCardProps = {
  program: Program
  onView?: (program: Program) => void
  onEdit?: (program: Program) => void
  onDelete?: (program: Program) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  health:         "text-rose-700",
  education:      "text-violet-700",
  livelihood:     "text-amber-700",
  environment:    "text-teal-700",
  infrastructure: "text-sky-700",
  community:      "text-emerald-700",
  youth:          "text-blue-700",
  sports:         "text-orange-700",
  technology:     "text-indigo-700",
  culture:        "text-fuchsia-700",
  safety:         "text-red-700",
  welfare:        "text-pink-700",
  employment:     "text-lime-700",
  agriculture:    "text-green-700",
  innovation:     "text-cyan-700",
  outreach:       "text-yellow-700",
  disaster:       "text-zinc-700",
  nutrition:      "text-purple-700",
  tourism:        "text-teal-700",
  governance:     "text-slate-700",
}

const STATUS_COLORS: Record<string, string> = {
  ongoing:   "text-emerald-700",
  upcoming:  "text-blue-700",
  completed: "text-slate-600",
}

const getCategoryColor = (category: string) =>
  CATEGORY_COLORS[category.toLowerCase()] ?? "text-gray-700"

const getStatusColor = (status: string) =>
  STATUS_COLORS[status.toLowerCase()] ?? "text-gray-700"

const Badge = ({ value, colorClass }: { value: string; colorClass: string }) => (
  <span className={`text-sm font-semibold leading-snug ${colorClass}`}>
    {value}
  </span>
)

const MetaItem = ({
  label,
  value,
}: {
  label: string
  value: string
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-800 leading-snug">{value}</span>
  </div>
)

const ProgramCard = ({ program, onView, onEdit, onDelete }: ProgramCardProps) => {
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

  return (
    <article className="group relative self-start border border-gray-200 rounded-2xl bg-white flex flex-col overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200 max-h-120">
      <div className="flex flex-col gap-3 p-4 overflow-hidden flex-1">
        {/* Title + Dropdown Menu */}
        <div className="flex items-start justify-between gap-2 shrink-0">
          <h2 className="text-base font-semibold text-gray-900 leading-snug flex-1">
            {program.name}
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Program options"
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(program)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit?.(program)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(program)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description - clamped to 6 lines */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-6 shrink-0">
          {program.description}
        </p>

        {/* Divider */}
        <hr className="border-gray-100 shrink-0" />

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 shrink-0">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Status</span>
            <Badge value={program.status} colorClass={getStatusColor(program.status)} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Category</span>
            <Badge value={program.category} colorClass={getCategoryColor(program.category)} />
          </div>
          <MetaItem label="Created" value={formatDate(program.createdAt)} />
          <MetaItem label="Last Modified" value={formatDate(program.updatedAt)} />
          <MetaItem label="Start" value={formatDateTime(program.startDate)} />
          <MetaItem label="Until" value={formatDateTime(program.untilDate)} />
        </div>
      </div>

      {/* Location Footer */}
      <div className="shrink-0 flex items-center gap-1.5 border-t border-gray-100 px-4 py-2.5">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        <span className="text-xs text-gray-500 truncate">{program.location}</span>
      </div>
    </article>
  )
}

export default ProgramCard