"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SuggestionCard from "@/components/SuggestionCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

type Suggestion = {
  id: string
  title: string
  description: string
  suggestedSolution: string
  location: string
  category: string
}

type RawSuggestion = {
  id?: string | number
  title?: string
  description?: string
  suggested_solution?: string
  location?: string
  category?: string
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
    category?: string
    barangay?: string
    created_at?: string
  }
}

const API_BASE = process.env.NEXT_PUBLIC_EXPRESS_API_URL

const Suggestions = () => {
  const router = useRouter()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [deletingSuggestionId, setDeletingSuggestionId] = useState<string | null>(null)
  const [pendingDeleteSuggestionId, setPendingDeleteSuggestionId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  const categoryOptions = ["All", "Education", "Employment", "Health", "Sports", "Environment", "Community / Social"]

  const normalizeSuggestion = (value: RawSuggestion): Suggestion => ({
    id: String(value.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    title: String(value.title || "Untitled Suggestion"),
    description: String(value.description || "No description provided."),
    suggestedSolution: String(value.suggested_solution || "No suggested solution provided."),
    location: String(value.location || "Unspecified"),
    category: String(value.category || "Community / Social"),
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
    } catch {
      toast.error("Unable to connect to the server. Please try again.")
    } finally {
      setDeletingSuggestionId(null)
    }
  }

  const filteredSuggestions = suggestions.filter((s) => {
    const matchesSearch =
      search.trim() === "" ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.suggestedSolution.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      categoryFilter === "" || categoryFilter === "All" || s.category === categoryFilter

    return matchesSearch && matchesCategory
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
              onDelete={deletingSuggestionId ? undefined : requestDeleteSuggestion}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-400 text-sm">No suggestions found.</p>
            <p className="text-gray-300 text-xs mt-1">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>

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