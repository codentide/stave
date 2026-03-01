import * as React from "react"

import { cn } from "@/lib/utils/index"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-vertical',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
