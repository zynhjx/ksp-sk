"use client"

import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import ProgramCard from "@/components/ProgramCard"
import EmptyState from "@/components/EmptyState"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { logActivity } from "@/lib/logActivity"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

type CreateProgramPayload = {
  programName: string
  description: string
  category: string
  location: string
  startDate: string
  endDate: string
}

type UpdateProgramPayload = Partial<CreateProgramPayload>

const API_BASE = process.env.NEXT_PUBLIC_EXPRESS_API_URL

const statusOptions = ["All", "Ongoing", "Upcoming", "Completed"]
const categoryOptions = [
  "All",
  "Health",
  "Education",
  "Livelihood",
  "Environment",
  "Community",
  "Youth",
  "Sports",
  "Technology",
  "Culture",
  "Safety",
  "Welfare",
  "Employment",
  "Agriculture",
  "Innovation",
  "Infrastructure",
  "Outreach",
  "Disaster",
  "Nutrition",
  "Tourism",
  "Governance",
]

type RawProgram = {
  id?: string | number
  name?: string
  program_name?: string
  programName?: string
  title?: string
  status?: string
  category?: string
  location?: string
  venue?: string
  description?: string
  details?: string
  createdAt?: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
  participants?: number
  participant_count?: number
  startDate?: string
  start_date?: string
  untilDate?: string
  until_date?: string
  end_date?: string
}

