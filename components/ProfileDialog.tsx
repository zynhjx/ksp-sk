"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const toTitleCase = (value: string = "") =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

type SkProfile = {
  id: string | number
  email: string
  role: string
  status: string
  first_name: string
  last_name: string
  barangay: string
  position: string
  created_at: string
  updated_at: string
}

type ProfileResponse = {
  message?: string
  data?: Partial<SkProfile>
}

const API_BASE = process.env.NEXT_PUBLIC_EXPRESS_API_URL

type ProfileDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const router = useRouter()
  const { user, setUser } = useAuth()

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<SkProfile | null>(null)
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    barangay: "",
    position: "",
  })

  useEffect(() => {
    if (!open) return

    const fetchProfile = async () => {
      if (!API_BASE) {
        toast.error("Missing API URL configuration.")
        return
      }

      setIsLoading(true)
      try {
        const res = await fetch(`${API_BASE}/api/sk/profile`, {
          method: "GET",
          headers: { "x-app-type": "sk" },
          credentials: "include",
        })

        if (res.status === 401) {
          toast.error("Your session expired. Please log in again.")
          onOpenChange(false)
          router.push("/auth/login")
          return
        }

        const body: ProfileResponse = await res.json().catch(() => ({}))

        if (!res.ok || !body.data) {
          toast.error(body.message || "Failed to fetch profile.")
          return
        }

        const data = body.data
        const nextProfile: SkProfile = {
          id: String(data.id ?? ""),
          email: String(data.email ?? ""),
          role: String(data.role ?? "sk"),
          status: String(data.status ?? "active"),
          first_name: String(data.first_name ?? ""),
          last_name: String(data.last_name ?? ""),
          barangay: String(data.barangay ?? ""),
          position: String(data.position ?? ""),
          created_at: String(data.created_at ?? ""),
          updated_at: String(data.updated_at ?? ""),
        }

        setProfile(nextProfile)
        setForm({
          first_name: nextProfile.first_name,
          last_name: nextProfile.last_name,
          email: nextProfile.email,
          barangay: nextProfile.barangay,
          position: nextProfile.position,
        })

        setUser({
          id: String(nextProfile.id),
          email: nextProfile.email,
          role: nextProfile.role,
          status: nextProfile.status,
          barangay: nextProfile.barangay,
          first_name: nextProfile.first_name,
          last_name: nextProfile.last_name,
          gender: user?.gender ?? "",
        })
      } catch {
        toast.error("Unable to connect to the server.")
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProfile()
  }, [open])

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!API_BASE) {
      toast.error("Missing API URL configuration.")
      return
    }

    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
    }

    if (!payload.first_name || !payload.last_name) {
      toast.error("Please complete all required fields.")
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch(`${API_BASE}/api/sk/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-app-type": "sk",
        },
        credentials: "include",
        body: JSON.stringify({
          formData: {
            firstName: payload.first_name,
            lastName: payload.last_name,
          },
        }),
      })

      if (res.status === 401) {
        toast.error("Your session expired. Please log in again.")
        onOpenChange(false)
        router.push("/auth/login")
        return
      }

      const body: ProfileResponse = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast.error(body.message || "Failed to update profile.")
        return
      }

      const updated = body.data
      const nextProfile: SkProfile = {
        id: String(updated?.id ?? profile?.id ?? user?.id ?? ""),
        email: String(updated?.email ?? profile?.email ?? user?.email ?? ""),
        role: String(updated?.role ?? profile?.role ?? user?.role ?? "sk"),
        status: String(updated?.status ?? profile?.status ?? user?.status ?? "active"),
        first_name: String(updated?.first_name ?? payload.first_name),
        last_name: String(updated?.last_name ?? payload.last_name),
        barangay: String(updated?.barangay ?? profile?.barangay ?? ""),
        position: String(updated?.position ?? profile?.position ?? ""),
        created_at: String(updated?.created_at ?? profile?.created_at ?? ""),
        updated_at: String(updated?.updated_at ?? profile?.updated_at ?? ""),
      }

      setProfile(nextProfile)
      setForm({
        first_name: nextProfile.first_name,
        last_name: nextProfile.last_name,
        email: nextProfile.email,
        barangay: nextProfile.barangay,
        position: nextProfile.position,
      })

      setUser({
        id: String(nextProfile.id),
        email: nextProfile.email,
        role: nextProfile.role,
        status: nextProfile.status,
        barangay: nextProfile.barangay,
        first_name: nextProfile.first_name,
        last_name: nextProfile.last_name,
        gender: user?.gender ?? "",
      })

      onOpenChange(false)
      toast.success(body.message || "Profile updated successfully")
    } catch {
      toast.error("Unable to connect to the server.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update the account details you want to keep current.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-sm text-gray-400">Loading profile…</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-first-name">First Name</Label>
                <Input
                  id="profile-first-name"
                  value={form.first_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
                  className="h-10 bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-last-name">Last Name</Label>
                <Input
                  id="profile-last-name"
                  value={form.last_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
                  className="h-10 bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={form.email}
                className="h-10 bg-white"
                disabled
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-barangay">Barangay</Label>
                <Input
                  id="profile-barangay"
                  value={toTitleCase(form.barangay)}
                  className="h-10 bg-white"
                  disabled
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-position">Position</Label>
                <Input
                  id="profile-position"
                  value={toTitleCase(form.position)}
                  className="h-10 bg-white"
                  disabled
                  readOnly
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving…" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
