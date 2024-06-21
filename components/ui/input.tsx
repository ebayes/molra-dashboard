import * as React from "react"
import { Search } from "lucide-react" 
import { Keyboard } from '@geist-ui/core'
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-[16px] w-[16px] text-gray-400" />
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-[#D9D9E3] pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:text-sm file:font-medium placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent", // Added bg-transparent
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }