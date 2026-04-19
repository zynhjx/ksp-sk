// context/SidebarContext.jsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const SIDEBAR_STORAGE_KEY = 'ksp-sk-sidebar-open'

type SidebarContextType = {
  isOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  openSidebar: () => {},
  closeSidebar: () => {},
  toggleSidebar: () => {},
})

export const SidebarProvider = ({ children }: {children: React.ReactNode}) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const storedValue = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)

    if (storedValue === null) return

    setIsOpen(storedValue === 'true')
  }, [])

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isOpen))
  }, [isOpen])

  const openSidebar = () => setIsOpen(true)
  const closeSidebar = () => setIsOpen(false)
  const toggleSidebar = () => setIsOpen(prev => !prev)

  return (
    <SidebarContext.Provider
      value={{ isOpen, openSidebar, closeSidebar, toggleSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)