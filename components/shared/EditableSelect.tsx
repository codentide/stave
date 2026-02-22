'use client'

import { useState, useCallback } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui'
import { cn, createCustomStyles } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectOption<T = string> {
  value: T
  label: string
}

interface Props<T extends string | number = string> {
  value?: T
  onChange?: (value: T) => void
  options: SelectOption<T>[]
  placeholder?: string
  color?: string
  displayClassName?: string
  triggerClassName?: string
  readonly?: boolean
}

export function EditableSelect<T extends string | number = string>({
  value,
  onChange,
  options,
  placeholder = 'Selecciona',
  color,
  displayClassName = '',
  triggerClassName = '',
  readonly = false,
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false)

  const customStyles = color ? createCustomStyles(color) : undefined
  const currentOption = options.find((opt) => opt.value === value)
  const displayLabel = currentOption?.label || placeholder

  const handleSelect = useCallback(
    (selectedValue: T) => {
      onChange?.(selectedValue)
      setIsOpen(false)
    },
    [onChange]
  )

  if (readonly) {
    return (
      <div className={cn('flex items-center gap-2 text-xs', displayClassName)}>
        {displayLabel}
      </div>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'group inline-flex items-center gap-1 text-xs transition-colors cursor-pointer',
            'bg-transparent border-0 rounded-sm p-0',
            'text-foreground/32 group-hover:text-foreground/80',
            'focus:outline-none',
            displayClassName,
            triggerClassName
          )}
          style={customStyles}
        >
          <span>{displayLabel}</span>
          <ChevronDown
            size={12}
            className={cn(
              'transition-transform opacity-0 duration-200',
              'group-hover:opacity-100',
              isOpen && 'opacity-100 rotate-180'
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          'p-1 w-fit min-w-48 max-h-60',
          'bg-background/20 backdrop-blur-xl border-border/50 rounded-sm',
          'overflow-y-auto'
        )}
        style={customStyles}
        onOpenAutoFocus={(e) => e.preventDefault()}
        side="bottom"
        align="start"
        sideOffset={6}
      >
        <div className="flex flex-col gap-0.5">
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value.toString()}
                onMouseDown={() => handleSelect(option.value)}
                className={cn(
                  'w-full text-left px-2 py-1.5 text-xs transition-colors rounded-[3px] cursor-pointer',
                  isSelected
                    ? 'bg-primary/20 text-primary font-medium'
                    : 'hover:bg-primary/10 hover:text-primary'
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
