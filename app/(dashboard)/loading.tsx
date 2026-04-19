
import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <Spinner className="size-7" />
        <p className="text-sm font-medium text-slate-600">Loading dashboard...</p>
      </div>
    </div>
  )
}