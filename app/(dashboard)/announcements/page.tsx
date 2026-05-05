"use client"

import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/apiFetch"
import AnnouncementCard from "@/components/AnnouncementCard"
import EmptyState from "@/components/EmptyState"
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

const announcementTypes = ["general", "event", "urgent", "reminder", "opportunity"] as const
type AnnouncementType = (typeof announcementTypes)[number]

type Announcement = {
  id: string
  title: string
  type: AnnouncementType
  content: string
  postedAt: string
  postedBy: string
  barangay: string
}

type RawAnnouncement = {
  id?: string | number
  title?: string
  description?: string
  type?: string
  posted_by?: string
  barangay?: string
  created_at?: string
  updated_at?: string
}

const formatTypeLabel = (type: AnnouncementType) =>
  type.charAt(0).toUpperCase() + type.slice(1)

const normalizeAnnouncementType = (value: unknown): AnnouncementType => {
  const normalized = String(value || "").trim().toLowerCase()

  if (announcementTypes.includes(normalized as AnnouncementType)) {
    return normalized as AnnouncementType
  }

  return "general"
}

const normalizeAnnouncement = (value: RawAnnouncement): Announcement => {
  const nowIso = new Date().toISOString()

  return {
    id: String(value.id || generateAnnouncementId()),
    title: String(value.title || "Untitled Announcement"),
    type: normalizeAnnouncementType(value.type),
    content: String(value.description || "No description provided."),
    postedAt: String(value.created_at || value.updated_at || nowIso),
    postedBy: String(value.posted_by || "SK Council"),
    barangay: String(value.barangay || "Unspecified"),
  }
}

const API_BASE = process.env.NEXT_PUBLIC_EXPRESS_API_URL

