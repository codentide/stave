import * as React from 'react'

import { cn } from '@/lib/utils/index'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50 file:text-foreground file:border-0 file:bg-transparent file:font-medium',
        className
      )}
      {...props}
    />
  )
}

export { Input }
