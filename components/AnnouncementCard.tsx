"use client"

import { AlertTriangle, Bell, CalendarDays, Eye, Megaphone, MoreVertical, Sparkles, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

type Announcement = {
  id: string
  title: string
  type: "general" | "event" | "urgent" | "reminder" | "opportunity"
  content: string
  postedAt: string
  postedBy: string
  barangay: string
}

type AnnouncementCardProps = {
  announcement: Announcement
  onView?: (announcement: Announcement) => void
  onDelete?: (announcement: Announcement) => void
}

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "urgent":
      return "bg-red-50 text-red-700 border-red-200"
    case "event":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "reminder":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "opportunity":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "general":
      return "bg-blue-50 text-blue-700 border-blue-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

const getTypeIconBg = (type: string) => {
  switch (type.toLowerCase()) {
    case "urgent":      return "bg-red-100 border-red-200"
    case "event":       return "bg-purple-100 border-purple-200"
    case "reminder":    return "bg-amber-100 border-amber-200"
    case "opportunity": return "bg-emerald-100 border-emerald-200"
    case "general":
    default:            return "bg-blue-100 border-blue-200"
  }
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "urgent":
      return <AlertTriangle size={22} className="text-red-500" />
    case "event":
      return <CalendarDays size={22} className="text-purple-500" />
    case "reminder":
      return <Bell size={22} className="text-amber-500" />
    case "opportunity":
      return <Sparkles size={22} className="text-emerald-500" />
    case "general":
    default:
      return <Megaphone size={22} className="text-blue-500" />
  }
}

const AnnouncementCard = ({ announcement, onView, onDelete }: AnnouncementCardProps) => {
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-theme-card-white shadow-sm transition-all duration-180 hover:shadow-md hover:border-gray-300">
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-start gap-4">
          {/* Type icon */}
          <div
            className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-full border ${getTypeIconBg(announcement.type)}`}
          >
            {getTypeIcon(announcement.type)}
          </div>

          {/* Title + content + badge + menu */}
          <div className="flex flex-1 flex-col gap-4 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-gray-900 leading-snug">
                  {announcement.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3 wrap-break-word">
                  {announcement.content}
                </p>
              </div>
              <div className="flex items-start gap-2 shrink-0">
                <span
                  className={`inline-flex shrink-0 rounded-2xl border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${getTypeColor(
                    announcement.type
                  )}`}
                >
                  {announcement.type}
                </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-7 text-gray-400 hover:text-gray-700 -mt-0.5">
                        <MoreVertical size={16} />
                        <span className="sr-only">More actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => onView?.(announcement)}>
                        <Eye size={13} strokeWidth={2} className="mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(announcement)}>
                        <Trash2 size={13} strokeWidth={2} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">
            Posted by <strong className="text-gray-700">{announcement.postedBy}</strong>
          </p>
          <span className="text-xs text-gray-400">
            {formatDate(announcement.postedAt)}
          </span>
        </div>
      </div>
    </article>
  )
}

export default AnnouncementCard
