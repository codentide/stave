'use client'

import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from '@/components/ui'
import { HUB_COLORS } from '@/lib/constants/hub.constant'
import { cn, createCustomStyles } from '@/lib/utils'
import { Palette } from 'lucide-react'

interface Props {
  value?: string
  onChange?: (color: string) => void
  className?: string
}

export function ColorPickerPopoverButton({
  value,
  onChange,
  className,
}: Props) {
  const [open, setOpen] = useState(false)

  const handleSelectColor = (color: string) => {
    onChange?.(color)
    setOpen(false)
  }

  const customStyles = value ? createCustomStyles(value) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-6 w-6 text-foreground/80 hover:text-primary transition-colors',
            className
          )}
          title="Cambiar color"
        >
          <Palette size={16} />
          <span className="sr-only">Cambiar color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-fit p-3 bg-background/20 backdrop-blur-xl border-border/50 rounded-sm"
        style={customStyles}
      >
        <div className="flex gap-2 flex-wrap max-w-xs">
          {HUB_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleSelectColor(color)}
              className={cn(
                'w-6 h-6 rounded-sm transition-all cursor-pointer',
                value === color && 'scale-105 shadow-lg ring-2 ring-primary'
              )}
              style={{ backgroundColor: color }}
              title={color}
              aria-label={`Seleccionar color ${color}`}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
