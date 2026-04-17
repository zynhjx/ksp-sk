"use client"

type Announcement = {
  id: string
  title: string
  type: "important" | "event" | "info" | "reminder"
  content: string
  postedAt: string
  postedBy: string
}

type AnnouncementCardProps = {
  announcement: Announcement
}

const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "important":
        return "bg-red-50 text-red-700 border-red-200"
      case "event":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "reminder":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "info":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <article className="border border-gray-200 rounded-xl p-4 bg-theme-card-white flex items-start gap-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-180">
      {/* Type Badge */}
      <div className="flex-shrink-0 mt-0.5">
        <span
          className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border uppercase tracking-wide block w-max ${getTypeColor(
            announcement.type
          )}`}
        >
          {announcement.type}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h2 className="text-base leading-normal font-bold text-gray-900 mb-1">
          {announcement.title}
        </h2>
        <p className="m-0 text-sm text-gray-700 leading-relaxed line-clamp-2 mb-2.5">
          {announcement.content}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <p className="m-0">
            Posted by <strong className="text-gray-700">{announcement.postedBy}</strong>
          </p>
          <span className="text-gray-400">{formatDate(announcement.postedAt)}</span>
        </div>
      </div>
    </article>
  )
}

export default AnnouncementCard
