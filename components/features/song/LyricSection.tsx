'use client'

import { Textarea } from '@/components/ui'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  debounceTime?: number
}

/**
 * LyricSection - Editor for individual lyric section content
 * - Supports multiline content (Enter creates new lines)
 * - Minimum 4 lines height
 * - Auto-expands with content
 * - Debounced saves (600ms default)
 */
export const LyricSection = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  debounceTime = 600,
}: Props) => {
  const [text, setText] = useState(value)
  const debouncedText = useDebounce(text, debounceTime)

  useEffect(() => {
    setText(value)
  }, [value])

  useEffect(() => {
    if (debouncedText !== value) {
      onChange(debouncedText)
    }
  }, [debouncedText, value, onChange])

  const lineCount = text.split('\n').length
  const minLines = 4
  const rows = Math.max(lineCount, minLines)

  return (
    <Textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        'w-full resize-none',
        'bg-transparent border-none rounded-none p-0',
        'text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap',
        'placeholder:text-foreground/40 placeholder:italic',
        'focus:outline-none focus:ring-0',
        'focus:border-b border-b border-foreground/20 transition-colors',
        className
      )}
    />
  )
}
