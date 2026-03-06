'use client'

import { Track } from '@/types'
import { Button, Input } from '@/components/ui'
import { Download, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  onAdd: (track: Omit<Track, 'id' | 'songId'>) => void
}

const isValidYouTubeUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname
    return (
      hostname === 'youtube.com' ||
      hostname === 'www.youtube.com' ||
      hostname === 'youtu.be' ||
      hostname === 'www.youtu.be'
    )
  } catch {
    return false
  }
}

const fetchYouTubeTitle = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    )
    if (!response.ok) return null
    const data = await response.json()
    return data.title || null
  } catch {
    return null
  }
}

export const AddTrackForm = ({ onAdd }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!url.trim()) {
      setError('Ingresa una URL válida')
      return
    }

    if (!isValidYouTubeUrl(url)) {
      setError('URL de YouTube inválida')
      return
    }

    setIsLoading(true)

    const title = await fetchYouTubeTitle(url)

    if (!title) {
      setError('No se pudo obtener el título del video, intenta con otro')
      setIsLoading(false)
      return
    }

    onAdd({ type: 'YOUTUBE', url, name: title })

    setUrl('')
    setIsOpen(false)
    setIsLoading(false)
  }

  const handleCancel = () => {
    setUrl('')
    setError(null)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <div
        className={cn(
          'flex items-center justify-center gap-3 p-4',
          'border border-dashed border-border/30 rounded-lg',
          'hover:bg-primary/5 hover:border-primary/25',
          'group transition-colors duration-200 cursor-pointer'
        )}
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(true)
          }
        }}
      >
        <div className="w-6 h-6 bg-background/30 rounded-full flex items-center justify-center border border-border/20 group-hover:bg-primary transition-colors duration-200">
          <Plus className="w-4 h-4 text-foreground/50 group-hover:text-background" />
        </div>
        <span className="text-sm font-light text-foreground/40 group-hover:text-primary">
          Agregar pista de audio
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5 px-3.5 pt-2.5 pb-3.5 rounded-lg border border-border/30 bg-background/40">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground/40">
          Pega una URL de YouTube
        </span>
        <Button
          type="button"
          variant="ghost"
          onClick={handleCancel}
          disabled={isLoading}
          size="sm"
          className="h-6 w-6 p-0 text-foreground/40"
        >
          <X size={13} />
        </Button>
      </div>

      {/* Input + submit */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex">
          <Input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            autoFocus
            className="flex-1 h-10 rounded-r-none border-r-0 text-sm placeholder:text-sm px-3 py-2"
          />
          <Button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="shrink-0 h-10 rounded-l-none rounded-r-sm px-3.5"
          >
            {isLoading ? 'Cargando...' : 'Agregar'}
          </Button>
        </div>
        {error && <p className="text-xs text-red-400/64">{error}</p>}
      </form>

      {/* Secondary action — disabled until file upload is supported */}
      <button
        type="button"
        disabled
        className="flex items-center gap-2 text-xs text-foreground/30 w-fit cursor-not-allowed mt-0.5"
      >
        <Download size={16} />
        Agregar archivo local
      </button>
    </div>
  )
}
