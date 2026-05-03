"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ForceLogoutState = {
  title: string
  message: string
} | null

export default function SuspensionGuard() {
  const router = useRouter()
  const [forceLogout, setForceLogout] = useState<ForceLogoutState>(null)

  useEffect(() => {
    const originalFetch = window.fetch

    window.fetch = async (...args): Promise<Response> => {
      const res = await originalFetch(...args)

      if (res.status === 403) {
        const clone = res.clone()
        clone
          .json()
          .then((body: { reason?: string; message?: string }) => {
            if (body?.reason === "account_suspended") {
              setForceLogout({
                title: "Account Suspended",
                message: body.message ?? "Your account has been suspended.",
              })
            } else if (body?.reason === "barangay_inactive") {
              setForceLogout({
                title: "Barangay Deactivated",
                message: body.message ?? "Your barangay has been deactivated.",
              })
            }
          })
          .catch(() => {})
      }

      return res
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  const handleAcknowledge = () => {
    setForceLogout(null)
    router.push("/auth/login")
  }

  return (
    <Dialog open={forceLogout !== null} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{forceLogout?.title}</DialogTitle>
          <DialogDescription>{forceLogout?.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleAcknowledge}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
