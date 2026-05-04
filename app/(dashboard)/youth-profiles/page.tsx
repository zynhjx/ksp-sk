"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Title from "@/components/Title"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { MoreVerticalIcon } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { logActivity } from "@/lib/logActivity"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API_BASE = process.env.NEXT_PUBLIC_EXPRESS_API_URL

type UserStatus = "active" | "pending" | "declined" | "suspended"

type YouthProfile = {
  id: string | number
  user_id?: string | number
  userId?: string | number
  member_id?: string | number
  memberId?: string | number
  user?: {
    id?: string | number
  } | null
  first_name: string
  last_name: string
  email: string
  barangay: string
  status: UserStatus
  [key: string]: unknown
}

const statusOptions: Array<"All" | "Active" | "Pending" | "Declined" | "Suspended"> = [
  "All",
  "Active",
  "Pending",
  "Declined",
  "Suspended",
]

const normalizeStatus = (status: string): UserStatus => {
  const normalized = status.trim().toLowerCase()

  if (normalized.includes("active")) return "active"
  if (normalized.includes("pending")) return "pending"
  if (normalized.includes("suspended")) return "suspended"

  return "declined"
}

const formatStatus = (status: UserStatus) =>
  (status.charAt(0).toUpperCase() + status.slice(1)) as
    | "Active"
    | "Pending"
    | "Declined"
    | "Suspended"

type EditProfileForm = {
  first_name: string
  last_name: string
  barangay: string
  extraFields: Record<string, string>
}

const EXCLUDED_EXTRA_KEYS = new Set([
  "id",
  "user_id",
  "userId",
  "member_id",
  "memberId",
  "user",
  "name",
  "full_name",
  "fullName",
  "first_name",
  "last_name",
  "email",
  "barangay",
  "status",
  "bday",
  "role",
])

const formatFieldLabel = (fieldName: string) =>
  fieldName
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())

const toEditableScalar = (value: unknown): string => {
  if (value === null || value === undefined) return ""
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  return ""
}

const isGenderField = (fieldName: string) => {
  const normalized = fieldName.toLowerCase()
  return normalized === "gender" || normalized === "sex"
}

const GENDER_OPTIONS = ["Male", "Female", "Non-binary"]

const isEmploymentStatusField = (fieldName: string) => {
  const normalized = fieldName.toLowerCase().replace(/[_\s-]/g, "")
  return normalized.includes("employment") || normalized === "employmentstatus" || normalized === "workstatus"
}

const EMPLOYMENT_STATUS_OPTIONS = [
  "Employed",
  "Unemployed",
  "Self-Employed",
  "Freelancer",
  "Student",
  "Retired",
  "Homemaker",
  "Part-Time",
  "Intern/Trainee",
]

const isEducationLevelField = (fieldName: string) => {
  const normalized = fieldName.toLowerCase().replace(/[_\s-]/g, "")
  return (
    normalized.includes("education") ||
    normalized === "educationallevel" ||
    normalized === "educationlevel" ||
    normalized === "edlevel"
  )
}

const EDUCATION_LEVEL_OPTIONS = [
  "No Formal Education",
  "Elementary Graduate",
  "High School Level",
  "High School Graduate",
  "Vocational/Trade Course",
  "Some College",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate/PhD",
]

const isBirthDateField = (fieldName: string) => {
  const normalized = fieldName.toLowerCase()
  return (
    normalized.includes("birth") ||
    normalized.includes("bday") ||
    normalized === "dob" ||
    normalized.includes("date_of_birth")
  )
}

