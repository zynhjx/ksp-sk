'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Title from "@/components/Title"
import DashboardGraphicOrganizer from "@/components/DashboardGraphicOrganizer"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

type DashboardCounts = {
  totalYouthMembers: number
  ongoingPrograms: number
  totalPrograms: number
  pendingUsers: number
}

type DashboardCountsResponse = {
  message?: string
  data?: Partial<DashboardCounts>
}

type AgeBucketLabel = "13-15" | "16-18" | "19-21" | "22-24" | "25-27" | "28-30"

type AgeDistributionItem = {
  label: AgeBucketLabel
  count: number
}

type AgeDistributionResponse = {
  message?: string
  data?: {
    barangay?: string
    distribution?: AgeDistributionItem[]
  }
}

type AgeDistributionChartItem = {
  label: AgeBucketLabel
  value: number
  color: string
}

type EmploymentStatusLabel =
  | "Employed"
  | "Unemployed"
  | "Self-Employed"
  | "Freelancer"
  | "Student"
  | "Retired"
  | "Homemaker"
  | "Part-Time"
  | "Intern/Trainee"

type EmploymentStatusDistributionItem = {
  label: EmploymentStatusLabel
  count: number
}

type EmploymentStatusDistributionResponse = {
  message?: string
  data?: {
    barangay?: string
    distribution?: EmploymentStatusDistributionItem[]
  }
}

type EmploymentStatusChartItem = {
  label: EmploymentStatusLabel
  value: number
  color: string
}

type EducationLevelLabel =
  | "No Formal Education"
  | "Elementary Graduate"
  | "High School Level"
  | "High School Graduate"
  | "Vocational/Trade Course"
  | "Some College"
  | "Bachelor's Degree"
  | "Master's Degree"
  | "Doctorate/PhD"

type EducationLevelDistributionItem = {
  label: EducationLevelLabel
  count: number
}

type EducationLevelDistributionResponse = {
  message?: string
  data?: {
    barangay?: string
    distribution?: EducationLevelDistributionItem[]
  }
}

type EducationLevelChartItem = {
  label: EducationLevelLabel
  value: number
  color: string
}

const API_BASE = process.env.NEXT_PUBLIC_EXPRESS_API_URL

const defaultCounts: DashboardCounts = {
  totalYouthMembers: 0,
  ongoingPrograms: 0,
  totalPrograms: 0,
  pendingUsers: 0,
}

const AGE_BUCKETS: AgeBucketLabel[] = ["13-15", "16-18", "19-21", "22-24", "25-27", "28-30"]
const AGE_BUCKET_COLORS: Record<AgeBucketLabel, string> = {
  "13-15": "#2563eb",
  "16-18": "#0ea5e9",
  "19-21": "#14b8a6",
  "22-24": "#f59e0b",
  "25-27": "#a855f7",
  "28-30": "#f97316",
}

const defaultAgeDistribution: AgeDistributionChartItem[] = AGE_BUCKETS.map((bucket) => ({
  label: bucket,
  value: 0,
  color: AGE_BUCKET_COLORS[bucket],
}))

