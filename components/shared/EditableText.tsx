'use client'

import { Input, Textarea } from '@/components/ui'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { ComponentProps } from 'react'

type BaseProps = ComponentProps<'input'> & ComponentProps<'textarea'>

interface Props extends Omit<BaseProps, 'onChange' | 'value' | 'rows'> {
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  rows?: number
}

export const EditableText = ({ 
  value, 
  onChange, 
  multiline = false,
  rows = 2,
  className = "",
  maxLength = 255,
  placeholder = "",
  ...props
}: Props) => {
  const [text, setText] = useState(value)
  const debText = useDebounce(text, 600)

  useEffect(() => {
    if (debText !== value) {
      onChange(debText)
    }
  }, [debText, value, onChange])

  const Component = multiline ? Textarea : Input

  return (
    <Component
      value={text}
      onChange={(e) => setText(e.target.value)}
      maxLength={maxLength}
      rows={multiline ? rows : undefined}
      placeholder={placeholder}
      className={cn(
        'w-full h-fit p-0! bg-transparent! border-none shadow-none rounded-none! resize-none! min-h-0! field-sizing-content! focus:outline-0! focus:border-0! focus:ring-0!',
        className
      )}
      {...props}
    />
  )
}
