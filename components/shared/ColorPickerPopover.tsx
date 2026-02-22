'use client'

import { HUB_COLORS } from '@/lib/constants/hub.constant'
import { cn } from '@/lib/utils'

interface Props {
  value?: string
  onChange?: (color: string) => void
}

export function ColorPickerPopover({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap max-w-xs p-3 bg-background/20 backdrop-blur-xl border border-border/50 rounded-sm">
      {HUB_COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onChange?.(color)}
          className={cn(
            'w-6 h-6 rounded-sm transition-all cursor-pointer',
            value === color && 'scale-125 shadow-lg ring-2 ring-primary'
          )}
          style={{ backgroundColor: color }}
          title={color}
          aria-label={`Seleccionar color ${color}`}
        />
      ))}
    </div>
  )
}
