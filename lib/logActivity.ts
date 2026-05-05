import { apiFetch } from "@/lib/apiFetch"

const API_BASE = process.env.NEXT_PUBLIC_EXPRESS_API_URL

type LogActivityPayload = {
  title: string
  description: string
  action: string
  entity_type?: string
  entity_id?: number
}

/**
 * Fire-and-forget activity logger. Never throws or blocks the caller.
 */
export function logActivity(payload: LogActivityPayload): void {
  if (!API_BASE) return

  void apiFetch(`${API_BASE}/api/sk/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-type": "sk",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  }).catch(() => {
    // silently ignore — logging must never break main flows
  })
}
