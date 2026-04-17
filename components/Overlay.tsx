'use client'

import { useSidebar } from '@/context/SidebarContext'

export default function Overlay() {
  const { isOpen, closeSidebar } = useSidebar()

  return (
    <div
      onClick={closeSidebar}
      className={`
        xl:hidden
        fixed inset-0 z-40
        bg-black/30 backdrop-blur-sm
        transition-opacity duration-300
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
      `}
    />
  )
}