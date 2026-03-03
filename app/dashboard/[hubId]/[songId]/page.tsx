'use client'

import { createSongPageAtoms, useHubs } from '@/atoms'
import { SongPageProvider } from '@/atoms/providers/song-page.provider'
import { SongHeader, SongLyrics } from '@/components/features/song'
import { SongAudio } from '@/components/features/audio'
import { createCustomStyles } from '@/lib/utils/ui.utils'
import { Hub, Song } from '@/types'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

interface Props {
  params: {
    hubId: Hub['id']
    songId: Song['id']
  }
}

export default function SongPage({}: Props) {
  const { hubId, songId } = useParams()
  const hubs = useHubs()

  const hub = hubs.find((h) => h.id === hubId)
  const song = hub?.songs.find((s) => s.id === songId)

  // Create scoped atoms for this page instance
  const atoms = useMemo(
    () => createSongPageAtoms(hub?.id, hub?.color, hub?.name),
    [hub?.id, hub?.color, hub?.name]
  )

  if (!hub || !song || !atoms) {
    return (
      <main className="flex flex-col gap-16 max-w-5xl w-full px-8 py-12 mx-auto overflow-y-auto custom-scrollbar">
        <div className="text-foreground/40">Canción no encontrada</div>
      </main>
    )
  }

  return (
    <SongPageProvider atoms={atoms}>
      <main
        className="flex flex-col gap-16 max-w-5xl w-full px-8 py-12 mx-auto overflow-y-auto custom-scrollbar"
        style={createCustomStyles(hub?.color)}
      >
        <SongHeader content={song} />
        <SongAudio songId={song.id} items={song.tracks} />
        <SongLyrics songId={song.id} items={song.sections} />
      </main>
    </SongPageProvider>
  )
}
