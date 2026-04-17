import { twMerge } from "tailwind-merge";
import React from "react";


const CardTitle = ({title, subtitle, className}: {title: string, subtitle?: string, className?: string}) => {
  return (
    <div className={twMerge("mb-6 text-center",
      className
    )}>
      <h2 className="text-4xl md:text-3xl font-bold text-theme-blue mb-2">{title}</h2>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  )
}
export default CardTitle
