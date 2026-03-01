'use client'

import { atom } from 'jotai'
import { useAtom, useSetAtom } from 'jotai'

/**
 * Create Hub Modal - Atoms for modal state
 * Controls open/close state of the create hub modal dialog
 */

export const createModalIsOpen = atom<boolean>(false)

export const useCreateModalIsOpen = () => {
  const [isOpen] = useAtom(createModalIsOpen)
  return isOpen
}

export const useCreateModalActions = () => {
  const setIsOpen = useSetAtom(createModalIsOpen)

  return {
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}