const EMPLOYMENT_STATUSES: EmploymentStatusLabel[] = [
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

const EMPLOYMENT_STATUS_COLORS: Record<EmploymentStatusLabel, string> = {
  Employed: "#2563eb",
  Unemployed: "#0ea5e9",
  "Self-Employed": "#14b8a6",
  Freelancer: "#06b6d4",
  Student: "#67e8f9",
  Retired: "#f59e0b",
  Homemaker: "#f97316",
  "Part-Time": "#a855f7",
  "Intern/Trainee": "#ec4899",
}

const defaultEmploymentStatusData: EmploymentStatusChartItem[] = EMPLOYMENT_STATUSES.map((status) => ({
  label: status,
  value: 0,
  color: EMPLOYMENT_STATUS_COLORS[status],
}))

const EDUCATION_LEVELS: EducationLevelLabel[] = [
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

const EDUCATION_LEVEL_COLORS: Record<EducationLevelLabel, string> = {
  "No Formal Education": "#334155",
  "Elementary Graduate": "#0ea5e9",
  "High School Level": "#2563eb",
  "High School Graduate": "#14b8a6",
  "Vocational/Trade Course": "#06b6d4",
  "Some College": "#67e8f9",
  "Bachelor's Degree": "#f59e0b",
  "Master's Degree": "#f97316",
  "Doctorate/PhD": "#a855f7",
}

const defaultEducationLevelData: EducationLevelChartItem[] = EDUCATION_LEVELS.map((level) => ({
  label: level,
  value: 0,
  color: EDUCATION_LEVEL_COLORS[level],
}))

type GenderChartItem = {
  label: string
  value: number
  color: string
}

const GENDER_COLOR_PALETTE = [
  "#2563eb",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#a855f7",
  "#f97316",
  "#06b6d4",
  "#84cc16",
]

const DEFAULT_GENDER_LABELS = ["Male", "Female", "Non-binary"]

const defaultGenderDistributionData: GenderChartItem[] = DEFAULT_GENDER_LABELS.map((label, index) => ({
  label,
  value: 0,
  color: GENDER_COLOR_PALETTE[index % GENDER_COLOR_PALETTE.length],
}))

const Dashboard = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [counts, setCounts] = useState<DashboardCounts>(defaultCounts)
  const [ageDistributionData, setAgeDistributionData] = useState<AgeDistributionChartItem[]>(defaultAgeDistribution)
  const [employmentStatusData, setEmploymentStatusData] = useState<EmploymentStatusChartItem[]>(defaultEmploymentStatusData)
  const [educationLevelData, setEducationLevelData] = useState<EducationLevelChartItem[]>(defaultEducationLevelData)
  const [genderDistributionData, setGenderDistributionData] = useState<GenderChartItem[]>(defaultGenderDistributionData)
  const [loadingCounts, setLoadingCounts] = useState(true)
  const [countsError, setCountsError] = useState<string | null>(null)
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }, [])

  const title = user ? `${greeting}, ${user.first_name}!` : `${greeting}!`

  const stats = useMemo(
    () => [
      { label: "Total Youth Members", value: counts.totalYouthMembers },
      { label: "Ongoing Programs", value: counts.ongoingPrograms },
      { label: "Total Programs", value: counts.totalPrograms },
      { label: "Pending Users", value: counts.pendingUsers },
    ],
    [counts]
  )

  const fetchDashboardCounts = useCallback(async () => {
    if (!API_BASE) {
      setCountsError("Missing API URL configuration.")
      setLoadingCounts(false)
      return
    }

    try {
      setLoadingCounts(true)

      const res = await fetch(`${API_BASE}/api/sk/dashboard-counts`, {
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

      if (res.status === 403) {
        setCountsError("You do not have permission to view dashboard counts.")
        return
      }

      const body: DashboardCountsResponse = await res.json().catch(() => ({}))

      if (!res.ok) {
        setCountsError(body.message || "Failed to load dashboard counts.")
        return
      }

      const nextCounts = body.data || {}
      setCounts({
        totalYouthMembers: Number(nextCounts.totalYouthMembers || 0),
        ongoingPrograms: Number(nextCounts.ongoingPrograms || 0),
        totalPrograms: Number(nextCounts.totalPrograms || 0),
        pendingUsers: Number(nextCounts.pendingUsers || 0),
      })
      setCountsError(null)
    } catch {
      setCountsError("Unable to connect to the server. Please try again.")
    } finally {
      setLoadingCounts(false)
    }
  }, [router])

  const fetchAgeDistribution = useCallback(async () => {
    if (!API_BASE) {
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/sk/age-distribution`, {
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

      if (res.status === 403) {
        return
      }

      const body: AgeDistributionResponse = await res.json().catch(() => ({}))

      if (!res.ok) {
        return
      }

      const distribution = body.data?.distribution || []
      const countsByLabel = new Map<string, number>(
        distribution.map((item) => [String(item.label), Number(item.count || 0)])
      )

      const normalized = AGE_BUCKETS.map((bucket) => ({
        label: bucket,
        value: Number(countsByLabel.get(bucket) || 0),
        color: AGE_BUCKET_COLORS[bucket],
      }))

      setAgeDistributionData(normalized)
    } catch {
      // Keep default chart values on transient failures.
    }
  }, [router])

  const fetchEmploymentStatusDistribution = useCallback(async () => {
    if (!API_BASE) {
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/sk/employment-status-distribution`, {
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

      if (res.status === 403) {
        return
      }

      const body: EmploymentStatusDistributionResponse = await res.json().catch(() => ({}))

      if (!res.ok) {
        return
      }

      const distribution = body.data?.distribution || []
      const countsByLabel = new Map<string, number>(
        distribution.map((item) => [String(item.label), Number(item.count || 0)])
      )

      const normalized = EMPLOYMENT_STATUSES.map((status) => ({
        label: status,
        value: Number(countsByLabel.get(status) || 0),
        color: EMPLOYMENT_STATUS_COLORS[status],
      }))

      setEmploymentStatusData(normalized)
    } catch {
      // Keep default chart values on transient failures.
    }
  }, [router])

  const fetchEducationLevelDistribution = useCallback(async () => {
    if (!API_BASE) {
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/sk/education-level-distribution`, {
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

      if (res.status === 403) {
        return
      }

      const body: EducationLevelDistributionResponse = await res.json().catch(() => ({}))

      if (!res.ok) {
        return
      }

      const distribution = body.data?.distribution || []
      const countsByLabel = new Map<string, number>(
        distribution.map((item) => [String(item.label), Number(item.count || 0)])
      )

      const normalized = EDUCATION_LEVELS.map((level) => ({
        label: level,
        value: Number(countsByLabel.get(level) || 0),
        color: EDUCATION_LEVEL_COLORS[level],
      }))

      setEducationLevelData(normalized)
    } catch {
      // Keep default chart values on transient failures.
    }
  }, [router])

  useEffect(() => {
    void fetchDashboardCounts()
  }, [fetchDashboardCounts])

  useEffect(() => {
    void fetchAgeDistribution()
  }, [fetchAgeDistribution])

  useEffect(() => {
    void fetchEmploymentStatusDistribution()
  }, [fetchEmploymentStatusDistribution])

  useEffect(() => {
    void fetchEducationLevelDistribution()
  }, [fetchEducationLevelDistribution])

  const fetchGenderDistribution = useCallback(async () => {
    if (!API_BASE) return
    try {
      const res = await fetch(`${API_BASE}/api/sk/gender-distribution`, {
        method: "GET",
        headers: { "x-app-type": "sk" },
        credentials: "include",
      })
      if (res.status === 401) { toast.error("Your session expired. Please log in again."); router.push("/auth/login"); return }
      if (res.status === 403) return
      const body = await res.json().catch(() => ({}))
      if (!res.ok) return
      const distribution: Array<{ label: string; count: number }> = body.data?.distribution || []
      const countsByLabel = new Map<string, number>(
        distribution.map((item) => [String(item.label), Number(item.count || 0)])
      )
      // Start from defaults so Male/Female/Non-binary always appear,
      // then merge in any extra labels returned by the API.
      const apiLabels = distribution.map((item) => String(item.label))
      const extraLabels = apiLabels.filter((l) => !DEFAULT_GENDER_LABELS.includes(l))
      const allLabels = [...DEFAULT_GENDER_LABELS, ...extraLabels]
      const items: GenderChartItem[] = allLabels.map((label, index) => ({
        label,
        value: Number(countsByLabel.get(label) || 0),
        color: GENDER_COLOR_PALETTE[index % GENDER_COLOR_PALETTE.length],
      }))
      setGenderDistributionData(items)
    } catch {
      // Keep default on failure.
    }
  }, [router])

  useEffect(() => {
    void fetchGenderDistribution()
  }, [fetchGenderDistribution])

  return (
    <>
      <Title className="mb-8 text-3xl">{title}</Title>

      {countsError ? (
        <div className="mb-6 rounded-2xl border border-dashed border-red-300 bg-theme-card-white px-4 py-3 text-sm text-red-600">
          {countsError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-theme-card-white shadow-sm rounded-2xl h-24 flex flex-col justify-center items-center px-4"
          >
            <span className="text-2xl text-theme-blue font-bold">
              {loadingCounts ? "..." : s.value}
            </span>
            <span className="text-center">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <DashboardGraphicOrganizer
          employmentStatusData={employmentStatusData}
          educationLevelData={educationLevelData}
          ageDistributionData={ageDistributionData}
          genderDistributionData={genderDistributionData}
        />
      </div>
    </>
  )
}
export default Dashboard
