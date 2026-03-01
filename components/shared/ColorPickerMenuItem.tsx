'use client'

import { DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui'
import { HUB_COLORS } from '@/lib/constants/hub.constant'
import { cn } from '@/lib/utils'

interface Props {
  value?: string
  onChange?: (color: string) => void
  label?: string
}

export function ColorPickerMenuItem({ value, onChange, label = 'Cambiar color' }: Props) {
  return (
    <>
      <DropdownMenuLabel className="text-xs py-1.5">{label}</DropdownMenuLabel>
      <div className="flex gap-2 flex-wrap px-2 py-2">
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
      <DropdownMenuSeparator />
    </>
  )
}
