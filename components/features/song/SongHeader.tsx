'use client'

import { useDeleteSong, useUpdateSongMeta, useUpdateSongCover } from '@/atoms'
import { useSongPageAtoms } from '@/atoms/providers/song-page.provider'
import {
  ActionMenu,
  EditableSelect,
  EditableText,
  TagInput,
} from '@/components/shared'
import { PageBreadcrumb } from '@/components/shared/PageBreadcrumb'
import { Separator } from '@/components/ui'
import {
  MAX_SONG_TAGS,
  MAX_TITLE_LENGTH,
  SONG_KEYS,
} from '@/lib/constants/song.constant'
import { capitalize, cn } from '@/lib/utils'
import { Song, SongStatusTypeEnum } from '@/types'
import { useAtom } from 'jotai'
import { Download, ImagePlus, Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { SongTag } from './SongTag'

interface Props {
  content: Song
}

export const SongHeader = ({ content }: Props) => {
  const { id: songId, title, status, key, bpm, tags, coverUrl, sections } = content

  // ✅ Get atoms from provider (no props needed)
  const atoms = useSongPageAtoms()
  const [hubId] = useAtom(atoms.pageHubIdAtom)
  const [hubColor] = useAtom(atoms.pageHubColorAtom)
  const [hubName] = useAtom(atoms.pageHubNameAtom)

  const updateSongMeta = useUpdateSongMeta()
  const updateSongCover = useUpdateSongCover()
  const deleteSong = useDeleteSong()
  const router = useRouter()
  const statusOptions = SongStatusTypeEnum.options.map((statusValue) => ({
    value: statusValue,
    label: capitalize(statusValue),
  }))

  const keyOptions = SONG_KEYS.map((k) => ({
    value: k,
    label: k,
  }))

  const handleAddTag = (tag: string) => {
    updateSongMeta(hubId, songId, {
      tags: [...tags, tag],
    })
  }

  const handleExportLyrics = () => {
    const lyricsText = sections
      .map((section) => `[${section.type}]\n${section.content}`)
      .join('\n\n')

    const blob = new Blob([lyricsText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title}-letra.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteSong = () => {
    deleteSong(hubId, songId)
    router.push(`/dashboard/${hubId}`)
  }

  const menuActions = [
    {
      label: 'Exportar Letra',
      icon: Download,
      onClick: handleExportLyrics,
      variant: 'default' as const,
    },
    {
      label: 'Borrar canción',
      icon: Trash2,
      onClick: handleDeleteSong,
      variant: 'destructive' as const,
    },
  ]

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: hubName, href: `/dashboard/${hubId}` },
    { label: title },
  ]

  return (
    <section className="flex flex-col gap-4">
      {/* Tools */}
      <div className="flex items-center justify-between mb-8">
        <PageBreadcrumb items={breadcrumbItems} />
        <ActionMenu actions={menuActions} color={hubColor} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <SongCover
            coverUrl={coverUrl}
            onUpload={(dataUrl) => updateSongCover(hubId, songId, dataUrl)}
            onRemove={() => updateSongCover(hubId, songId, undefined)}
            color={hubColor}
          />
          <div className="flex flex-col">
            {/* Status */}
            <EditableSelect
              value={status}
              options={statusOptions}
              onChange={(s) => updateSongMeta(hubId, songId, { status: s })}
              triggerClassName="mb-1 text-sm text-foreground/72"
              color={hubColor}
            />
            {/* Title */}
            <EditableText
              value={title}
              onChange={(newTitle) =>
                updateSongMeta(hubId, songId, { title: newTitle })
              }
              maxLength={MAX_TITLE_LENGTH}
              multiline={false}
              className="w-fit text-xl font-bold leading-none font-serif italic tracking-wider"
            />

            <div className="flex items-center gap-2 text-foreground/32">
              <span className="flex items-baseline gap-1">
                {/* BPM */}
                <EditableText
                  id="bpm-text"
                  value={String(bpm)}
                  onChange={(newBpm) =>
                    updateSongMeta(hubId, songId, { bpm: Number(newBpm) })
                  }
                  type="number"
                  className="w-fit text-xs! font-light leading-[1.6] no-number-arrows underline-offset-4"
                />
                <label
                  htmlFor="bpm-text"
                  className="text-xs font-light leading-[1.6] cursor-text"
                >
                  BPM
                </label>
              </span>
              <span className="text-xs text-foreground/16 font-bold">•</span>
              <EditableSelect
                value={key}
                options={keyOptions}
                onChange={(newKey) =>
                  updateSongMeta(hubId, songId, { key: newKey })
                }
                displayClassName="italic"
                color={hubColor}
              />
            </div>

            <div className="flex items-center gap-2 justify-start mt-auto">
              {tags.map((t) => (
                <SongTag
                  key={t}
                  value={t}
                  onRemove={(tagToRemove) =>
                    updateSongMeta(hubId, songId, {
                      tags: tags.filter((t) => t !== tagToRemove),
                    })
                  }
                />
              ))}

              <TagInput
                onAdd={handleAddTag}
                maxTags={MAX_SONG_TAGS}
                existingTags={tags}
                color={hubColor}
              />
            </div>
          </div>
        </div>
      </div>
      <Separator className="opacity-36" />
    </section>
  )
}

interface SongCoverProps {
  coverUrl?: string
  onUpload: (dataUrl: string) => void
  onRemove: () => void
  color?: string
}

const SongCover = ({ coverUrl, onUpload, onRemove, color }: SongCoverProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      onUpload(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    }
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        'group relative shrink-0 grid place-items-center w-28 h-28 rounded-lg border',
        'bg-foreground/8 border-foreground/4',
        'dark:bg-foreground/2 dark:border-foreground/4',
        'hover:bg-foreground/8 dark:hover:bg-primary/4',
        'transition-colors cursor-pointer overflow-hidden',
        coverUrl && 'border-primary/30 bg-primary/5'
      )}
      style={
        color && coverUrl
          ? { borderColor: `${color}33`, backgroundColor: `${color}08` }
          : undefined
      }
      onClick={() => inputRef.current?.click()}
    >
      {coverUrl ? (
        <>
          <img
            src={coverUrl}
            alt="Song cover"
            className="w-full h-full object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="absolute top-0.5 right-0.5 p-0.5 rounded-sm bg-background/50 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-md transform duration-200"
            title="Remover imagen"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </>
      ) : (
        <ImagePlus
          className={cn(
            'w-5 h-5 text-zinc-400 dark:text-zinc-600',
            'group-hover:text-primary/24 dark:group-hover:text-primary/80',
            'transition-colors'
          )}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Cargar imagen de portada"
      />
    </div>
  )
}
