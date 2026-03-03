'use client'

import { LyricSection, Song, Track, createSongSchema } from '@/types'
import { useSetAtom } from 'jotai'
import { v4 as uuid } from 'uuid'
import { hubsAtom } from '../hub'

/**
 * Song Domain - Actions (mutations)
 * Each hook handles a specific song mutation
 */

/**
 * Create a new song in a specific hub
 */
export const useCreateSong = () => {
  const setHubs = useSetAtom(hubsAtom)

  return (hubId: string, input: Partial<Song>) => {
    const validated = createSongSchema.parse(input)

    const newSong: Song = {
      id: uuid(),
      hubId,
      title: validated.title,
      status: validated.status,
      bpm: validated.bpm,
      key: validated.key,
      tags: validated.tags,
      sections: [],
      tracks: [],
      createdAt: new Date().toISOString(),
    }

    setHubs((prev) =>
      prev.map((h) =>
        h.id === hubId ? { ...h, songs: [...h.songs, newSong] } : h
      )
    )

    return newSong
  }
}

/**
 * Update song metadata (title, status, bpm, key, tags, etc)
 */
export const useUpdateSongMeta = () => {
  const setHubs = useSetAtom(hubsAtom)

  return (hubId: string, songId: string, updates: Partial<Song>) => {
    setHubs((prev) =>
      prev.map((h) => {
        if (h.id !== hubId) return h
        return {
          ...h,
          songs: h.songs.map((s) =>
            s.id === songId ? { ...s, ...updates } : s
          ),
        }
      })
    )
  }
}

/**
 * Update song lyrics (sections array)
 */
export const useUpdateSongLyrics = () => {
  const setHubs = useSetAtom(hubsAtom)

  return (hubId: string, songId: string, sections: LyricSection[]) => {
    setHubs((prev) =>
      prev.map((h) => {
        if (h.id !== hubId) return h
        return {
          ...h,
          songs: h.songs.map((s) => (s.id === songId ? { ...s, sections } : s)),
        }
      })
    )
  }
}

/**
 * Delete a song from a hub
 */
export const useDeleteSong = () => {
  const setHubs = useSetAtom(hubsAtom)

  return (hubId: string, songId: string) => {
    setHubs((prev) =>
      prev.map((h) => {
        if (h.id !== hubId) return h
        return {
          ...h,
          songs: h.songs.filter((s) => s.id !== songId),
        }
      })
    )
  }
}

/**
 * Update song cover image (Data URL)
 */
export const useUpdateSongCover = () => {
  const setHubs = useSetAtom(hubsAtom)

  return (hubId: string, songId: string, coverUrl: string | undefined) => {
    setHubs((prev) =>
      prev.map((h) => {
        if (h.id !== hubId) return h
        return {
          ...h,
          songs: h.songs.map((s) => (s.id === songId ? { ...s, coverUrl } : s)),
        }
      })
    )
  }
}

/**
 * Add a track to a song
 */
export const useAddSongTrack = () => {
  const setHubs = useSetAtom(hubsAtom)

  return (hubId: string, songId: string, track: Omit<Track, 'id' | 'songId'>) => {
    const newTrack: Track = {
      id: uuid(),
      songId,
      ...track,
    }

    setHubs((prev) =>
      prev.map((h) => {
        if (h.id !== hubId) return h
        return {
          ...h,
          songs: h.songs.map((s) =>
            s.id === songId
              ? {
                  ...s,
                  tracks: [...(s.tracks || []), newTrack],
                }
              : s
          ),
        }
      })
    )

    return newTrack
  }
}

/**
 * Remove a track from a song
 */
export const useRemoveSongTrack = () => {
  const setHubs = useSetAtom(hubsAtom)

  return (hubId: string, songId: string, trackId: string) => {
    setHubs((prev) =>
      prev.map((h) => {
        if (h.id !== hubId) return h
        return {
          ...h,
          songs: h.songs.map((s) =>
            s.id === songId
              ? {
                  ...s,
                  tracks: (s.tracks || []).filter((t) => t.id !== trackId),
                }
              : s
          ),
        }
      })
    )
  }
}
