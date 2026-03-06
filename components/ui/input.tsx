import * as React from 'react'

import { cn } from '@/lib/utils/index'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'placeholder:text-foreground/20 bg-foreground/4 px-3 py-1.5 border border-foreground/4 rounded-sm selection:bg-primary selection:text-primary-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50 file:text-foreground file:border-0 file:bg-transparent file:font-medium',
        className
      )}
      {...props}
    />
  )
}

export { Input }
