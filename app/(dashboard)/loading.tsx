
import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-3">
      <Spinner className="size-8 text-theme-blue" />
      <p className="text-sm font-medium text-slate-500">Loading...</p>
    </div>
  )
}