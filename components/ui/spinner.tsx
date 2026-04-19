import { LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className }: { className?: string }) {
  return (
    <LoaderCircle
      aria-hidden="true"
      className={cn("size-5 animate-spin text-theme-blue", className)}
    />
  )
}

export { Spinner }