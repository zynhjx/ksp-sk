import {ReactNode} from "react";
import Sidebar from  "@/components/Sidebar"
import MobileHeader from "@/components/MobileHeader";
import { SidebarProvider } from "@/context/SidebarContext";
import Overlay from "@/components/Overlay";
import { AuthProvider } from "@/context/AuthContext";
import { cookies } from "next/headers";

type User = {
  id: string
  email: string
  role: string
  status: string
  barangay: string
  first_name: string
  last_name: string
  gender: string
}

async function getUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")

    if (!token) return null

    const res = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/auth/me`, {
      headers: {
        Cookie: `accessToken=${token.value}`,
        "x-app-type": "sk",
      },
      cache: "no-store",
    })

    if (!res.ok) return null

    const data = await res.json()
    return data.user
  } catch {
    return null
  }
}

const Layout = async ({children}: {children: ReactNode} ) => {
  const user = await getUser()


  return (
    <AuthProvider initialUser={user}>
      <div className="w-screen h-screen bg-theme-white flex">
        <SidebarProvider>
          <Sidebar/>
          <main className="pt-25 md:pt-6 md:ml-18 xl:ml-0 bg-theme-white flex-1 p-8 overflow-y-scroll">
            <Overlay/>
            <MobileHeader/>
            {children}
          </main>
        </SidebarProvider>
        
      </div>
    </AuthProvider>
    

  )
}
export default Layout
