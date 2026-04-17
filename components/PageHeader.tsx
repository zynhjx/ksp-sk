"use client"

import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type PageHeaderType = {
  title: string
  subtitle?: string
  filters?: ReactNode
  actionButton?: boolean
  buttonLabel?: string
  onButtonClick?: () => void
  searchPlaceholder: string
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

const PageHeader = ({
    title, 
    subtitle, 
    filters,
    actionButton, 
    buttonLabel, 
    onButtonClick, 
    searchPlaceholder,
    search,
    setSearch
  }: PageHeaderType) => {

  return (
    <div className="flex flex-col mb-8">
      <div className="flex mb-6">
        <div className="flex flex-col space-y-1">
          <h1 className={twMerge("font-bold text-3xl text-theme-dark-blue")}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-500">{subtitle}</p>
          )}
        </div>

        {actionButton &&  (
          <div className="ml-auto flex items-center">
            <button
              onClick={onButtonClick}
              className="bg-theme-dark-blue text-theme-white px-5 py-2 rounded-md"
            >
              {buttonLabel ?? "Button"}
            </button>
          </div>
        )}
        
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white flex-1 px-4 py-3 rounded-sm focus:outline-0 border border-gray-200"
          placeholder={searchPlaceholder}
        />

        {filters && (
          <div className="flex gap-2">
            {filters}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader