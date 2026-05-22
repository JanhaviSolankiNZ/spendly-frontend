import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-lg border border-[#2d3748] bg-[#0f1117] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 transition-colors",
      "focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      className
    )}
    {...props}
  />
  )
}

export { Input }
