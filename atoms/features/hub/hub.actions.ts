'use client'

import { useAtom, useSetAtom } from 'jotai'
import { hubsAtom, activeHubIdAtom } from './hub.atoms'
import { Hub, createHubSchema } from '@/types'
import { v4 as uuid } from 'uuid'

/**
 * Hub Domain - Actions (mutations)
 * Each hook handles a specific mutation
 */

/**
 * Set the active hub (what the user is currently viewing)
 */
export const useSetActiveHubId = () => {
  const setActiveHubId = useSetAtom(activeHubIdAtom)

  return (id: string | null) => {
    setActiveHubId(id)
  }
}

/**
 * Create a new hub
 */
export const useCreateHub = () => {
  const [hubs, setHubs] = useAtom(hubsAtom)
  const setActiveHubId = useSetAtom(activeHubIdAtom)

  return (input: Partial<Hub>) => {
    const validated = createHubSchema.parse(input)

    const newHub: Hub = {
      id: uuid(),
      name: validated.name,
      description: validated.description,
      color: validated.color,
      type: validated.type,
      songs: [],
      createdAt: new Date().toISOString(),
    }

    setHubs([newHub, ...hubs])
    setActiveHubId(newHub.id)

    return newHub
  }
}

/**
 * Update hub metadata (name, color, description, type)
 */
export const useUpdateHubMeta = () => {
  const [, setHubs] = useAtom(hubsAtom)

  return (hubId: string, updates: Partial<Hub>) => {
    setHubs((prev) =>
      prev.map((h) => (h.id === hubId ? { ...h, ...updates } : h))
    )
  }
}

/**
 * Delete a hub (and deselect if it was active)
 */
export const useDeleteHub = () => {
  const [, setHubs] = useAtom(hubsAtom)
  const [activeHubId, setActiveHubId] = useAtom(activeHubIdAtom)

  return (id: string) => {
    setHubs((prev) => prev.filter((h) => h.id !== id))

    // If the deleted hub was active, deselect
    if (activeHubId === id) {
      setActiveHubId(null)
    }
  }
}
