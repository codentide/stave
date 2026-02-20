import { create } from 'zustand'
import {
  CreateProjectInput,
  CreateSongInput,
  LyricSection,
  Project,
  Song,
} from '@/types'
import { v4 as uuid } from 'uuid'

interface Actions {
  setActiveProjectId: (id: Project['id']) => void
  createProject: (input: CreateProjectInput) => void
  deleteProject: (id: Project['id']) => void

  setActiveSongId: (id: Song['id']) => void
  createSong: (projectId: Project['id'], input: CreateSongInput) => void
  deleteSong: (projectId: Project['id'], id: Song['id']) => void
  updateSongLyrics: (
    projectId: Project['id'],
    songId: Project['id'],
    sections: LyricSection[]
  ) => void
  updateSongMeta: (
    projectId: Project['id'],
    songId: Project['id'],
    updates: Partial<Song>
  ) => void
}

interface State {
  projects: Project[]
  activeProjectId: Project['id'] | null
  activeSongId: Song['id'] | null

  actions: Actions
}

const useStaveStore = create<State>((set, get) => ({
  projects: [],
  activeProjectId: null,
  activeSongId: null,

  actions: {
    setActiveProjectId: (id) => {
      set({ activeProjectId: id, activeSongId: null })
    },
    createProject: (input) => {
      const newProject: Project = {
        ...input,
        id: uuid(),
        songs: [],
        createdAt: new Date().toISOString(),
      }
      set((state) => ({
        projects: [newProject, ...state.projects],
        activeProjectId: newProject.id,
      }))
    },
    deleteProject: (id) => {
      const currentProjects = get().projects
      const newProjects = currentProjects.filter((p) => p.id !== id)

      set((state) => ({
        projects: newProjects,
        activeProjectId:
          state.activeProjectId === id ? null : state.activeProjectId,
        activeSongId: state.activeProjectId === id ? null : state.activeSongId,
      }))
    },

    setActiveSongId: (id) => set({ activeSongId: id }),
    createSong: (projectId, input) => {
      const newSong: Song = {
        ...input,
        id: uuid(),
        projectId,
        sections: [],
        references: [],
        createdAt: new Date().toISOString(),
      }
      const newProjects = get().projects.map((p) =>
        p.id === projectId ? { ...p, songs: [...p.songs, newSong] } : p
      )

      set({ projects: newProjects, activeSongId: newSong.id })
    },
    deleteSong: (projectId, songId) => {
      const newProjects = get().projects.map((p) =>
        p.id === projectId
          ? { ...p, songs: p.songs.filter((s) => s.id !== songId) }
          : p
      )

      set((state) => ({
        projects: newProjects,
        activeSongId: state.activeSongId === songId ? null : state.activeSongId,
      }))
    },
    // La edición de letras requiere una action propia por su complejidad
    updateSongLyrics: (projectId, songId, sections) => {
      const newProjects = get().projects.map((p) => {
        if (p.id !== projectId) return p
        return {
          ...p,
          songs: p.songs.map((s) => (s.id === songId ? { ...s, sections } : s)),
        }
      })

      set({ projects: newProjects })
    },
    updateSongMeta: (projectId, songId, updates) => {
      const newProjects = get().projects.map((p) => {
        if (p.id !== projectId) return p
        return {
          ...p,
          songs: p.songs.map((s) =>
            s.id === songId ? { ...s, ...updates } : s
          ),
        }
      })
      set({ projects: newProjects })
    },
  },
}))

export const useProjects = () => useStaveStore((s) => s.projects)
export const useActiveProjectId = () => useStaveStore((s) => s.activeProjectId)
export const useActiveSong = () => useStaveStore((s) => s.activeSongId)

export const useActiveProject = () => {
  return useStaveStore(
    (s) => s.projects.find((p) => p.id === s.activeProjectId) || null
  )
}

export const useStaveActions = () => useStaveStore((s) => s.actions)
