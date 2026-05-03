'use client'

import CardTitle from '@/components/auth/CardTitle'
import { motion } from 'framer-motion'
import FormInput from '@/components/auth/form/FormInput'
import { useState, useEffect } from 'react'
import Button from '@/components/Button'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button as ShadButton } from '@/components/ui/button'


const positions = [
  "Chairperson",
  "SK Secretary",
  "SK Treasurer",
  "SK Kagawad"
]

const OnboardingPage = () => {
  const [submitPending, setSubmitPending] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [barangay, setBarangay] = useState("");
  const [position, setPosition] = useState("")
  const [password, setPassword] = useState("")
  const [confPassword, setConfPassword] = useState("")
  const [barangays, setBarangays] = useState<string[]>([])
  const [barangaysLoading, setBarangaysLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const fetchBarangays = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/sk/barangays`, {
          headers: { "x-app-type": "sk" },
          credentials: "include",
        })
        const body = await res.json().catch(() => ({}))
        if (!res.ok) return
        const list: string[] = Array.isArray(body.data)
          ? body.data.map((item: unknown) => {
              if (typeof item === "string") return item
              if (item && typeof item === "object" && "name" in item) return String((item as { name: unknown }).name)
              return String(item)
            })
          : Array.isArray(body)
            ? body.map((item: unknown) => {
                if (typeof item === "string") return item
                if (item && typeof item === "object" && "name" in item) return String((item as { name: unknown }).name)
                return String(item)
              })
            : []
        setBarangays(list)
      } catch {
        // silently fall back to empty list
      } finally {
        setBarangaysLoading(false)
      }
    }
    void fetchBarangays()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      firstName,
      lastName,
      barangay,
      position,
      password
    };
    

    try {
      setSubmitPending(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/sk/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-type": "sk",
        },
        body: JSON.stringify({ formData }),
        credentials: "include", // include cookies if you're using auth
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          toast.error(data.message)
          return router.push("/auth/register")
        }
        throw new Error(data.message || "Something went wrong");
      }

      setShowApprovalDialog(true)

    } catch (error) {
      console.error("Error submitting form:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit your information. Please try again.");
      }
    } finally {
      setSubmitPending(false)
    }
  };


  const isFormValid = firstName.trim() !== "" && lastName.trim() !== "" && barangay.trim() !== "" && password.trim() !== "" && password === confPassword && password.length >= 8

  return (
    <>
    <Dialog open={showApprovalDialog} onOpenChange={() => {}}
    >
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Account Submitted</DialogTitle>
          <DialogDescription>
            Your profile has been submitted successfully. Please wait for the admin to review and approve your account before you can access the portal.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <ShadButton onClick={() => router.replace("/auth/login")}>
            Got it
          </ShadButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <div className="min-h-screen bg-theme-white md:bg-gray-50 flex flex-col items-center md:justify-center md:p-6 text-gray-900">
      <div className="w-full mt-8 md:mt-0 max-w-full md:max-w-xl bg-theme-white md:rounded-3xl md:shadow-xl md:shadow-theme-blue/40 md:border border-gray-100 overflow-hidden p-8 md:p-12">
        <CardTitle title='Welcome Aboard' subtitle='Let’s get you set up in just a few steps.'/>
        <form onSubmit={handleSubmit}>
            <motion.div
              initial={{x: 10, opacity: 0}}
              animate={{x: 0, opacity: 1}}
              exit={{x:-10, opacity: 0}}
              transition={{ duration: 0.5 }}
              className='space-y-4'
            >
              <div className='flex flex-col md:flex-row gap-x-2 space-y-4 md:space-y-0'>
                <FormInput
                  value={firstName}
                  label='First Name' 
                  type='text'
                  placeholder='Juan'
                  onChange={(e) => setFirstName(e.target.value)}/>

                <FormInput
                  value={lastName}
                  label='Last Name' 
                  type='text' 
                  placeholder='Dela Cruz'
                  onChange={(e) => setLastName(e.target.value)}/>

              </div>

              <label className="text-sm font-semibold text-gray-700">Barangay</label>
              <Select value={barangay} onValueChange={setBarangay} disabled={barangaysLoading}>
                <SelectTrigger className='text-base w-full min-h-12 flex-1 px-4 rounded border border-gray-200 focus:border-theme-blue focus:ring-0 outline-none transition'>
                  <SelectValue placeholder={barangaysLoading ? "Loading barangays..." : "Select Barangay"}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {barangays.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <label className="text-sm font-semibold text-gray-700">Position</label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className='text-base w-full min-h-12 flex-1 px-4 rounded border border-gray-200 focus:border-theme-blue focus:ring-0 outline-none transition'>
                  <SelectValue placeholder="Select Position"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {positions.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <FormInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type='password'
                placeholder='Password'
                label='Password'
              />
              
              <FormInput
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                type='password'
                placeholder='Confirm Password'
                label='Confirm Password'
              />

            </motion.div>
          

          <div className='mt-6 flex gap-x-4'>
            <Button 
              className='flex-2'
              primary type={'submit'} disabled={!isFormValid || submitPending}>
                {"Submit"}
              </Button>
          </div>
        </form>

      </div>
    </div>
    </>
  )
}

export default OnboardingPage