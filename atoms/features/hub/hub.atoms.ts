import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Hub } from '@/types'

/**
 * Hub Domain - Primitive atoms
 * Persistent global state for hub management
 */

// The source of truth: all hubs in the app
export const hubsAtom = atomWithStorage<Hub[]>('stave-hubs', [])

// UI selection: which hub is currently active
export const activeHubIdAtom = atom<string | null>(null)
