'use client'

import { Reference } from '@/types'
import { ExternalLink, FileVideo, File } from 'lucide-react'

interface Props {
  references: Reference[]
}

export const SongReferences = ({ references }: Props) => {
  if (!references.length) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground/80">Referencias</h2>
        <div className="text-foreground/40 italic">
          No hay referencias agregadas aún
        </div>
      </section>
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'YOUTUBE':
        return <FileVideo className="w-4 h-4" />
      case 'FILE':
        return <File className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground/80">Referencias</h2>
      
      <div className="flex flex-col gap-3">
        {references.map((reference) => (
          <a
            key={reference.id}
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg border border-foreground/8 hover:border-foreground/16 hover:bg-foreground/2 transition-all group"
          >
            <div className="text-foreground/60 group-hover:text-foreground/80 transition-colors">
              {getIcon(reference.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground/80 truncate">
                {reference.name}
              </div>
              <div className="text-xs text-foreground/40 truncate">
                {reference.url}
              </div>
            </div>
            <ExternalLink className="w-3 h-3 text-foreground/40" />
          </a>
        ))}
      </div>
    </section>
  )
}
