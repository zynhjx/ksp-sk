import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import React from "react"
type ButtonType = {
	disabled?: boolean,
	type?: "submit" | "reset" | "button" | undefined,
	className?: string,
	children: string | ReactNode,
	primary?: boolean,
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const Button = ({disabled, type, className, children, primary, onClick}: ButtonType) => {
  return (
    <button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={twMerge(
				"w-full py-3 rounded-xl font-bold hover:opacity-90 transition flex border items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
				primary ? "bg-theme-blue text-white shadow-blue-900/20 border-theme-blue flex-2"
					: "bg-white text-theme-blue border-theme-blue/20 flex-1"
				,
				className
			)}
    >
    	{children}
    </button>
  )
}

export default Button