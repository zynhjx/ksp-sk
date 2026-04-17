import React from "react";
import { twMerge } from "tailwind-merge";

type InputProps = {
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  type: "text" | "password" | "email" | "number",
  placeholder?: string,
  maxLength?: number,
  name?: string,
  label?: string,
  inputMode?: "numeric" | "text",
  pattern?: string,
  className?: string,
  containerClassName?: string,
  error?: boolean,
  success?: boolean
}

const FormInput = ({value, label, onChange, type, pattern, inputMode, name, className, maxLength, placeholder, containerClassName, error, success}: InputProps) => {
  return (
    <div className={twMerge("space-y-1 flex flex-col w-full", containerClassName)}>
      {label && (
        <label className={twMerge("text-sm font-semibold text-gray-700",
          error && "text-red-600", success && "text-green-600"
        )}>{label}</label>
      )}
      
      <input
        type={type}
        inputMode={inputMode}
        name={name}
        value={value}
        pattern={pattern}
        maxLength={maxLength}
        onChange={onChange}
        placeholder={placeholder}
        className={twMerge("w-full px-4 h-12 rounded-l border border-gray-200 focus:border-theme-blue  outline-none transition",
          error && "border-red-600 text-red-600",
          success && "border-green-600 text-green-600",
          className
        )}
      />
    </div>
  )
}
export default FormInput
