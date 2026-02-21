import React from 'react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { HUBTYPE_FIELD_VALUES } from '@/lib/constants/form.constant'
import { HubTypeEnum } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  id?: string
  'aria-labelledby'?: string
  value?: string
  onChange?: (value: string) => void
}

export const HubTypeField = React.memo(({
  id = 'hub-type',
  'aria-labelledby': ariaLabelledBy,
  value,
  onChange,
}: Props) => {
  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : HubTypeEnum.enum.ALBUM

  return (
    <RadioGroup
      value={selectedValue}
      defaultValue={isControlled ? undefined : HubTypeEnum.enum.ALBUM}
      onValueChange={onChange}
      className="w-full p-0"
      id={id}
      name={id}
      aria-labelledby={ariaLabelledBy}
    >
      <FieldGroup className="flex gap-2">
        {HubTypeEnum.options.map((type) => {
          const config = HUBTYPE_FIELD_VALUES[type]
          const Icon = config.icon
          const itemId = `${id}-${type}`
          return (
            <FieldLabel
              htmlFor={itemId}
              key={type}
              className={cn(
                'cursor-pointer transition-colors',
                'has-data-[state=checked]:bg-(--hub-selected-color)/5',
                'has-data-[state=checked]:border-(--hub-selected-color)/32'
              )}
            >
              <Field>
                <FieldContent className="flex flex-row items-center gap-3 p-3">
                  <div
                    className={`p-2.5 rounded-sm bg-accent/50 
                      group-has-data-[state=checked]/field-label:text-(--hub-selected-color)
                      group-has-data-[state=checked]/field-label:bg-(--hub-selected-color)/10
                      transition-colors
                    `}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex flex-col">
                    <FieldTitle className="text-sm">{config.label}</FieldTitle>
                    <FieldDescription className="text-xs text-foreground/50">
                      {config.description}
                    </FieldDescription>
                  </div>
                </FieldContent>
                <RadioGroupItem value={type} id={itemId} className="sr-only" />
              </Field>
            </FieldLabel>
          )
        })}
      </FieldGroup>
    </RadioGroup>
  )
})
HubTypeField.displayName = 'HubTypeField'
