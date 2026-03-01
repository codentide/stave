import React from 'react'
import { capitalize, cn } from '@/lib/utils'
import { Song } from '@/types'
import { ChevronRight, Music2 } from 'lucide-react'
import Link from 'next/link'
import { SongTag } from './SongTag'

interface Props {
  content: Song
}

export const SongCard = React.memo(({ content }: Props) => {
  return (
    <Link href={`${content.hubId}/${content.id}`}>
      <article
        className={cn(
          'group relative w-full h-18 border rounded-lg pr-3 overflow-hidden',
          'bg-foreground/2 border-foreground/8',
          'dark:bg-foreground/2 dark:border-foreground/2',
          'hover:bg-background hover:border-foreground/9 dark:hover:border-foreground/8 dark:hover:bg-foreground/3',
          'transition-all duration-300 cursor-pointer overflow-hidden'
        )}
      >
        <div className="flex items-center justify-between gap-4 h-full">
          <SongIcon coverUrl={content.coverUrl} />
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="min-w-0 flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-foreground/64 tracking-tight leading-tight truncate">
                {content.title}
              </h3>

              <SongMetadata song={content} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SongTags tags={content.tags} />

            <div
              className="flex items-center justify-center w-8 h-8 rounded-full text-foreground/40 group-hover:text-foreground transition-all"
              aria-hidden="true"
            >
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
})

SongCard.displayName = 'SongCard'

const SongMetadata = ({ song }: { song: Song }) => {
  const metadataItems = []

  if (song.status) {
    metadataItems.push({
      type: 'status',
      content: capitalize(song.status),
    })
  }

  if (song.key) {
    metadataItems.push({
      type: 'key',
      content: song.key,
    })
  }

  if (song.bpm) {
    metadataItems.push({
      type: 'bpm',
      content: `${song.bpm} BPM`,
    })
  }

  return (
    <div className="flex items-center gap-2">
      {metadataItems.map((item, index) => (
        <React.Fragment key={item.type}>
          {index > 0 && (
            <span className="text-xs text-foreground/16 font-bold">•</span>
          )}
          <span
            className={cn(
              'text-xs font-medium whitespace-nowrap text-foreground/36',
              item.type === 'key' && 'font-mono uppercase italic mt-px'
            )}
          >
            {item.content}
          </span>
        </React.Fragment>
      ))}
    </div>
  )
}

const SongTags = ({ tags }: { tags?: string[] }) => {
  if (!tags?.length) return null

  return (
    <div className="hidden md:flex items-center gap-2">
      {tags.map((tag, index) => (
        <SongTag key={index} value={tag} variant="subtle" />
      ))}
    </div>
  )
}

const SongIcon = ({ coverUrl }: { coverUrl?: string }) => {
  if (coverUrl) {
    return (
      <img
        src={coverUrl}
        alt="Song cover"
        className="aspect-square h-full shrink-0 object-cover"
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center w-12 h-12 rounded-lg border',
        'bg-foreground/8 border-foreground/4',
        'dark:bg-foreground/2 dark:border-foreground/4',
        'group-hover:bg-foreground/8',
        'transition-colors'
      )}
      aria-hidden="true"
    >
      <Music2
        size={18}
        className={cn(
          'text-zinc-400 dark:text-zinc-600',
          'group-hover:text-zinc-500 dark:group-hover:text-zinc-400',
          'transition-colors'
        )}
      />
    </div>
  )
}
