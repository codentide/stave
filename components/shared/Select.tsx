import {
  Select as ShadSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn, createCustomStyles } from '@/lib/utils'

interface SelectOption<T = string> {
  value: T
  label: string
}

interface Props<T extends string | number = string> {
  selectLabel?: string
  options: SelectOption<T>[]
  value?: T
  onValueChange?: (value: T) => void
  placeholder?: string
  className?: string
  color?: string
}

export function Select<T extends string | number = string>({
  selectLabel,
  options,
  value,
  onValueChange,
  placeholder = 'Selecciona una opción',
  className = 'w-full max-w-48',
  color,
}: Props<T>) {
  const customStyles = color ? createCustomStyles(color) : undefined

  return (
    <ShadSelect
      value={value?.toString()}
      onValueChange={(val) => onValueChange?.(val as T)}
    >
      <SelectTrigger
        className={cn(
          'ring-0 border-border/40 focus:border-primary/50 rounded-sm text-xs px-2.5 py-1.5',
          'hover:border-foreground/40 transition-colors',
          className
        )}
        style={customStyles}
        showArrowOnHover
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        position="popper"
        className="bg-background/20 backdrop-blur-xl border-border/50 rounded-sm"
        style={customStyles}
      >
        <SelectGroup>
          {selectLabel && <SelectLabel>{selectLabel}</SelectLabel>}
          {options.map((option) => (
            <SelectItem
              key={option.value.toString()}
              value={option.value.toString()}
              className="hover:bg-primary/10 focus:bg-primary/20 focus:text-primary cursor-pointer transition-colors rounded-[3px] p-0 text-xs px-2 py-1.5"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </ShadSelect>
  )
}
