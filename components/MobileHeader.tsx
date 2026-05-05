'use client'

import { useState } from "react"
import { useSidebar } from "@/context/SidebarContext"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { twMerge } from "tailwind-merge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { CircleUser, LogOutIcon } from "lucide-react"
import Image from "next/image"
import ProfileDialog from "@/components/ProfileDialog"

const toTitleCase = (str: string = "") => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const MobileHeader = () => {

  const { isOpen, toggleSidebar } = useSidebar()
  const { user, setUser } = useAuth()
  const router = useRouter()
  const userInitial = user?.first_name?.charAt(0)?.toUpperCase() || "U"
  const userFullName = user
    ? `${toTitleCase(user.first_name)} ${toTitleCase(user.last_name)}`.trim()
    : "SK Official"
  const userEmail = user?.email || "No email available"
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "x-app-type": "sk",
        },
      })
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setUser(null)
      router.push("/auth/login")
    }
  }

  return (
    <>
    <div className="md:hidden fixed bg-theme-white border-b border-gray-300 top-0 right-0 left-0 h-18.75 flex items-center justify-between pr-4">
      <div className="flex items-center">
        <div className="flex items-center w-18 justify-center">
          <button onClick={() => toggleSidebar()}
            className={twMerge(
              "p-3 cursor-pointer hover:bg-slate-100 rounded-2xl border-none",
              isOpen && "ml-auto"
            )
          }>
            <Menu color="#1e40af" size={24}/>
          </button>
        </div>
        <Image
          src="/LogoTextDark.svg"
          alt="KSP Logo"
          width={90}
          height={28}
          className="-ml-2 h-auto"
          priority
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-10 w-10 rounded-lg bg-theme-blue hover:bg-theme-blue/90 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
            {userInitial}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-3 py-2 min-w-65" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex items-center rounded-md gap-x-3 mb-2">
                <div className="flex rounded-lg h-10 w-10 bg-theme-blue justify-center items-center text-white text-lg font-bold">{userInitial}</div>
                <div className="flex flex-1 flex-col justify-center min-w-0">
                  <span className="text-sm truncate">{userFullName}</span>
                  <span className="text-xs text-gray-500 truncate">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem className="p-2" onSelect={() => setIsProfileOpen(true)}><CircleUser /> Profile</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="p-2"
                  variant="destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <LogOutIcon /> Logout
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out of your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be signed out and need to log in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={(e) => {
                    e.preventDefault()
                    handleLogout()
                  }}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
  </>
  )
}

export default MobileHeader