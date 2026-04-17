"use client"

import { useMemo, useState } from "react"
import ProgramCard from "@/components/ProgramCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const programs = [
  {
    id: "1",
    name: "Community Health Drive",
    status: "Ongoing",
    category: "Health",
    location: "Barangay Center",
    description:
      "A community health initiative offering free check-ups, counseling, and nutrition guidance for residents.",
    createdAt: "2025-03-18T10:00:00Z",
    participants: 156,
    startDate: "2025-04-01T08:00:00Z",
    untilDate: "2025-04-15T17:00:00Z",
  },
  {
    id: "2",
    name: "Youth Leadership Workshop",
    status: "Upcoming",
    category: "Education",
    location: "City Hall Annex",
    description:
      "A leadership training workshop for young people who want to become active community leaders and civic volunteers.",
    createdAt: "2025-02-28T14:30:00Z",
    participants: 48,
    startDate: "2025-05-05T09:00:00Z",
    untilDate: "2025-05-05T16:00:00Z",
  },
  {
    id: "3",
    name: "Livelihood Skills Training",
    status: "Completed",
    category: "Livelihood",
    location: "Training Center",
    description:
      "A practical livelihood program that teaches basic sewing, baking, and small business planning for youth entrepreneurs.",
    createdAt: "2025-01-20T09:00:00Z",
    participants: 72,
    startDate: "2025-02-01T08:00:00Z",
    untilDate: "2025-02-14T16:00:00Z",
  },
  {
    id: "4",
    name: "Barangay Tree Planting",
    status: "Upcoming",
    category: "Environment",
    location: "River Park",
    description:
      "A tree planting drive focused on restoring green spaces, reducing pollution, and involving youth volunteers.",
    createdAt: "2025-03-05T12:00:00Z",
    participants: 32,
    startDate: "2025-05-12T07:30:00Z",
    untilDate: "2025-05-12T12:00:00Z",
  },
]

const statusOptions = ["All", "Ongoing", "Upcoming", "Completed"]
const categoryOptions = ["All", "Health", "Education", "Livelihood", "Environment"]

const Programs = () => {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase()

    return programs.filter((program) => {
      const matchesSearch =
        !query ||
        [program.name, program.description, program.category, program.location].some((value) =>
          value.toLowerCase().includes(query)
        )

      const matchesStatus =
        statusFilter === "All" || program.status.toLowerCase() === statusFilter.toLowerCase()

      const matchesCategory =
        categoryFilter === "All" || program.category.toLowerCase() === categoryFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [search, statusFilter, categoryFilter])

  const filterComponents = (
    <>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40 h-12.5! bg-white! border border-gray-200 rounded-sm px-4">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-40 h-12.5! bg-white! border border-gray-200 rounded-sm px-4">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )

  return (
    <>
      <div className="flex flex-col mb-8">
        <div className="flex mb-6">
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-3xl text-theme-dark-blue">Programs</h1>
            <p className="text-gray-500">Explore ongoing and upcoming activities.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white flex-1 px-4 py-3 rounded-sm focus:outline-0 border border-gray-200"
            placeholder="Search by program name"
          />

          <div className="flex gap-2">
            {filterComponents}
          </div>
        </div>
      </div>

      {filteredPrograms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-theme-card-white p-8 text-center text-gray-500">
          No programs match your search or filters.
        </div>
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}
        >
          {filteredPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </>
  )
}

export default Programs