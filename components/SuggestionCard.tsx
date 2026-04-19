"use client"

import { MapPin, Trash2 } from "lucide-react"

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
  onApprove?: (id: string) => void
  onDecline?: (id: string) => void
  onDelete?: (id: string) => void
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Education":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Employment":
      return "bg-violet-50 text-violet-700 border-violet-200"
    case "Health":
      return "bg-rose-50 text-rose-700 border-rose-200"
    case "Sports":
      return "bg-green-50 text-green-700 border-green-200"
    case "Environment":
      return "bg-teal-50 text-teal-700 border-teal-200"
    case "Community / Social":
      return "bg-orange-50 text-orange-700 border-orange-200"
    default:
      return "bg-gray-100 text-gray-600 border-gray-200"
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
  onDelete,
}: SuggestionCardProps) => {
  const current = suggestion || mockSuggestion

  return (
    <article className="group relative self-start border border-gray-200 rounded-2xl bg-white flex flex-col overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200">

      <div className="flex flex-col gap-3 p-4">
        {/* Title + Category */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold text-gray-900 leading-snug flex-1">
            {current.title}
          </h2>
          <span
            className={`shrink-0 text-[11px] font-semibold rounded-full px-2.5 py-1 border whitespace-nowrap ${getCategoryColor(current.category)}`}
          >
            {current.category}
          </span>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Description
          </span>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap wrap-anywhere">
            {current.description}
          </p>
        </div>

        {/* Suggested Solution */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Suggested Solution
          </span>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap wrap-anywhere">
            {current.suggestedSolution}
          </p>
        </div>

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* Location + Delete */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={12} strokeWidth={2} className="text-gray-400 shrink-0" />
            <span>{current.location}</span>
          </div>

          {canModify && onDelete ? (
            <button
              type="button"
              aria-label={`Delete ${current.title}`}
              title="Delete suggestion"
              className="h-8 w-8 shrink-0 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
              onClick={() => onDelete(current.id)}
            >
              <Trash2 size={13} strokeWidth={2} className="mx-auto" />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default SuggestionCard