import { create } from 'zustand'

interface Actions {
  open: () => void
  close: () => void
}

interface State {
  isOpen: boolean
  actions: Actions
}

const useCreateModalStore = create<State>((set) => ({
  isOpen: false,
  actions: {
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  },
}))

export const useCreateModalIsOpen = () => useCreateModalStore((s) => s.isOpen)
export const useCreateModalActions = () => useCreateModalStore((s) => s.actions)
