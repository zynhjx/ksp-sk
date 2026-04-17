"use client"

import { useMemo, useState } from "react"
import AnnouncementCard from "@/components/AnnouncementCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Announcement = {
  id: string
  title: string
  type: "important" | "event" | "info" | "reminder"
  content: string
  postedAt: string
  postedBy: string
}

const announcements: Announcement[] = [
  {
    id: "1",
    title: "SK Fitness Challenge 2025 Registration Open",
    type: "event",
    content:
      "Calling all youth! The SK Fitness Challenge 2025 is now accepting registrations. This is a 4-week challenge featuring cardio, strength training, and flexibility exercises. Winners will receive prizes and recognition. Register at the SK Office before April 30.",
    postedAt: "2025-04-10T09:30:00Z",
    postedBy: "SK Council",
  },
  {
    id: "2",
    title: "Important: Curfew Policy Update",
    type: "important",
    content:
      "Effective April 15, 2025, the barangay curfew policy has been updated. Youth aged 16-17 must be home by 10:00 PM on school nights. For questions or concerns, please contact the SK Office.",
    postedAt: "2025-04-08T14:00:00Z",
    postedBy: "Barangay Hall",
  },
  {
    id: "3",
    title: "Community Cleanup Drive This Saturday",
    type: "reminder",
    content:
      "Reminder: We are hosting a barangay cleanup drive this Saturday at 7:00 AM in the plaza. Bring your own gloves and tools. Free breakfast will be provided. All youth are welcome and encouraged to participate!",
    postedAt: "2025-04-09T11:15:00Z",
    postedBy: "Environmental Committee",
  },
  {
    id: "4",
    title: "New Scholarship Program Launched",
    type: "info",
    content:
      "Good news! A new scholarship program is now available for eligible youth pursuing higher education. The program covers tuition fees and provides a monthly allowance. Interested applicants should submit their applications by May 15, 2025.",
    postedAt: "2025-04-07T10:45:00Z",
    postedBy: "SK Council",
  },
  {
    id: "5",
    title: "Sports Night - Volleyball Tournament",
    type: "event",
    content:
      "Join us for an exciting volleyball tournament next week! Teams of 6 players per side are welcome. Registration is free and open until April 20. Come support your barangay and have fun with fellow youth!",
    postedAt: "2025-04-06T15:20:00Z",
    postedBy: "Sports Committee",
  },
  {
    id: "6",
    title: "Profile Data Update Reminder",
    type: "reminder",
    content:
      "Heads up! Please update your profile information if any of your details have changed. Accurate data helps us serve you better. Visit your profile settings to review and update your information.",
    postedAt: "2025-04-05T08:00:00Z",
    postedBy: "SK Council",
  },
]

const typeOptions = ["All", "Important", "Event", "Info", "Reminder"]

const Announcements = () => {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")

  const filteredAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase()

    return announcements.filter((announcement) => {
      const matchesSearch =
        !query ||
        [announcement.title, announcement.content].some((value) =>
          value.toLowerCase().includes(query)
        )

      const matchesType =
        typeFilter === "All" ||
        announcement.type.toLowerCase() === typeFilter.toLowerCase()

      return matchesSearch && matchesType
    })
  }, [search, typeFilter])

  return (
    <>
      <div className="flex flex-col mb-8">
        <div className="flex mb-6">
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-3xl text-theme-dark-blue">
              Announcements
            </h1>
            <p className="text-gray-500">
              Stay updated with latest news and important information
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white flex-1 px-4 py-3 rounded-sm focus:outline-0 border border-gray-200"
            placeholder="Search announcements..."
          />

          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 h-12 bg-white border border-gray-200 rounded-sm px-4">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredAnnouncements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-theme-card-white p-8 text-center text-gray-500">
          No announcements match your search or filters.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      )}
    </>
  )
}

export default Announcements
