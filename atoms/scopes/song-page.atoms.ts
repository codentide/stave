import { atom } from 'jotai'

/**
 * PAGE-SCOPED ATOMS - Song Page
 * Local state for SongPage component instances
 * Factory pattern: creates isolated atoms per page instance
 */

export interface SongPageAtoms {
  pageHubIdAtom: ReturnType<typeof atom<string>>
  pageHubColorAtom: ReturnType<typeof atom<string>>
  pageHubNameAtom: ReturnType<typeof atom<string>>
}

/**
 * Factory function to create isolated atoms for a SongPage instance
 * Each SongPage component gets its own set of atoms
 * Atoms are created with memoization in the page component
 */
export const createSongPageAtoms = (
  hubId?: string,
  hubColor?: string,
  hubName?: string
): SongPageAtoms | null => {
  if (!hubId || !hubColor || !hubName) return null

  return {
    pageHubIdAtom: atom<string>(hubId),
    pageHubColorAtom: atom<string>(hubColor),
    pageHubNameAtom: atom<string>(hubName),
  }
}
