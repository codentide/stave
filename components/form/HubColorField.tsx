import React from 'react'
import { HUB_COLOR_VALUES } from '@/lib/constants/form.constant'
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from '../ui'

interface Props {
  id?: string
  'aria-labelledby'?: string
  value?: string
  onChange?: (value: string) => void
}

export const HubColorField = React.memo(({
  id = 'hub-color',
  'aria-labelledby': ariaLabelledBy,
  value,
  onChange,
}: Props) => {
  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : HUB_COLOR_VALUES[0]

  return (
    <RadioGroup
      id={id}
      name={id}
      aria-labelledby={ariaLabelledBy}
      value={selectedValue}
      defaultValue={isControlled ? undefined : HUB_COLOR_VALUES[0]}
      onValueChange={onChange}
      className="flex justify-between items-center gap-2 lg:gap-3"
    >
      {HUB_COLOR_VALUES.map((color) => {
        const itemId = `${id}-${color}`

        return (
          <div key={color} className="relative flex-1 flex justify-center">
            <RadioGroupItem
              value={color}
              id={itemId}
              aria-label={`Seleccionar color ${color}`}
              className={cn(
                'w-full h-8 rounded-sm transition-all duration-300',
                'flex items-center justify-center border-none',
                'data-[state=checked]:shadow-[0_0_20px_var(--selected-color)]',
                'data-[state=checked]:scale-110',
                'opacity-40 data-[state=checked]:opacity-100',
                '[&>span]:hidden'
              )}
              style={
                {
                  '--selected-color': `${color}75`,
                  backgroundColor: color
                } as React.CSSProperties
              }
            />
          </div>
        )
      })}
    </RadioGroup>
  )
})
HubColorField.displayName = 'HubColorField'
