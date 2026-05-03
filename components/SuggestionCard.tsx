"use client"

import { Eye, MapPin, MoreVertical, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type SuggestionCardProps = {
  suggestion?: {
    id: string
    title: string
    category: string
    description: string
    suggestedSolution: string
    location: string
  }
  canModify?: boolean
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export const getCategoryColor = (category: string) => {
  switch (category) {
    case "Education":
      return "text-blue-600"
    case "Employment":
      return "text-violet-600"
    case "Health":
      return "text-rose-600"
    case "Sports":
      return "text-green-600"
    case "Environment":
      return "text-teal-600"
    case "Community / Social":
      return "text-orange-600"
    default:
      return "text-gray-500"
  }
}

const mockSuggestion = {
  id: "1",
  title: "Improve Street Lighting in Barangay",
  category: "Community / Social",
  description:
    "Many areas in our barangay lack adequate street lighting, making it unsafe for residents to walk at night. This poses security risks and impacts quality of life.",
  suggestedSolution:
    "Install LED street lights on major streets and pathways. Consider solar-powered options for cost efficiency and sustainability.",
  location: "Main Street, Various Areas",
}

const SuggestionCard = ({
  suggestion,
  canModify = false,
  onView,
  onEdit,
  onDelete,
}: SuggestionCardProps) => {
  const current = suggestion || mockSuggestion

  return (
    <article className="group relative self-start border border-gray-200 rounded-2xl bg-white flex flex-col overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200">

      <div className="flex flex-col gap-3 p-4">
        {/* Title + Menu */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold text-gray-900 leading-snug flex-1">
            {current.title}
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="More actions"
                className="shrink-0 h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <MoreVertical size={15} strokeWidth={2} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onView?.(current.id)}>
                <Eye size={13} strokeWidth={2} className="mr-2" />
                View
              </DropdownMenuItem>
              {canModify && (
                <>
                  <DropdownMenuItem onClick={() => onEdit?.(current.id)}>
                    <Pencil size={13} strokeWidth={2} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => onDelete?.(current.id)}
                  >
                    <Trash2 size={13} strokeWidth={2} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Description
          </span>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-5">
            {current.description}
          </p>
        </div>

        {/* Suggested Solution */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Suggested Solution
          </span>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-5">
            {current.suggestedSolution}
          </p>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Category
          </span>
          <span className={`text-sm font-medium ${getCategoryColor(current.category)}`}>
            {current.category}
          </span>
        </div>

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin size={12} strokeWidth={2} className="text-gray-400 shrink-0" />
          <span className="truncate">{current.location}</span>
        </div>
      </div>
    </article>
  )
}

export default SuggestionCard