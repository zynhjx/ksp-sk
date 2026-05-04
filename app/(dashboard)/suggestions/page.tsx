"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SuggestionCard from "@/components/SuggestionCard"
import EmptyState from "@/components/EmptyState"
import { MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { toast } from "sonner"
import { logActivity } from "@/lib/logActivity"

type Suggestion = {
  id: string
  title: string
  description: string
  suggestedSolution: string
  location: string
}

type RawSuggestion = {
  id?: string | number
  title?: string
  description?: string
  suggested_solution?: string
  location?: string
  barangay?: string
  created_at?: string
}

type DeleteSuggestionResponse = {
  message?: string
  data?: {
    id?: string | number
    title?: string
    description?: string
    suggested_solution?: string
    location?: string
    barangay?: string
    created_at?: string
  }
}

type UpdateSuggestionResponse = {
  message?: string
  data?: RawSuggestion
}

const API_BASE = process.env.NEXT_PUBLIC_EXPRESS_API_URL

const Suggestions = () => {
  const router = useRouter()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [deletingSuggestionId, setDeletingSuggestionId] = useState<string | null>(null)
  const [pendingDeleteSuggestionId, setPendingDeleteSuggestionId] = useState<string | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [viewSuggestion, setViewSuggestion] = useState<Suggestion | null>(null)
  const [search, setSearch] = useState("")

  const normalizeSuggestion = (value: RawSuggestion): Suggestion => ({
    id: String(value.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    title: String(value.title || "Untitled Suggestion"),
    description: String(value.description || "No description provided."),
    suggestedSolution: String(value.suggested_solution || "No suggested solution provided."),
    location: String(value.location || "Unspecified"),
  })

  const fetchSuggestions = useCallback(
    async (showLoader = false) => {
      if (!API_BASE) {
        setLoadError("Missing API URL configuration.")
        setLoadingSuggestions(false)
        return false
      }

      if (showLoader) {
        setLoadingSuggestions(true)
      }

      try {
        const res = await fetch(`${API_BASE}/api/sk/suggestions`, {
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
          setLoadError("You do not have permission to view suggestions.")
          return false
        }

        const body = await res.json().catch(() => [])

        if (!res.ok) {
          const message = Array.isArray(body) ? "Failed to load suggestions." : body.message
          setLoadError(message || "Failed to load suggestions.")
          return false
        }

        const records = Array.isArray(body)
          ? (body as RawSuggestion[])
          : Array.isArray(body?.data)
            ? (body.data as RawSuggestion[])
            : []

        setSuggestions(records.map(normalizeSuggestion))
        setLoadError(null)
        return true
      } catch {
        setLoadError("Unable to connect to the server. Please try again.")
        return false
      } finally {
        setLoadingSuggestions(false)
      }
    },
    [router]
  )

  useEffect(() => {
    void fetchSuggestions(true)
  }, [fetchSuggestions])

  const requestDeleteSuggestion = (id: string) => {
    if (deletingSuggestionId) {
      return
    }

    setPendingDeleteSuggestionId(id)
  }

  const handleDeleteSuggestion = async () => {
    const id = pendingDeleteSuggestionId
    if (!id) {
      return
    }

    if (!API_BASE) {
      toast.error("Missing API URL configuration.")
      return
    }

    setDeletingSuggestionId(id)

    try {
      const res = await fetch(`${API_BASE}/api/sk/suggestions/${encodeURIComponent(id)}`, {
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
        toast.error("You do not have permission to delete suggestions.")
        return
      }

      const body: DeleteSuggestionResponse = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast.error(body.message || "Failed to delete suggestion.")
        return
      }

      const deletedId = String(body?.data?.id ?? id)
      setSuggestions((prev) => prev.filter((suggestion) => suggestion.id !== deletedId))
      setPendingDeleteSuggestionId(null)
      toast.success(body.message || "Suggestion deleted successfully")
      logActivity({
        title: "Suggestion Deleted",
        description: `Deleted suggestion (ID: ${deletedId}).`,
        action: "delete_suggestion",
        entity_type: "suggestion",
      })
    } catch {
      toast.error("Unable to connect to the server. Please try again.")
    } finally {
      setDeletingSuggestionId(null)
    }
  }

  const filteredSuggestions = suggestions.filter((s) => {
    return (
      search.trim() === "" ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.suggestedSolution.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <>
      <div className="flex flex-col mb-8">
        <div className="flex mb-6">
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-3xl text-theme-blue">Community Suggestions</h1>
            <p className="text-gray-500">Share our ideas and feedback to help improve programs and services in your barangay</p>
          </div>

        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white flex-1 px-4 py-3 rounded-sm focus:outline-0 border border-gray-200"
            placeholder="Search suggestions..."
          />


        </div>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))" }}
      >
        {loadingSuggestions ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-500 text-sm">Loading suggestions...</p>
          </div>
        ) : loadError ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <p className="text-red-500 text-sm">{loadError}</p>
          </div>
        ) : filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              canModify
              onView={(id) => {
                const found = filteredSuggestions.find((s) => s.id === id)
                if (found) {
                  setViewSuggestion(found)
                  setIsViewOpen(true)
                }
              }}
              onDelete={deletingSuggestionId ? undefined : requestDeleteSuggestion}
            />
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              message="No suggestions found. Try adjusting your search or filters."
            />
          </div>
        )}
      </div>

      <Dialog
        open={isViewOpen}
        onOpenChange={(open) => {
          setIsViewOpen(open)
          if (!open) setViewSuggestion(null)
        }}
      >
        <DialogContent className="sm:max-w-lg flex flex-col max-h-[85vh] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle>{viewSuggestion?.title ?? "Suggestion Details"}</DialogTitle>
          </DialogHeader>

          {viewSuggestion ? (
            <div className="flex-1 overflow-y-auto px-6 pb-4 pt-0 space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Description</span>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewSuggestion.description}</p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Suggested Solution</span>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewSuggestion.suggestedSolution}</p>
              </div>

            </div>
          ) : null}

          <div className="shrink-0 flex items-start gap-2 border-t border-gray-100 px-6 py-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <span className="text-sm text-gray-500 leading-snug">{viewSuggestion?.location}</span>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!pendingDeleteSuggestionId}
        onOpenChange={(open) => {
          if (!open && !deletingSuggestionId) {
            setPendingDeleteSuggestionId(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete suggestion?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the selected suggestion. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingSuggestionId}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={!!deletingSuggestionId}
              onClick={handleDeleteSuggestion}
            >
              {deletingSuggestionId ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Suggestions