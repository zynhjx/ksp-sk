const API_BASE = process.env.NEXT_PUBLIC_EXPRESS_API_URL

let isRefreshing = false
let refreshSubscribers: Array<(ok: boolean) => void> = []

function subscribeToRefresh(cb: (ok: boolean) => void) {
  refreshSubscribers.push(cb)
}

function notifyRefreshSubscribers(ok: boolean) {
  refreshSubscribers.forEach((cb) => cb(ok))
  refreshSubscribers = []
}

async function tryRefresh(): Promise<boolean> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeToRefresh(resolve)
    })
  }

  isRefreshing = true

  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "x-app-type": "sk" },
    })

    const ok = res.ok
    notifyRefreshSubscribers(ok)
    return ok
  } catch {
    notifyRefreshSubscribers(false)
    return false
  } finally {
    isRefreshing = false
  }
}

/**
 * Drop-in replacement for `fetch` that automatically refreshes the access
 * token on 401 and retries the original request once. If the refresh also
 * fails, returns the 401 response so callers can handle it (e.g. redirect
 * to login).
 */
export async function apiFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = input.startsWith("http") ? input : `${API_BASE}${input}`

  const mergedInit: RequestInit = {
    ...init,
    credentials: "include",
    headers: {
      "x-app-type": "sk",
      ...(init.headers as Record<string, string> | undefined),
    },
  }

  const res = await fetch(url, mergedInit)

  if (res.status !== 401) {
    return res
  }

  const refreshed = await tryRefresh()

  if (!refreshed) {
    return res
  }

  return fetch(url, mergedInit)
}
