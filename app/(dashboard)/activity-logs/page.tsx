"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BadgeCheckIcon,
  ClipboardListIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  PencilIcon,
  Trash2Icon,
  UserCheckIcon,
  UserIcon,
  UserMinusIcon,
  UserXIcon,
  type LucideIcon,
} from "lucide-react"
import EmptyState from "@/components/EmptyState"

type LogRole = "admin" | "sk"

type ActivityLog = {
  id: string
  title: string
  description: string
  action: string
  entity_type: string | null
  entity_id: string | null
  performed_at: string
  actor_id: string
  actor_name: string
  actor_email: string
  actor_role: LogRole
}

type RawLog = {
  id?: string | number
  title?: string
  description?: string
  action?: string
  entity_type?: string | null
  entity_id?: string | number | null
  performed_at?: string
  actor_id?: string | number
  actor_name?: string
  actor_email?: string
  actor_role?: string
}

const API_BASE = process.env.NEXT_PUBLIC_EXPRESS_API_URL

type ActionMeta = { icon: LucideIcon; bg: string; text: string }

const getActionMeta = (action: string): ActionMeta => {
  switch (action) {
    case "create_announcement":
      return { icon: MegaphoneIcon, bg: "bg-amber-50 border-amber-200", text: "text-amber-600" }
    case "delete_announcement":
      return { icon: Trash2Icon, bg: "bg-red-50 border-red-200", text: "text-red-500" }
    case "create_program":
      return { icon: ClipboardListIcon, bg: "bg-green-50 border-green-200", text: "text-green-600" }
    case "update_program":
      return { icon: PencilIcon, bg: "bg-blue-50 border-blue-200", text: "text-blue-500" }
    case "delete_program":
      return { icon: Trash2Icon, bg: "bg-red-50 border-red-200", text: "text-red-500" }
    case "update_suggestion":
      return { icon: MessageSquareIcon, bg: "bg-purple-50 border-purple-200", text: "text-purple-600" }
    case "delete_suggestion":
      return { icon: Trash2Icon, bg: "bg-red-50 border-red-200", text: "text-red-500" }
    case "approve_youth_member":
      return { icon: BadgeCheckIcon, bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-600" }
    case "decline_youth_member":
      return { icon: UserXIcon, bg: "bg-red-50 border-red-200", text: "text-red-500" }
    case "suspend_youth_member":
      return { icon: UserMinusIcon, bg: "bg-orange-50 border-orange-200", text: "text-orange-500" }
    case "reactivate_youth_member":
      return { icon: UserCheckIcon, bg: "bg-teal-50 border-teal-200", text: "text-teal-600" }
    case "update_youth_member":
      return { icon: PencilIcon, bg: "bg-blue-50 border-blue-200", text: "text-blue-500" }
    default:
      return { icon: UserIcon, bg: "bg-sky-50 border-sky-200", text: "text-sky-500" }
  }
}

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

const LogCard = ({ log }: { log: ActivityLog }) => {
  const { icon: Icon, bg, text } = getActionMeta(log.action)

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 flex flex-col">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start gap-4">
          <div className={`shrink-0 mt-0.5 flex size-10 items-center justify-center rounded-2xl border ${bg}`}>
            <Icon size={20} className={text} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <h2 className="text-base font-semibold text-gray-900 leading-snug">{log.title}</h2>
            </div>
            <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{log.description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-gray-800">{log.actor_name}</span>
            <span className="text-xs text-gray-400">{log.actor_email}</span>
          </div>
          <span className="text-xs text-gray-400 shrink-0">{formatDate(log.performed_at)}</span>
        </div>
      </div>
    </article>
  )
}

const ActivityLogs = () => {
  const router = useRouter()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const normalizeLog = (raw: RawLog): ActivityLog => ({
    id: String(raw.id ?? ""),
    title: String(raw.title ?? "Unknown Action"),
    description: String(raw.description ?? ""),
    action: String(raw.action ?? ""),
    entity_type: raw.entity_type ?? null,
    entity_id: raw.entity_id != null ? String(raw.entity_id) : null,
    performed_at: String(raw.performed_at ?? new Date().toISOString()),
    actor_id: String(raw.actor_id ?? ""),
    actor_name: String(raw.actor_name ?? "Unknown"),
    actor_email: String(raw.actor_email ?? ""),
    actor_role: raw.actor_role === "admin" ? "admin" : "sk",
  })

  const fetchLogs = useCallback(async () => {
    if (!API_BASE) {
      setLoadError("Missing API URL configuration.")
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/sk/logs`, {
        method: "GET",
        headers: { "x-app-type": "sk" },
        credentials: "include",
      })

      if (res.status === 401) {
        router.push("/auth/login")
        return
      }

      if (res.status === 403) {
        setLoadError("You do not have permission to view activity logs.")
        return
      }

      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        setLoadError(body.message || "Failed to load activity logs.")
        return
      }

      const records: RawLog[] = Array.isArray(body)
        ? body
        : Array.isArray(body?.data)
          ? body.data
          : []

      setLogs(records.map(normalizeLog))
      setLoadError(null)
    } catch {
      setLoadError("Unable to connect to the server. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    void fetchLogs()
  }, [fetchLogs])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return logs.filter((log) =>
      !query ||
      [log.title, log.description, log.actor_name, log.actor_email].some((v) =>
        v.toLowerCase().includes(query)
      )
    )
  }, [logs, search])

  return (
    <>
      <div className="flex flex-col mb-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-3xl text-theme-blue">Activity Logs</h1>
            <p className="text-gray-500">Track actions performed by SK officials in your barangay.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white flex-1 px-4 py-3 rounded-sm focus:outline-0 border border-gray-200"
            placeholder="Search by action, user, or description..."
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-500 text-sm">Loading activity logs...</p>
        </div>
      ) : loadError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-red-500 text-sm">{loadError}</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          message="No logs found. Try adjusting your search."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      )}
    </>
  )
}

export default ActivityLogs
