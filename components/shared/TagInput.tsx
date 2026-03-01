'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { Input, Popover, PopoverAnchor, PopoverContent } from '@/components/ui'
import {
  ALL_TAG_SUGGESTIONS,
  TagSuggestion,
} from '@/lib/constants/song.constant'
import { cn, createCustomStyles } from '@/lib/utils'
import { Plus } from 'lucide-react'

interface Props {
  onAdd: (tag: string) => void
  existingTags: string[]
  maxTags?: number
  maxLength?: number
  placeholder?: string
  color?: string
}

export function TagInput({
  onAdd,
  existingTags,
  maxTags = 8,
  maxLength = 16,
  placeholder = 'Agregar tag...',
  color,
}: Props) {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const customStyles = color ? createCustomStyles(color) : undefined

  // Suggestions filtradas (excluyendo existingTags ya asignados)
  // Solo muestra cuando el usuario empieza a escribir
  const suggestions = useMemo(() => {
    if (!inputValue.trim()) return []
    const available = ALL_TAG_SUGGESTIONS.filter(
      (s) => !existingTags.includes(s)
    )
    return available.filter((s) =>
      s.toLowerCase().includes(inputValue.toLowerCase())
    )
  }, [inputValue, existingTags])

  // ¿El input es un tag completamente nuevo (no en ALL_TAG_SUGGESTIONS)?
  const isNewTag =
    inputValue.trim() !== '' &&
    !ALL_TAG_SUGGESTIONS.includes(inputValue.trim() as TagSuggestion) &&
    !existingTags.includes(inputValue.trim())

  // Validación centralizada
  const canAdd = useCallback(
    (tag: string) => {
      const trimmed = tag.trim()
      return (
        trimmed !== '' && // No vacío
        trimmed.length <= maxLength && // Dentro del límite de caracteres
        !existingTags.includes(trimmed) && // No duplicado
        existingTags.length < maxTags // Espacio disponible
      )
    },
    [existingTags, maxTags, maxLength]
  )

  // Agregar tag
  const handleAdd = useCallback(
    (tag: string) => {
      if (!canAdd(tag)) return
      onAdd(tag.trim())
      setInputValue('')
      setIsOpen(false)
    },
    [canAdd, onAdd]
  )

  // Total de opciones disponibles
  const totalOptions = suggestions.length + (isNewTag ? 1 : 0)

  // Keyboard handling con navegación por flechas
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        // Si hay opción resaltada, agregarla; sino agregar el inputValue
        if (highlightedIndex >= 0 && highlightedIndex < totalOptions) {
          const selectedTag =
            highlightedIndex === 0 && isNewTag
              ? inputValue
              : suggestions[highlightedIndex - (isNewTag ? 1 : 0)]
          handleAdd(selectedTag)
        } else {
          handleAdd(inputValue)
        }
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        setInputValue('')
        setHighlightedIndex(-1)
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const next = prev + 1
          return next >= totalOptions ? 0 : next
        })
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const next = prev - 1
          return next < 0 ? totalOptions - 1 : next
        })
      }
    },
    [
      inputValue,
      handleAdd,
      highlightedIndex,
      totalOptions,
      isNewTag,
      suggestions,
    ]
  )

  // Blur handling con delay para que el click en suggestion se procese primero
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsOpen(false)
      setInputValue('')
      setHighlightedIndex(-1)
    }, 150)
  }, [])

  // Reset highlighted cuando cambia el input value
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      setHighlightedIndex(-1)
    },
    []
  )

  // No renderizar si ya alcanzamos el máximo
  if (existingTags.length >= maxTags) return null

  // Estado cerrado: botón +
  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
        className="grid place-items-center p-1 text-xs text-foreground/64 hover:text-foreground transition-colors border border-dashed border-foreground/30 rounded-md hover:border-foreground/40"
        aria-label="Agregar tag"
      >
        <Plus size={12} />
      </button>
    )
  }

  // Estado abierto: Input + Popover
  // Solo muestra el dropdown si el usuario escribió algo y hay coincidencias
  const shouldShowDropdown =
    inputValue.trim() !== '' && (suggestions.length > 0 || isNewTag)

  return (
    <Popover open={isOpen && shouldShowDropdown}>
      <PopoverAnchor asChild>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus
          className="w-48 h-6 pb-2 px-2 pt-1.5 rounded-md text-xs text-foreground/64 placeholder:text-foreground/50 border border-dashed border-foreground/30 hover:border-foreground/40 focus:border-primary/50"
          style={customStyles}
        />
      </PopoverAnchor>
      <PopoverContent
        className={cn(
          'p-1 w-48 max-w-48',
          'bg-background/20 backdrop-blur-xl border-border/50 rounded-sm'
        )}
        style={customStyles}
        onOpenAutoFocus={(e) => e.preventDefault()}
        side="bottom"
        align="start"
        sideOffset={6}
      >
        {/* Opción: crear nuevo tag */}
        {isNewTag && (
          <button
            onMouseDown={() => handleAdd(inputValue)}
            className={cn(
              'w-full text-left px-2 py-1.5 text-xs transition-colors rounded-[3px] cursor-pointer',
              highlightedIndex === 0
                ? 'bg-primary/20 text-primary'
                : 'hover:bg-primary/10 hover:text-primary'
            )}
          >
            Crear nuevo tag &quot;{inputValue.trim()}&quot;
          </button>
        )}

        {/* Suggestions filtradas */}
        {suggestions.map((suggestion, index) => {
          const optionIndex = isNewTag ? index + 1 : index
          const isHighlighted = highlightedIndex === optionIndex
          return (
            <button
              key={suggestion}
              onMouseDown={() => handleAdd(suggestion)}
              className={cn(
                'w-full text-left px-2 py-1.5 text-xs transition-colors rounded-[3px] cursor-pointer',
                isHighlighted
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-primary/10 hover:text-primary'
              )}
            >
              {suggestion}
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