const generateAnnouncementId = () => {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `announcement-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

const Announcements = () => {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<AnnouncementType | "all">("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newPurpose, setNewPurpose] = useState<AnnouncementType>("general")
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  const fetchAnnouncements = useCallback(
    async (showLoader = false) => {
      if (!API_BASE) {
        setLoadError("Missing API URL configuration.")
        setLoadingAnnouncements(false)
        return false
      }

      if (showLoader) {
        setLoadingAnnouncements(true)
      }

      try {
        const res = await apiFetch(`${API_BASE}/api/sk/announcements`, {
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
          setLoadError("You do not have permission to view announcements.")
          return false
        }

        const body = await res.json().catch(() => ({}))

        if (!res.ok) {
          setLoadError(body.message || "Failed to load announcements.")
          return false
        }

        const records = Array.isArray(body?.data)
          ? (body.data as RawAnnouncement[])
          : Array.isArray(body)
            ? (body as RawAnnouncement[])
            : []

        setAnnouncements(records.map((item) => normalizeAnnouncement(item)))
        setLoadError(null)
        return true
      } catch {
        setLoadError("Unable to connect to the server. Please try again.")
        return false
      } finally {
        setLoadingAnnouncements(false)
      }
    },
    [router]
  )

  useEffect(() => {
    void fetchAnnouncements(true)
  }, [fetchAnnouncements])

  const handleCreateAnnouncement = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!API_BASE) {
      toast.error("Missing API URL configuration.")
      return
    }

    const title = newTitle.trim()
    const description = newDescription.trim()

    if (!title || !description) {
      toast.error("Please complete all required fields.")
      return
    }

    const payload = {
      title,
      description,
      type: newPurpose,
    }

    try {
      setIsCreating(true)

      const res = await apiFetch(`${API_BASE}/api/sk/announcements`, {
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
        toast.error("You do not have permission to create announcements.")
        return
      }

      const body = await res.json().catch(() => ({}))

      if (res.status === 400) {
        toast.error(body.message || "Missing required fields.")
        return
      }

      if (!res.ok) {
        toast.error(body.message || "Failed to create announcement.")
        return
      }

      const created = body?.data || body?.announcement || body || {}
      const normalized = normalizeAnnouncement(created)

      setAnnouncements((prev) => [normalized, ...prev])
      setTypeFilter("all")
      setNewTitle("")
      setNewDescription("")
      setNewPurpose("general")
      setIsCreateOpen(false)
      toast.success("Announcement created successfully.")
      logActivity({
        title: "Announcement Created",
        description: `Created announcement "${normalized.title}".`,
        action: "create_announcement",
        entity_type: "announcement",
      })
    } catch {
      toast.error("Unable to connect to the server. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const filteredAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase()

    return announcements.filter((announcement) => {
      const matchesSearch =
        !query ||
        [announcement.title, announcement.content].some((value) =>
          value.toLowerCase().includes(query)
        )

      const matchesType =
        typeFilter === "all" || announcement.type === typeFilter

      return matchesSearch && matchesType
    })
  }, [announcements, search, typeFilter])

  const handleOpenView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setIsViewOpen(true)
  }

  const handleOpenDelete = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedAnnouncement) return
    setIsDeleting(true)
    try {
      const res = await apiFetch(`${API_BASE}/api/sk/announcements/${selectedAnnouncement.id}`, {
        method: "DELETE",
        headers: { "x-app-type": "sk" },
        credentials: "include",
      })
      if (res.status === 401) { toast.error("Session expired."); router.push("/auth/login"); return }
      if (res.status === 403) { toast.error("You do not have permission to delete announcements."); return }
      if (!res.ok) { const b = await res.json().catch(() => ({})); toast.error(b.message || "Failed to delete announcement."); return }
      await fetchAnnouncements(false)
      setIsDeleteOpen(false)
      toast.success("Announcement deleted.")
      logActivity({
        title: "Announcement Deleted",
        description: `Deleted announcement "${selectedAnnouncement.title}".`,
        action: "delete_announcement",
        entity_type: "announcement",
      })
    } catch {
      toast.error("Unable to connect to the server.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex flex-col mb-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-3xl text-theme-blue">
              Announcements
            </h1>
            <p className="text-gray-500">
              Stay updated with latest news and important information
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button type="button" className="h-10 px-4 shrink-0 bg-theme-blue text-white hover:bg-theme-blue/90">
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogDescription>
                  Fill out the details below to publish a new announcement.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-title">Title</Label>
                  <Input
                    id="announcement-title"
                    value={newTitle}
                    onChange={(event) => setNewTitle(event.target.value)}
                    placeholder="Enter announcement title"
                    className="h-10 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="announcement-description">Description</Label>
                  <Textarea
                    id="announcement-description"
                    value={newDescription}
                    onChange={(event) => setNewDescription(event.target.value)}
                    placeholder="Enter announcement description"
                    className="min-h-28 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="announcement-purpose">Purpose</Label>
                  <Select value={newPurpose} onValueChange={(value) => setNewPurpose(value as AnnouncementType)}>
                    <SelectTrigger id="announcement-purpose" className="h-10 bg-white border border-gray-200 rounded-sm px-4">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {announcementTypes.map((option) => (
                        <SelectItem key={option} value={option}>
                          {formatTypeLabel(option)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white flex-1 min-w-0 px-4 py-3 rounded-sm focus:outline-0 border border-gray-200"
            placeholder="Search announcements..."
          />

          <div className="flex gap-2 shrink-0">
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as AnnouncementType | "all")}>
              <SelectTrigger className="w-40 h-12.5! bg-white! border border-gray-200 rounded-sm px-4">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {announcementTypes.map((option) => (
                  <SelectItem key={option} value={option}>
                    {formatTypeLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loadingAnnouncements ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-theme-card-white p-8 text-center text-gray-500">
          Loading announcements...
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-dashed border-red-300 bg-theme-card-white p-8 text-center text-red-600">
          {loadError}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <EmptyState
          message="No announcements found. Try adjusting your search or filters."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onView={handleOpenView}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      <Dialog
        open={isViewOpen}
        onOpenChange={(open) => {
          setIsViewOpen(open)
          if (!open) setSelectedAnnouncement(null)
        }}
      >
        <DialogContent className="sm:max-w-lg flex flex-col max-h-[85vh] p-0 gap-0 overflow-hidden" aria-describedby={undefined}>
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle className="leading-snug max-h-[calc(5*1.375rem)] overflow-y-auto">
              {selectedAnnouncement?.title ?? "Announcement"}
            </DialogTitle>
          </DialogHeader>

          {selectedAnnouncement ? (
            <div className="flex-1 overflow-y-auto px-6 pb-4 pt-0 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedAnnouncement.content}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Posted By</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{selectedAnnouncement.postedBy}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Category</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{formatTypeLabel(selectedAnnouncement.type)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Barangay</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{selectedAnnouncement.barangay}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Created At</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {new Date(selectedAnnouncement.postedAt).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete announcement?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{selectedAnnouncement?.title}&rdquo;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Announcements
