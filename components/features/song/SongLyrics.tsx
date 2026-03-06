'use client'

import {
  LyricSection as LyricSectionType,
  LyricSectionTypeEnum,
  Song,
} from '@/types'
import { capitalize } from '@/lib/utils'
import { useUpdateSongLyrics } from '@/atoms'
import { useAtom } from 'jotai'
import { useSongPageAtoms } from '@/atoms/providers/song-page.provider'
import { Button } from '@/components/ui'
import { EditableSelect } from '@/components/shared/EditableSelect'
import { LyricSection } from './LyricSection'
import { v4 as uuid } from 'uuid'
import { Trash2 } from 'lucide-react'

interface Props {
  songId: Song['id']
  items: LyricSectionType[]
}

const SECTION_TYPES = LyricSectionTypeEnum.options

export const SongLyrics = ({ songId, items }: Props) => {
  // ✅ Get atoms from provider (no props needed)
  const atoms = useSongPageAtoms()
  const [hubId] = useAtom(atoms.pageHubIdAtom)
  const [hubColor] = useAtom(atoms.pageHubColorAtom)

  const updateSongLyrics = useUpdateSongLyrics()

  function handleAddSection() {
    const newSection: LyricSectionType = {
      id: uuid(),
      songId: songId,
      content: '',
      order: Math.max(...items.map((s) => s.order), 0) + 1,
      type: 'VERSO',
    }
    updateSongLyrics(hubId, songId, [...items, newSection])
  }

  function handleUpdateSection(id: string, updates: Partial<LyricSectionType>) {
    const updated = items.map((s) => (s.id === id ? { ...s, ...updates } : s))
    updateSongLyrics(hubId, songId, updated)
  }

  function handleDeleteSection(id: string) {
    const updated = items.filter((s) => s.id !== id)
    updateSongLyrics(hubId, songId, updated)
  }

  const sortedItems = [...items].sort((a, b) => a.order - b.order)

  if (!items.length) {
    return (
      <section className="flex flex-col gap-4">
        <Button onClick={handleAddSection} className="w-fit" variant="outline">
          Agregar Sección
        </Button>
        <div className="text-foreground/40 italic">
          No hay letras agregadas aún
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-6">
      {sortedItems.length === 0 ? (
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleAddSection}
            className="w-fit"
            variant="outline"
          >
            + Agregar sección
          </Button>
          <div className="text-foreground/40 italic text-sm">
            No hay letras agregadas aún
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-0">
            {sortedItems.map((section) => (
              <div
                key={section.id}
                className="group flex gap-4 py-4 border-b border-border/30 last:border-b-0"
              >
                <div className="w-20 shrink-0">
                  <EditableSelect
                    displayClassName="text-xs text-nowrap font-semibold text-primary uppercase tracking-wider group-hover:text-primary"
                    value={section.type}
                    onChange={(newType) =>
                      handleUpdateSection(section.id, { type: newType })
                    }
                    options={SECTION_TYPES.map((t) => ({
                      value: t,
                      label: capitalize(t),
                    }))}
                    color={hubColor}
                  />
                </div>

                {/* Content: Center column (grows) */}
                <div className="flex-1">
                  <LyricSection
                    value={section.content}
                    onChange={(newContent) =>
                      handleUpdateSection(section.id, { content: newContent })
                    }
                    placeholder={`${capitalize(section.type).toLowerCase()}...`}
                  />
                </div>

                {/* Delete: Right column (hidden by default, visible on hover) */}
                <div className="w-6 flex items-start pt-0.5">
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="opacity-0 group-hover:opacity-100 text-foreground/40 hover:text-destructive transition-all duration-200"
                    title="Eliminar sección"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleAddSection}
            variant="ghost"
            className="w-fit text-foreground/60 hover:text-foreground"
          >
            + Agregar sección
          </Button>
        </>
      )}
    </section>
  )
}
