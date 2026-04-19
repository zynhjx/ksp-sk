"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import Title from "@/components/Title"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

const ProfilePage = () => {
  const router = useRouter()
  const { user, setUser } = useAuth()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profile, setProfile] = useState<SkProfile | null>(null)
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    barangay: "",
    position: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!API_BASE) {
        toast.error("Missing API URL configuration.")
        setLoadingProfile(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE}/api/sk/profile`, {
          method: "GET",
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
        setLoadingProfile(false)
      }
    }

    void fetchProfile()
  }, [router, setUser])

  const fullName = useMemo(() => {
    if (!profile) return "SK Official"
    return `${toTitleCase(profile.first_name)} ${toTitleCase(profile.last_name)}`.trim()
  }, [profile])

  const userInitial = profile?.first_name?.charAt(0)?.toUpperCase() || "U"

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!API_BASE) {
      toast.error("Missing API URL configuration.")
      return
    }

    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      barangay: form.barangay.trim(),
      position: form.position.trim(),
    }

    if (!payload.first_name || !payload.last_name || !payload.barangay || !payload.position) {
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
            barangay: payload.barangay,
            position: payload.position,
          },
        }),
      })

      if (res.status === 401) {
        toast.error("Your session expired. Please log in again.")
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
        barangay: String(updated?.barangay ?? payload.barangay),
        position: String(updated?.position ?? payload.position),
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

      setIsEditOpen(false)
      toast.success(body.message || "Profile updated successfully")
    } catch {
      toast.error("Unable to connect to the server.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "x-app-type": "sk",
        },
      })
    } catch {
      // Keep the UI responsive even if the logout endpoint fails.
    } finally {
      setUser(null)
      router.replace("/auth/login")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Title className="mb-0">Profile</Title>
        <p className="text-gray-500">
          Review your account details, update your information, or remove your account.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200/80 bg-theme-card-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-3xl bg-theme-blue text-3xl font-bold text-white">
              {userInitial}
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-slate-900">{fullName}</h2>
              <p className="text-sm text-slate-500">{profile?.email ?? "No email available"}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {profile?.role ?? "SK"}
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {profile?.status ?? "Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button type="button" className="bg-theme-blue text-white hover:bg-theme-blue/90">
                  Edit Account
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Edit Account</DialogTitle>
                  <DialogDescription>
                    Update the account details you want to keep current.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-first-name">First Name</Label>
                      <Input
                        id="profile-first-name"
                        value={form.first_name}
                        onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
                        className="h-10 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-last-name">Last Name</Label>
                      <Input
                        id="profile-last-name"
                        value={form.last_name}
                        onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
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
                        value={form.barangay}
                        onChange={(event) => setForm((prev) => ({ ...prev, barangay: event.target.value }))}
                        className="h-10 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-position">Position</Label>
                      <Input
                        id="profile-position"
                        value={form.position}
                        onChange={(event) => setForm((prev) => ({ ...prev, position: event.target.value }))}
                        className="h-10 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove your current session and take you back to the login screen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handleDeleteAccount}>
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/80 bg-theme-card-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Account Details</h3>
          {loadingProfile ? (
            <p className="mt-4 text-sm text-slate-500">Loading profile...</p>
          ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">First Name</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{profile?.first_name ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Last Name</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{profile?.last_name ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{profile?.email ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Barangay</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{profile?.barangay ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Position</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{profile?.position ?? "-"}</p>
            </div>
          </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-theme-card-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Account Actions</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Edit account details</p>
              <p className="mt-1 text-sm text-slate-500">
                Update your name, barangay, and position whenever your profile changes. Email is read-only.
              </p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">Logout</p>
              <p className="mt-1 text-sm text-red-600">
                Use this if you want to remove your current account session from this dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage