'use client'

import { ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LucideIcon, MoreHorizontal } from 'lucide-react'
import { cn, createCustomStyles } from '@/lib/utils'

export interface ActionMenuItem {
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: 'default' | 'destructive'
}

interface Props {
  actions: ActionMenuItem[]
  children?: ReactNode
  triggerClassName?: string
  contentClassName?: string
  color?: string
}

export function ActionMenu({
  actions,
  children,
  triggerClassName,
  contentClassName,
  color,
}: Props) {
  const customStyles = color ? createCustomStyles(color) : undefined

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'h-6 w-6 text-foreground/80 hover:text-primary transition-colors focus:ring-primary/40!',
        triggerClassName
      )}
    >
      <MoreHorizontal size={16} />
      <span className="sr-only">Menú de acciones</span>
    </Button>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          'bg-background/20 backdrop-blur-xl border-border/50 rounded-sm',
          contentClassName
        )}
        style={customStyles}
      >
        {actions.map((action, index) => {
          const Icon = action.icon
          const isDestructive = action.variant === 'destructive'

          return (
            <DropdownMenuItem
              key={index}
              onClick={action.onClick}
              className={cn(
                'cursor-pointer transition-colors rounded-[3px] text-xs py-1.5 px-2',
                isDestructive
                  ? 'focus:bg-red-500/10 focus:text-red-400'
                  : 'focus:bg-primary/10 focus:text-primary'
              )}
              style={customStyles}
            >
              <div className="flex items-center gap-2">
                {Icon && (
                  <Icon size={18} className="group-hover:text-primary" />
                )}
                <span>{action.label}</span>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
