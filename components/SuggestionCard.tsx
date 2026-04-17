"use client"

import { useState } from "react"
import { Heart, Check, X, Trash2, MapPin, Calendar, User } from "lucide-react"

type SuggestionCardProps = {
  suggestion?: {
    id: string
    title: string
    category: string
    description: string
    suggestedSolution: string
    location: string
    submittedAt: Date | string
    submittedBy: string
    likesCount: number
    liked: boolean
    status: string
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

const getStatusAccent = (status: string) => {
  const s = status.toLowerCase()
  if (s === "accepted") return "bg-emerald-400"
  if (s === "declined") return "bg-red-400"
  return "bg-amber-400"
}

const getStatusBadge = (status: string) => {
  const s = status.toLowerCase()
  if (s === "accepted") return "bg-emerald-50 text-emerald-700 border-emerald-200"
  if (s === "declined") return "bg-red-50 text-red-600 border-red-200"
  return "bg-amber-50 text-amber-700 border-amber-200"
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
  submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  submittedBy: "Maria Santos",
  likesCount: 24,
  liked: false,
  status: "Pending",
}

const SuggestionCard = ({
  suggestion,
  canModify = false,
  onApprove,
  onDecline,
  onDelete,
}: SuggestionCardProps) => {
  const current = suggestion || mockSuggestion

  const [liked, setLiked] = useState(current.liked)
  const [likesCount, setLikesCount] = useState(current.likesCount)
  const [status, setStatus] = useState(current.status)

  const isAccepted = status.toLowerCase() === "accepted"
  const isDeclined = status.toLowerCase() === "declined"
  const isValidated = isAccepted || isDeclined

  const formatDate = (value: string | Date) =>
    new Date(value).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  const handleLike = () => {
    const next = !liked
    setLiked(next)
    setLikesCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)))
  }

  const handleApprove = () => {
    setStatus("Accepted")
    onApprove?.(current.id)
  }

  const handleDecline = () => {
    setStatus("Declined")
    onDecline?.(current.id)
  }

  return (
    <article className="group relative border border-gray-200 rounded-2xl bg-white flex flex-col overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200">

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
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {current.description}
          </p>
        </div>

        {/* Suggested Solution */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Suggested Solution
          </span>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {current.suggestedSolution}
          </p>
        </div>

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {[
            { icon: MapPin, label: current.location },
            { icon: Calendar, label: formatDate(current.submittedAt) },
            { icon: User, label: current.submittedBy },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
              <Icon size={12} strokeWidth={2} className="text-gray-400 shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-100 px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Status badge (shown once validated) */}
        {isValidated ? (
          <span
            className={`text-[11px] font-semibold rounded-full px-2.5 py-1 border ${getStatusBadge(status)}`}
          >
            {status}
          </span>
        ) : (
          <span
            className={`text-[11px] font-semibold rounded-full px-2.5 py-1 border ${getStatusBadge(status)}`}
          >
            {status}
          </span>
        )}

        <div className="flex items-center gap-0.5">
          {/* Like button */}
          <button
            type="button"
            onClick={handleLike}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={liked ? "Unlike" : "Like"}
          >
            <span className="text-xs font-semibold text-gray-500">{likesCount}</span>
            <Heart
              size={15}
              strokeWidth={2}
              color={liked ? "#dc2626" : "#94a3b8"}
              fill={liked ? "#dc2626" : "transparent"}
            />
          </button>

          {/* Action buttons — only when not yet validated */}
          {!isValidated && canModify && (
            <>
              <div className="w-px h-4 bg-gray-200 mx-1" />
              <button
                type="button"
                onClick={handleApprove}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all"
                aria-label="Approve"
              >
                <Check size={13} strokeWidth={2.5} />
                Approve
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                aria-label="Decline"
              >
                <X size={13} strokeWidth={2.5} />
                Decline
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(current.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                aria-label="Delete"
              >
                <Trash2 size={14} strokeWidth={2} />
              </button>
            </>
          )}
        </div>
      </footer>
    </article>
  )
}

export default SuggestionCard