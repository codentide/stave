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
  debounceTime?: number
}

export const EditableText = ({
  value,
  onChange,
  multiline = false,
  rows = 2,
  className = '',
  maxLength = 255,
  placeholder = '',
  debounceTime = 600,
  ...props
}: Props) => {
  const [text, setText] = useState(value)
  const debText = useDebounce(text, debounceTime)

  useEffect(() => {
    setText(value)
  }, [value])

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
        'w-full h-fit p-0 bg-transparent border-none rounded-none',
        'resize-none field-sizing-content',
        'hover:underline focus:underline underline-offset-5 decoration-1 decoration-foreground/50',
        className
      )}
      {...props}
    />
  )
}
