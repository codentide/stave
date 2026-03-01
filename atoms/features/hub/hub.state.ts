'use client'

import { useAtom } from 'jotai'
import { hubsAtom, activeHubIdAtom } from './hub.atoms'
import { activeHubAtom, activeSongsAtom, hubCountAtom } from './hub.queries'

/**
 * Hub Domain - State readers
 * Each hook returns a specific piece of hub state
 */

/**
 * Get all hubs
 */
export const useHubs = () => {
  const [hubs] = useAtom(hubsAtom)
  return hubs
}

/**
 * Get the currently active hub ID
 */
export const useActiveHubId = () => {
  const [activeHubId] = useAtom(activeHubIdAtom)
  return activeHubId
}

/**
 * Get the currently active hub (full object)
 */
export const useActiveHub = () => {
  const [activeHub] = useAtom(activeHubAtom)
  return activeHub
}

/**
 * Get songs from the active hub
 */
export const useActiveSongs = () => {
  const [activeSongs] = useAtom(activeSongsAtom)
  return activeSongs
}

/**
 * Get total count of hubs
 */
export const useHubCount = () => {
  const [count] = useAtom(hubCountAtom)
  return count
}
