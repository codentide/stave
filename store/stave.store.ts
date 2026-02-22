import { create } from 'zustand'
import {
  createHubInput,
  CreateSongInput,
  LyricSection,
  Hub,
  Song,
} from '@/types'
import { v4 as uuid } from 'uuid'
import { persist } from 'zustand/middleware'

interface Actions {
  setActiveHubId: (id: State['activeHubId']) => void
  createHub: (input: createHubInput) => void
  deleteHub: (id: Hub['id']) => void
  updateHubMeta: (hubId: Hub['id'], updates: Partial<Hub>) => void

  setActiveSongId: (id: State['activeSongId']) => void
  createSong: (hubId: Hub['id'], input: CreateSongInput) => void
  deleteSong: (hubId: Hub['id'], id: Song['id']) => void
  updateSongLyrics: (
    hubId: Hub['id'],
    songId: Song['id'],
    sections: LyricSection[]
  ) => void
  updateSongMeta: (
    hubId: Hub['id'],
    songId: Song['id'],
    updates: Partial<Song>
  ) => void
}

interface State {
  hubs: Hub[]
  activeHubId: Hub['id'] | null
  activeSongId: Song['id'] | null

  actions: Actions
}

const useStaveStore = create<State>()(
  persist(
    (set, get) => ({
      hubs: [],
      activeHubId: null,
      activeSongId: null,

      actions: {
        setActiveHubId: (id) => {
          set({ activeHubId: id, activeSongId: null })
        },
        createHub: (input) => {
          const newHub: Hub = {
            ...input,
            name: input.name || 'Sin título',
            description: input.description || 'Sin descripción...',
            id: uuid(),
            songs: [],
            createdAt: new Date().toISOString(),
          }
          set((state) => ({
            hubs: [newHub, ...state.hubs],
            activeHubId: newHub.id,
          }))

          return newHub
        },
        deleteHub: (id) => {
          const currentHubs = get().hubs
          const newHubs = currentHubs.filter((h) => h.id !== id)

          set((state) => ({
            hubs: newHubs,
            activeHubId: state.activeHubId === id ? null : state.activeHubId,
            activeSongId: state.activeHubId === id ? null : state.activeSongId,
          }))
        },
        updateHubMeta: (hubId, updates) => {
          const newHubs = get().hubs.map((h) => {
            return h.id !== hubId ? h : { ...h, ...updates }
          })
          set({ hubs: newHubs })
        },

        setActiveSongId: (id) => set({ activeSongId: id }),
        createSong: (hubId, input) => {
          const newSong: Song = {
            ...input,
            id: uuid(),
            hubId,
            sections: [],
            references: [],
            createdAt: new Date().toISOString(),
          }
          const newHubs = get().hubs.map((p) =>
            p.id === hubId ? { ...p, songs: [...p.songs, newSong] } : p
          )

          set({ hubs: newHubs, activeSongId: newSong.id })
        },
        deleteSong: (hubId, songId) => {
          const newHubs = get().hubs.map((p) =>
            p.id === hubId
              ? { ...p, songs: p.songs.filter((s) => s.id !== songId) }
              : p
          )

          set((state) => ({
            hubs: newHubs,
            activeSongId:
              state.activeSongId === songId ? null : state.activeSongId,
          }))
        },
        // La edición de letras requiere una action propia por su complejidad
        updateSongLyrics: (hubId, songId, sections) => {
          const newHubs = get().hubs.map((p) => {
            if (p.id !== hubId) return p
            return {
              ...p,
              songs: p.songs.map((s) =>
                s.id === songId ? { ...s, sections } : s
              ),
            }
          })

          set({ hubs: newHubs })
        },
        updateSongMeta: (hubId, songId, updates) => {
          const newHubs = get().hubs.map((p) => {
            if (p.id !== hubId) return p
            return {
              ...p,
              songs: p.songs.map((s) =>
                s.id === songId ? { ...s, ...updates } : s
              ),
            }
          })
          set({ hubs: newHubs })
        },
      },
    }),
    {
      name: 'stave-storage',
      partialize: (state) => ({
        hubs: state.hubs,
      }),
    }
  )
)

export const useHubs = () => useStaveStore((s) => s.hubs)
export const useActiveHubId = () => useStaveStore((s) => s.activeHubId)
export const useActiveSong = () => useStaveStore((s) => s.activeSongId)

export const useActiveHub = () => {
  return useStaveStore(
    (s) => s.hubs.find((p) => p.id === s.activeHubId) || null
  )
}

export const useStaveActions = () => useStaveStore((s) => s.actions)
