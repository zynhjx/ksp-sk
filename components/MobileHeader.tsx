'use client'

import { useSidebar } from "@/context/SidebarContext"
import { Menu } from "lucide-react"
import { twMerge } from "tailwind-merge"

const MobileHeader = () => {

  const { isOpen, toggleSidebar } = useSidebar()

  return (
    <div className="md:hidden fixed bg-theme-dark-blue top-0 right-0 left-0 h-18.75 flex">
      <div className="flex items-center w-18 justify-center">
        <button onClick={() => toggleSidebar()}
          className={twMerge(
            "p-3 cursor-pointer hover:bg-white/10 rounded-2xl border-none",
            isOpen && "ml-auto"
          )
        }>
          <Menu color="#F9FAFB" size={24}/>
        </button>
      </div>
    </div>
  )
}

export default MobileHeader