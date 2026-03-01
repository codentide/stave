'use client'

import { cn } from '@/lib/utils'

interface Props {
  value: string
  onRemove?: (value: string) => void
  className?: string
  variant?: 'default' | 'subtle'
}

export const SongTag = ({
  value,
  onRemove,
  className,
  variant = 'default',
}: Props) => {
  const variantClasses = {
    default: `bg-primary/10 text-primary ${onRemove ? 'hover:bg-primary/20' : 'pointer-events-none'}`,
    subtle: `bg-foreground/8 text-foreground/64 ${onRemove ? 'hover:bg-background/40' : 'pointer-events-none'}`,
  }

  const handleRemove = () => {
    onRemove?.(value)
  }

  return (
    <div
      className={cn(
        'flex w-fit items-center justify-center gap-1 rounded-sm font-medium whitespace-nowrap group/chip transition-all duration-200 h-6 text-xs px-2  ',
        variantClasses[variant],
        className
      )}
    >
      {value}
      {onRemove && (
        <button
          onClick={handleRemove}
          className="transition-opacity duration-200 p-0.5 hover:bg-destructive/20 cursor-pointer"
          aria-label={`Eliminar tag ${value}`}
          title={`Eliminar tag '${value}'`}
        >
          ×
        </button>
      )}
    </div>
  )
}
