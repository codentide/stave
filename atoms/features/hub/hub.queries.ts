import { atom } from 'jotai'
import { hubsAtom, activeHubIdAtom } from './hub.atoms'
import { Hub } from '@/types'

/**
 * Hub Domain - Derived atoms (computed values)
 * These are calculated from primitive atoms
 */

// Find the currently active hub from the hubs array
export const activeHubAtom = atom<Hub | null>((get) => {
  const hubs = get(hubsAtom)
  const activeHubId = get(activeHubIdAtom)
  return hubs.find((h) => h.id === activeHubId) || null
})

// Get songs from the active hub
export const activeSongsAtom = atom<Hub['songs']>((get) => {
  const activeHub = get(activeHubAtom)
  return activeHub?.songs || []
})

// Count of total hubs
export const hubCountAtom = atom<number>((get) => {
  return get(hubsAtom).length
})
