import * as React from "react"
import { Search, SendHorizonal } from "lucide-react" 
import { Keyboard } from '@geist-ui/core'
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

  const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
      return (
        <div className="relative flex items-center">
          <input
            type={type}
            className={cn(
              "flex h-[34px] w-full rounded-md border border-[#D9D9E3] px-3 py-2 text-sm ring-offset-background file:border-0 file:text-sm file:font-medium placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent",
              "focus:outline-none focus:ring-1 focus:ring-[#54B2BF] focus:border-[#54B2BF]",
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