const toDateInputValue = (value: string): string => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, "0")
  const day = String(parsed.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const normalizeExtraFieldValue = (fieldName: string, value: unknown): string => {
  const scalarValue = toEditableScalar(value)
  if (!scalarValue) return ""

  if (isBirthDateField(fieldName)) {
    return toDateInputValue(scalarValue)
  }

  return scalarValue
}

const formatExtraFieldDisplayValue = (fieldName: string, value: string): string => {
  if (!value) return "-"
  if (!isBirthDateField(fieldName)) return value

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  return parsed.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const getExtraScalarFields = (profile: YouthProfile): Record<string, string> => {
  const entries = Object.entries(profile).filter(([key, value]) => {
    if (EXCLUDED_EXTRA_KEYS.has(key)) return false
    if (value === null || value === undefined) return false

    const valueType = typeof value
    return valueType === "string" || valueType === "number" || valueType === "boolean"
  })

  return Object.fromEntries(entries.map(([key, value]) => [key, normalizeExtraFieldValue(key, value)]))
}

const getModerationIdCandidates = (profile: YouthProfile): string[] => {
  const rawCandidates = [
    profile.user_id,
    profile.userId,
    profile.member_id,
    profile.memberId,
    profile.user?.id,
    profile.id,
  ]

  return [...new Set(rawCandidates.map((value) => String(value ?? "").trim()).filter(Boolean))]
}

const YouthProfilesPage = () => {
  const router = useRouter()
  const [profiles, setProfiles] = useState<YouthProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Pending" | "Declined" | "Suspended"
  >("All")
  const [processingId, setProcessingId] = useState<string | number | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<YouthProfile | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false)
  const [isSuspendOpen, setIsSuspendOpen] = useState(false)
  const [isReactivateOpen, setIsReactivateOpen] = useState(false)
  const [barangays, setBarangays] = useState<string[]>([])
  const [loadingBarangays, setLoadingBarangays] = useState(false)
  const [editForm, setEditForm] = useState<EditProfileForm>({
    first_name: "",
    last_name: "",
    barangay: "",
    extraFields: {},
  })

  const fetchProfiles = useCallback(
    async (showLoader = false) => {
      if (showLoader) {
        setLoading(true)
      }

      try {
        const res = await fetch(`${API_BASE}/api/sk/youth-profiles`, {
          method: "GET",
          headers: { "x-app-type": "sk" },
          credentials: "include",
        })

        if (res.status === 401) {
          router.push("/auth/login")
          return false
        }

        if (res.status === 403) {
          setError("You don't have permission to view youth profiles.")
          return false
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          setError(body.message || "Failed to load youth profiles.")
          return false
        }

        const payload = await res.json()
        const mappedProfiles: YouthProfile[] = (payload.data ?? []).map((profile: YouthProfile) => ({
          ...profile,
          status: normalizeStatus(String(profile.status)),
        }))

        setError(null)
        setProfiles(mappedProfiles)
        return true
      } catch {
        setError("Unable to connect to the server. Please try again later.")
        return false
      } finally {
        if (showLoader) {
          setLoading(false)
        }
      }
    },
    [router]
  )

  useEffect(() => {
    fetchProfiles(true)
  }, [fetchProfiles])

  const filteredProfiles = useMemo(() => {
    const query = search.trim().toLowerCase()

    return profiles.filter((profile) => {
      const fullName = `${profile.first_name} ${profile.last_name}`

      const matchesSearch =
        !query ||
        [fullName, profile.email, profile.barangay].some((value) =>
          value.toLowerCase().includes(query)
        )

      const matchesStatus = statusFilter === "All" || formatStatus(profile.status) === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [profiles, search, statusFilter])

  const handleModeration = async (profile: YouthProfile, action: "approve" | "decline" | "suspend" | "reactivate") => {
    const idCandidates = getModerationIdCandidates(profile)

    if (idCandidates.length === 0) {
      toast.error("Invalid user id")
      return
    }

    setProcessingId(profile.id)

    try {
      for (const targetUserId of idCandidates) {
        const res = await fetch(`${API_BASE}/api/sk/youth-members/${targetUserId}/${action}`, {
          method: "PATCH",
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
          toast.error("You are not allowed to moderate this member")
          return
        }

        if (res.status === 400) {
          const body = await res.json().catch(() => ({}))
          toast.error(body.message || "Invalid user id")
          return
        }

        if (res.status === 404) {
          continue
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          toast.error(body.message || "Server error while processing moderation action")
          return
        }

        const body = await res.json()
        const nextStatus = normalizeStatus(String(body.appliedStatus || body?.data?.status || "pending"))
        void nextStatus

        await fetchProfiles(false)

        const successMessages: Record<string, string> = {
          approve: "Youth member approved",
          decline: "Youth member declined",
          suspend: "Youth member suspended",
          reactivate: "Youth member reactivated",
        }
        const actionTitles: Record<string, string> = {
          approve: "Approved",
          decline: "Declined",
          suspend: "Suspended",
          reactivate: "Reactivated",
        }
        toast.success(successMessages[action] ?? "Action applied")
        logActivity({
          title: `Youth Member ${actionTitles[action] ?? (action.charAt(0).toUpperCase() + action.slice(1))}`,
          description: `Applied "${action}" to ${profile.first_name} ${profile.last_name}.`,
          action: `${action}_youth_member`,
          entity_type: "youth_member",
        })
        return
      }

      toast.error("Not found or already processed")
    } catch {
      toast.error("Unable to connect to the server. Please try again later.")
    } finally {
      setProcessingId(null)
    }
  }

  const fetchBarangays = useCallback(async () => {
    if (!API_BASE || barangays.length > 0) return
    setLoadingBarangays(true)
    try {
      const res = await fetch(`${API_BASE}/api/sk/barangays`, {
        method: "GET",
        headers: { "x-app-type": "sk" },
        credentials: "include",
      })
      if (!res.ok) return
      const body = await res.json().catch(() => ({}))
      const list: string[] = Array.isArray(body.data)
        ? body.data.map((item: unknown) => {
            if (typeof item === "string") return item
            if (item && typeof item === "object" && "name" in item) return String((item as { name: unknown }).name)
            return String(item)
          })
        : []
      setBarangays(list)
    } catch {
      // silently fail; input falls back gracefully
    } finally {
      setLoadingBarangays(false)
    }
  }, [barangays.length])

  const handleViewProfile = (profile: YouthProfile) => {
    setSelectedProfile(profile)
    setIsViewOpen(true)
  }

  const handleOpenEditProfile = (profile: YouthProfile) => {
    void fetchBarangays()
    setSelectedProfile(profile)
    setEditForm({
      first_name: profile.first_name,
      last_name: profile.last_name,
      barangay: profile.barangay,
      extraFields: getExtraScalarFields(profile),
    })
    setIsEditOpen(true)
  }

  const handleSaveEditProfile = async () => {
    if (!selectedProfile) return

    const idCandidates = getModerationIdCandidates(selectedProfile)
    if (idCandidates.length === 0) {
      toast.error("Invalid user id")
      return
    }

    const nextFirstName = editForm.first_name.trim()
    const nextLastName = editForm.last_name.trim()
    const nextBarangay = editForm.barangay.trim()

    if (!nextFirstName || !nextLastName || !nextBarangay) {
      toast.error("Please complete all required fields")
      return
    }

    const payload: Record<string, string> = {
      first_name: nextFirstName,
      last_name: nextLastName,
      barangay: nextBarangay,
    }

    for (const [key, value] of Object.entries(editForm.extraFields)) {
      const trimmedValue = value.trim()
      if (!trimmedValue) continue

      if (isBirthDateField(key)) {
        payload.bday = trimmedValue
      } else {
        payload[key] = trimmedValue
      }
    }

    try {
      for (const targetUserId of idCandidates) {
        const res = await fetch(`${API_BASE}/api/sk/youth-members/${targetUserId}`, {
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
          toast.error("You are not allowed to edit this member")
          return
        }

        if (res.status === 400) {
          const body = await res.json().catch(() => ({}))
          toast.error(body.message || "No valid fields to update")
          return
        }

        if (res.status === 404) {
          continue
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          toast.error(body.message || "Server error while updating member")
          return
        }

        await fetchProfiles(false)
        setIsEditOpen(false)
        toast.success("Youth profile updated")
        logActivity({
          title: "Youth Profile Updated",
          description: `Updated profile of ${nextFirstName} ${nextLastName}.`,
          action: "update_youth_member",
          entity_type: "youth_member",
        })
        return
      }

      toast.error("Member not found in your barangay")
    } catch {
      toast.error("Unable to connect to the server. Please try again later.")
    }
  }

  const handleOpenSuspendProfile = (profile: YouthProfile) => {
    setSelectedProfile(profile)
    setIsSuspendOpen(true)
  }

  const handleConfirmSuspend = async () => {
    if (!selectedProfile) return
    setIsSuspendOpen(false)
    await handleModeration(selectedProfile, "suspend")
  }

  const handleOpenReactivateProfile = (profile: YouthProfile) => {
    setSelectedProfile(profile)
    setIsReactivateOpen(true)
  }

  const handleConfirmReactivate = async () => {
    if (!selectedProfile) return
    setIsReactivateOpen(false)
    await handleModeration(selectedProfile, "reactivate")
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Title className="mb-0">Youth Profiles</Title>
        <p className="text-gray-500">
          A searchable registry of youth participants and their current program status.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="bg-white flex-1 px-4 py-3 rounded-sm focus:outline-0 border border-gray-200"
          placeholder="Search by name, email, or barangay"
        />

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as "All" | "Active" | "Pending" | "Declined" | "Suspended")
          }
        >
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
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-theme-card-white shadow-sm">
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
              <Spinner className="size-5" />
              <span className="text-sm">Loading youth profiles…</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No youth profiles match your search or filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        {profile.first_name} {profile.last_name}
                      </TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>{formatStatus(profile.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreVerticalIcon />
                              <span className="sr-only">Open actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {profile.status === "pending" ? (
                              <>
                                <DropdownMenuItem
                                  disabled={processingId === profile.id}
                                  onClick={() => handleModeration(profile, "approve")}
                                >
                                  {processingId === profile.id ? "Approving..." : "Approve"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  variant="destructive"
                                  disabled={processingId === profile.id}
                                  onClick={() => handleModeration(profile, "decline")}
                                >
                                  {processingId === profile.id ? "Declining..." : "Decline"}
                                </DropdownMenuItem>
                              </>
                            ) : profile.status === "active" ? (
                              <>
                                <DropdownMenuItem onClick={() => handleViewProfile(profile)}>
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleOpenEditProfile(profile)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  disabled={processingId === profile.id}
                                  onClick={() => handleOpenSuspendProfile(profile)}
                                >
                                  {processingId === profile.id ? "Suspending..." : "Suspend"}
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <>
                                <DropdownMenuItem onClick={() => handleViewProfile(profile)}>
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  disabled={processingId === profile.id}
                                  onClick={() => handleOpenReactivateProfile(profile)}
                                >
                                  {processingId === profile.id ? "Reactivating..." : "Reactivate"}
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Youth Profile Details</DialogTitle>
            <DialogDescription>View this member&apos;s current information.</DialogDescription>
          </DialogHeader>

          {selectedProfile ? (
            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">First Name</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{selectedProfile.first_name}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Last Name</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{selectedProfile.last_name}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{selectedProfile.email}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Barangay</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{selectedProfile.barangay}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{formatStatus(selectedProfile.status)}</p>
                </div>
              </div>

              {Object.keys(getExtraScalarFields(selectedProfile)).length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-700">Additional Details</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Object.entries(getExtraScalarFields(selectedProfile)).map(([key, value]) => (
                      <div key={key} className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">{formatFieldLabel(key)}</p>
                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {formatExtraFieldDisplayValue(key, value)}
                          </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Youth Profile</DialogTitle>
            <DialogDescription>Update profile information for this member.</DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-first-name">First Name</Label>
                <Input
                  id="edit-first-name"
                  value={editForm.first_name}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, first_name: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-last-name">Last Name</Label>
                <Input
                  id="edit-last-name"
                  value={editForm.last_name}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, last_name: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="rounded-md border border-gray-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {selectedProfile?.email || "-"}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-barangay">Barangay</Label>
                <Select
                  value={editForm.barangay}
                  onValueChange={(value) => setEditForm((prev) => ({ ...prev, barangay: value }))}
                  disabled={loadingBarangays}
                >
                  <SelectTrigger id="edit-barangay">
                    <SelectValue placeholder={loadingBarangays ? "Loading..." : "Select barangay"} />
                  </SelectTrigger>
                  <SelectContent>
                    {barangays.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="rounded-md border border-gray-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {selectedProfile ? formatStatus(selectedProfile.status) : "-"}
                </div>
              </div>
            </div>

            {Object.keys(editForm.extraFields).length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">Additional Details</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(editForm.extraFields).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`edit-extra-${key}`}>{formatFieldLabel(key)}</Label>
                      {(() => {
                        const opts = isGenderField(key)
                          ? { options: GENDER_OPTIONS, placeholder: "Select gender" }
                          : isEmploymentStatusField(key)
                          ? { options: EMPLOYMENT_STATUS_OPTIONS, placeholder: "Select employment status" }
                          : isEducationLevelField(key)
                          ? { options: EDUCATION_LEVEL_OPTIONS, placeholder: "Select education level" }
                          : null

                        return opts ? (
                          <Select
                            value={value}
                            onValueChange={(val) =>
                              setEditForm((prev) => ({
                                ...prev,
                                extraFields: { ...prev.extraFields, [key]: val },
                              }))
                            }
                          >
                            <SelectTrigger id={`edit-extra-${key}`}>
                              <SelectValue placeholder={opts.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                              {opts.options.map((o) => (
                                <SelectItem key={o} value={o}>{o}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id={`edit-extra-${key}`}
                            type={isBirthDateField(key) ? "date" : "text"}
                            value={value}
                            onChange={(event) =>
                              setEditForm((prev) => ({
                                ...prev,
                                extraFields: {
                                  ...prev.extraFields,
                                  [key]: event.target.value,
                                },
                              }))
                            }
                          />
                        )
                      })()}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => { setIsEditOpen(false); setIsEditConfirmOpen(true) }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isEditConfirmOpen} onOpenChange={setIsEditConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update {selectedProfile?.first_name}&apos;s profile? This will overwrite their current information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsEditOpen(true)}>Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveEditProfile}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isSuspendOpen} onOpenChange={setIsSuspendOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend youth profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This will suspend {selectedProfile?.first_name || "this member"}. They can be reactivated later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmSuspend}>
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isReactivateOpen} onOpenChange={setIsReactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate youth profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore {selectedProfile?.first_name || "this member"}&apos;s active membership.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReactivate}>
              Reactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default YouthProfilesPage
