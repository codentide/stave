'use client'

import { cn } from '@/lib/utils'
import { Track } from '@/types'
import { Music, Trash2 } from 'lucide-react'

interface Props {
  track: Track
  isActive: boolean
  onClick: () => void
  onRemove: () => void
}

export const TrackCard = ({ track, isActive, onClick, onRemove }: Props) => {
  return (
    <div
      className={cn(
        'group w-full flex items-center gap-3 py-2 px-2.5 rounded-md border transition-all cursor-pointer',
        isActive
          ? 'border-primary/24 bg-primary/10'
          : 'border-foreground/4 bg-foreground/2 hover:border-foreground/16 hover:bg-foreground/4'
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div
        className={cn(
          'shrink-0 transition-colors',
          isActive ? 'text-primary' : 'text-foreground/40 group-hover:text-foreground/80'
        )}
      >
        <Music size={18} />
      </div>

      <div className="flex items-center justify-between gap-8 flex-1 min-w-0">
        <div className={cn('text-[13.2px] truncate', isActive ? 'text-foreground/80' : 'text-foreground/40')}>
          {track.name}
        </div>
        <div className={cn('text-xs', isActive ? 'text-primary' : 'text-foreground/64')}>
          {track.type}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="shrink-0 opacity-0 group-hover:opacity-100 text-foreground/40 hover:text-destructive transition-all duration-200"
        title="Eliminar pista"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
