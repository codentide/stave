'use client'

import { ReactNode, createContext, useContext } from 'react'
import { SongPageAtoms } from '@/atoms/scopes/song-page.atoms'

/**
 * SongPageProvider - Scope provider for SongPage atoms
 *
 * Provides isolated atom state for a SongPage instance
 * without needing to pass atoms as props to children.
 *
 * Uses React Context to make atoms accessible to all child components
 * without prop drilling.
 *
 * Usage:
 * <SongPageProvider atoms={atoms}>
 *   <SongHeader content={song} />
 *   <SongLyrics songId={song.id} items={items} />
 * </SongPageProvider>
 */

interface SongPageContextType {
  atoms: SongPageAtoms
}

const SongPageContext = createContext<SongPageContextType | null>(null)

/**
 * Hook to access SongPage atoms from any child component
 * Must be used inside SongPageProvider
 */
export const useSongPageAtoms = () => {
  const context = useContext(SongPageContext)
  if (!context) {
    throw new Error('useSongPageAtoms must be used inside SongPageProvider')
  }
  return context.atoms
}

interface Props {
  atoms: SongPageAtoms
  children: ReactNode
}

/**
 * Provider that scopes atoms to SongPage subtree
 * Components can access atoms via useSongPageAtoms() hook
 */
export const SongPageProvider = ({ atoms, children }: Props) => {
  return (
    <SongPageContext.Provider value={{ atoms }}>
      {children}
    </SongPageContext.Provider>
  )
}