const Programs = () => {
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>([])
  const [loadingPrograms, setLoadingPrograms] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newCategory, setNewCategory] = useState("Health")
  const [newLocation, setNewLocation] = useState("")
  const [newStartDate, setNewStartDate] = useState("")
  const [newEndDate, setNewEndDate] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editCategory, setEditCategory] = useState("Health")
  const [editLocation, setEditLocation] = useState("")
  const [editStartDate, setEditStartDate] = useState("")
  const [editEndDate, setEditEndDate] = useState("")

  const getProgramStatus = (startIso: string, endIso: string) => {
    const now = Date.now()
    const start = new Date(startIso).getTime()
    const end = new Date(endIso).getTime()

    if (Number.isNaN(start) || Number.isNaN(end)) return "Upcoming"
    if (now < start) return "Upcoming"
    if (now > end) return "Completed"
    return "Ongoing"
  }

  const toIsoDate = (value: string) => new Date(value).toISOString()

  const toDateTimeInput = (value: string) => {
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return ""

    const year = parsed.getFullYear()
    const month = String(parsed.getMonth() + 1).padStart(2, "0")
    const day = String(parsed.getDate()).padStart(2, "0")
    const hours = String(parsed.getHours()).padStart(2, "0")
    const minutes = String(parsed.getMinutes()).padStart(2, "0")

    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const normalizeProgram = (value: RawProgram): Program => {
    const startDate = String(value.startDate || value.start_date || new Date().toISOString())
    const untilDate = String(value.untilDate || value.until_date || value.end_date || startDate)

    return {
      id: String(value.id || crypto.randomUUID()),
      name: String(value.name || value.program_name || value.programName || value.title || "Untitled Program"),
      status: String(value.status || getProgramStatus(startDate, untilDate)),
      category: String(value.category || "Community"),
      location: String(value.location || value.venue || "TBA"),
      description: String(value.description || value.details || "No description provided."),
      createdAt: String(value.createdAt || value.created_at || new Date().toISOString()),
      updatedAt: String(value.updatedAt || value.updated_at || value.createdAt || value.created_at || new Date().toISOString()),
      participants: Number(value.participants || value.participant_count || 0),
      startDate,
      untilDate,
    }
  }

  const fetchPrograms = useCallback(
    async (showLoader = false) => {
      if (!API_BASE) {
        setLoadError("Missing API URL configuration.")
        setLoadingPrograms(false)
        return false
      }

      if (showLoader) {
        setLoadingPrograms(true)
      }

      try {
        const res = await fetch(`${API_BASE}/api/sk/programs`, {
          method: "GET",
          headers: {
            "x-app-type": "sk",
          },
          credentials: "include",
        })

        if (res.status === 401) {
          toast.error("Your session expired. Please log in again.")
          router.push("/auth/login")
          return false
        }

        if (res.status === 403) {
          setLoadError("You do not have permission to view programs.")
          return false
        }

        const body = await res.json().catch(() => ({}))

        if (!res.ok) {
          setLoadError(body.message || "Failed to load programs.")
          return false
        }

        const records = Array.isArray(body?.data)
          ? (body.data as RawProgram[])
          : Array.isArray(body)
            ? (body as RawProgram[])
            : []

        setPrograms(records.map((item) => normalizeProgram(item)))
        setLoadError(null)
        return true
      } catch {
        setLoadError("Unable to connect to the server. Please try again.")
        return false
      } finally {
        setLoadingPrograms(false)
      }
    },
    [router]
  )

  useEffect(() => {
    void fetchPrograms(true)
  }, [fetchPrograms])

  const resetCreateForm = () => {
    setStatusFilter("All")
    setCategoryFilter("All")
    setNewTitle("")
    setNewDescription("")
    setNewCategory("Health")
    setNewLocation("")
    setNewStartDate("")
    setNewEndDate("")
  }

  const handleCreateProgram = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!API_BASE) {
      toast.error("Missing API URL configuration.")
      return
    }

    const title = newTitle.trim()
    const description = newDescription.trim()
    const location = newLocation.trim()

    if (!title || !description || !location || !newStartDate || !newEndDate) {
      toast.error("Please complete all required fields.")
      return
    }

    const startIso = toIsoDate(newStartDate)
    const endIso = toIsoDate(newEndDate)

    if (Number.isNaN(new Date(startIso).getTime()) || Number.isNaN(new Date(endIso).getTime())) {
      toast.error("Please enter valid start and end dates.")
      return
    }

    if (new Date(startIso).getTime() > new Date(endIso).getTime()) {
      toast.error("End date must be after the start date.")
      return
    }

    const payload: CreateProgramPayload = {
      programName: title,
      description,
      category: newCategory,
      location,
      startDate: startIso,
      endDate: endIso,
    }

    try {
      setIsCreating(true)

      const res = await fetch(`${API_BASE}/api/sk/programs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-type": "sk",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (res.status === 401) {
        toast.error("Your session expired. Please log in again.")
        router.push("/auth/login")
        return
      }

      if (res.status === 403) {
        toast.error("You do not have permission to create programs.")
        return
      }

      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast.error(body.message || "Failed to create program.")
        return
      }

      const notifiedCount: number = Number(body?.notifiedCount ?? 0)
      const createdProgram = body?.data || body?.program || body || {}
      const normalizedStartDate =
        String(createdProgram.startDate || createdProgram.start_date || startIso)
      const normalizedEndDate =
        String(createdProgram.untilDate || createdProgram.until_date || createdProgram.end_date || endIso)

      const nextProgram: Program = {
        id: String(createdProgram.id || crypto.randomUUID()),
        name: String(createdProgram.name || createdProgram.program_name || createdProgram.programName || title),
        status: String(createdProgram.status || getProgramStatus(normalizedStartDate, normalizedEndDate)),
        category: String(createdProgram.category || newCategory),
        location: String(createdProgram.location || location),
        description: String(createdProgram.description || description),
        createdAt: String(createdProgram.createdAt || createdProgram.created_at || new Date().toISOString()),
        participants: Number(createdProgram.participants || 0),
        startDate: normalizedStartDate,
        untilDate: normalizedEndDate,
      }

      setPrograms((prev) => [nextProgram, ...prev])
      void fetchPrograms(false)
      resetCreateForm()
      setIsCreateOpen(false)
      toast.success(
        notifiedCount > 0
          ? `Program created successfully. ${notifiedCount} youth member${notifiedCount === 1 ? "" : "s"} notified.`
          : "Program created successfully."
      )
      logActivity({
        title: "Program Created",
        description: `Created program "${nextProgram.name}".`,
        action: "create_program",
        entity_type: "program",
      })
    } catch {
      toast.error("Unable to connect to the server. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleOpenEditProgram = (program: Program) => {
    setSelectedProgram(program)
    setEditTitle(program.name)
    setEditDescription(program.description)
    setEditCategory(program.category)
    setEditLocation(program.location)
    setEditStartDate(toDateTimeInput(program.startDate))
    setEditEndDate(toDateTimeInput(program.untilDate))
    setIsEditOpen(true)
  }

  const handleSaveEditProgram = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedProgram) return

    if (!API_BASE) {
      toast.error("Missing API URL configuration.")
      return
    }

    const title = editTitle.trim()
    const description = editDescription.trim()
    const location = editLocation.trim()

    if (!title || !description || !location || !editStartDate || !editEndDate) {
      toast.error("Please complete all required fields.")
      return
    }

    const startIso = toIsoDate(editStartDate)
    const endIso = toIsoDate(editEndDate)

    if (Number.isNaN(new Date(startIso).getTime()) || Number.isNaN(new Date(endIso).getTime())) {
      toast.error("Please enter valid start and end dates.")
      return
    }

    if (new Date(startIso).getTime() > new Date(endIso).getTime()) {
      toast.error("End date must be after the start date.")
      return
    }

    const payload: UpdateProgramPayload = {}

    if (title !== selectedProgram.name) payload.programName = title
    if (description !== selectedProgram.description) payload.description = description
    if (editCategory !== selectedProgram.category) payload.category = editCategory
    if (location !== selectedProgram.location) payload.location = location
    if (startIso !== selectedProgram.startDate) payload.startDate = startIso
    if (endIso !== selectedProgram.untilDate) payload.endDate = endIso

    if (Object.keys(payload).length === 0) {
      setIsEditOpen(false)
      setSelectedProgram(null)
      return
    }

    try {
      setIsUpdating(true)

      const res = await fetch(`${API_BASE}/api/sk/programs/${encodeURIComponent(String(selectedProgram.id))}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-app-type": "sk",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (res.status === 401) {
        toast.error("Your session expired. Please log in again.")
        router.push("/auth/login")
        return
      }

      if (res.status === 403) {
        toast.error("You do not have permission to edit programs.")
        return
      }

      const body = await res.json().catch(() => ({}))

      if (res.status === 404) {
        toast.error(body.message || "Program not found.")
        return
      }

      if (res.status === 400) {
        toast.error(body.message || "Invalid program update payload.")
        return
      }

      if (!res.ok) {
        toast.error(body.message || "Failed to update program.")
        return
      }

      const updatedProgram = body?.data || body?.program || body || {}
      const normalizedUpdated = normalizeProgram(updatedProgram)

      setPrograms((prev) =>
        prev.map((program) => (program.id === selectedProgram.id ? normalizedUpdated : program))
      )

      setIsEditOpen(false)
      setSelectedProgram(null)
      toast.success("Program updated successfully.")
      logActivity({
        title: "Program Updated",
        description: `Updated program "${selectedProgram.name}".`,
        action: "update_program",
        entity_type: "program",
      })
    } catch {
      toast.error("Unable to connect to the server. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleOpenDeleteProgram = (program: Program) => {
    setSelectedProgram(program)
    setIsDeleteOpen(true)
  }

  const handleOpenViewProgram = (program: Program) => {
    setSelectedProgram(program)
    setIsViewOpen(true)
  }

  const handleConfirmDeleteProgram = async () => {
    if (!selectedProgram) return

    if (!API_BASE) {
      toast.error("Missing API URL configuration.")
      return
    }

    try {
      setIsDeleting(true)

      const res = await fetch(`${API_BASE}/api/sk/programs/${encodeURIComponent(String(selectedProgram.id))}`, {
        method: "DELETE",
        headers: {
          "x-app-type": "sk",
        },
        credentials: "include",
      })

      if (res.status === 401) {
        toast.error("Your session expired. Please log in again.")
        router.push("/auth/login")
        return
      }

      if (res.status === 403) {
        toast.error("You do not have permission to delete programs.")
        return
      }

      const body = await res.json().catch(() => ({}))

      if (res.status === 404) {
        toast.error(body.message || "Program not found.")
        return
      }

      if (res.status === 400) {
        toast.error(body.message || "Invalid program id.")
        return
      }

      if (!res.ok) {
        toast.error(body.message || "Failed to delete program.")
        return
      }

      setPrograms((prev) => prev.filter((program) => program.id !== selectedProgram.id))
      setIsDeleteOpen(false)
      toast.success("Program deleted successfully.")
      logActivity({
        title: "Program Deleted",
        description: `Deleted program "${selectedProgram.name}".`,
        action: "delete_program",
        entity_type: "program",
      })
      setSelectedProgram(null)
    } catch {
      toast.error("Unable to connect to the server. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

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
  }, [programs, search, statusFilter, categoryFilter])

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
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-3xl text-theme-blue">Programs</h1>
            <p className="text-gray-500">Explore ongoing and upcoming activities.</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button type="button" className="h-10 px-4 shrink-0 bg-theme-blue text-white hover:bg-theme-blue/90">
                Add Program
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Program</DialogTitle>
                <DialogDescription>
                  Fill out the details below to add a new program.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateProgram} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="program-title">Title</Label>
                  <Input
                    id="program-title"
                    value={newTitle}
                    onChange={(event) => setNewTitle(event.target.value)}
                    placeholder="Enter program title"
                    className="h-10 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="program-description">Description</Label>
                  <Textarea
                    id="program-description"
                    value={newDescription}
                    onChange={(event) => setNewDescription(event.target.value)}
                    placeholder="Enter program description"
                    className="min-h-28 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="program-category">Category</Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger id="program-category" className="h-10 bg-white border border-gray-200 rounded-sm px-4">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.filter((option) => option !== "All").map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="program-location">Location</Label>
                  <Input
                    id="program-location"
                    value={newLocation}
                    onChange={(event) => setNewLocation(event.target.value)}
                    placeholder="Enter program location"
                    className="h-10 bg-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="program-start-date">Start Date</Label>
                    <Input
                      id="program-start-date"
                      type="datetime-local"
                      value={newStartDate}
                      onChange={(event) => setNewStartDate(event.target.value)}
                      className="h-10 bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program-end-date">End Date</Label>
                    <Input
                      id="program-end-date"
                      type="datetime-local"
                      value={newEndDate}
                      onChange={(event) => setNewEndDate(event.target.value)}
                      className="h-10 bg-white"
                      required
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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

      {loadingPrograms ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-theme-card-white p-8 text-center text-gray-500">
          Loading programs...
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-dashed border-red-300 bg-theme-card-white p-8 text-center text-red-600">
          {loadError}
        </div>
      ) : filteredPrograms.length === 0 ? (
        <EmptyState
          message="No programs found. Try adjusting your search or filters."
        />
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}
        >
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onView={handleOpenViewProgram}
              onEdit={handleOpenEditProgram}
              onDelete={handleOpenDeleteProgram}
            />
          ))}
        </div>
      )}

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open)
          if (!open) setSelectedProgram(null)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
            <DialogDescription>
              Update the details below. This currently updates local state only.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEditProgram} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-program-title">Title</Label>
              <Input
                id="edit-program-title"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                placeholder="Enter program title"
                className="h-10 bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-program-description">Description</Label>
              <Textarea
                id="edit-program-description"
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                placeholder="Enter program description"
                className="min-h-28 bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-program-category">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger id="edit-program-category" className="h-10 bg-white border border-gray-200 rounded-sm px-4">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.filter((option) => option !== "All").map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-program-location">Location</Label>
              <Input
                id="edit-program-location"
                value={editLocation}
                onChange={(event) => setEditLocation(event.target.value)}
                placeholder="Enter program location"
                className="h-10 bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-program-start-date">Start Date</Label>
                <Input
                  id="edit-program-start-date"
                  type="datetime-local"
                  value={editStartDate}
                  onChange={(event) => setEditStartDate(event.target.value)}
                  className="h-10 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-program-end-date">End Date</Label>
                <Input
                  id="edit-program-end-date"
                  type="datetime-local"
                  value={editEndDate}
                  onChange={(event) => setEditEndDate(event.target.value)}
                  className="h-10 bg-white"
                  required
                />
              </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isUpdating}>
                Cancel
              </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isViewOpen}
        onOpenChange={(open) => {
          setIsViewOpen(open)
          if (!open) setSelectedProgram(null)
        }}
      >
        <DialogContent className="sm:max-w-lg flex flex-col max-h-[85vh] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle>{selectedProgram?.name ?? "Program Details"}</DialogTitle>
          </DialogHeader>

          {selectedProgram ? (
            <div className="flex-1 overflow-y-auto px-6 pb-4 pt-0 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedProgram.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{selectedProgram.status}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Category</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{selectedProgram.category}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {new Date(selectedProgram.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Last Modified</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {new Date(selectedProgram.updatedAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Start</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {new Date(selectedProgram.startDate).toLocaleString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Until</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {new Date(selectedProgram.untilDate).toLocaleString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="shrink-0 flex items-start gap-2 border-t border-gray-100 px-6 py-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <span className="text-sm text-gray-500 leading-snug">{selectedProgram?.location}</span>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open)
          if (!open) setSelectedProgram(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program</AlertDialogTitle>
            <AlertDialogDescription>
                {`Are you sure you want to delete "${selectedProgram?.name || "this program"}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDeleteProgram}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Programs