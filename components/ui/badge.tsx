import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        gray:
          "border-transparent bg-[#F7F7F8] text-[#3F3F50] hover:bg-[#F7F7F8]/80",
        purple:
          "border-transparent bg-[#F4F1FD] text-[#4316CA] hover:bg-[#F4F1FD]/80",
        green:
          "border-transparent bg-[#EEFBF4] text-[#17663A] hover:bg-[#EEFBF4]/80",
        blue:
          "border-transparent bg-[#F0FAFF] text-[#0075AD] hover:bg-[#F0FAFF]/80",
        orange:
          "border-transparent bg-[#FFF2EE] text-[#B82E00] hover:bg-[#FFF2EE]/80",
        yellow:
          "border-transparent bg-[#FFF9EB] text-[#8A6100] hover:bg-[#FFF9EB]/80",
        pink:
        "border-transparent bg-[#FEECFB] text-[#A5088C] hover:bg-[#FEECFB]/80",
        red:
          "border-transparent bg-[#FEF0F4] text-[#D50B3E] hover:bg-[#FEF0F4]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }