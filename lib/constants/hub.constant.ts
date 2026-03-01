import { HubType } from '@/types'
import { Disc, Layers, LucideIcon, Music } from 'lucide-react'

// Hub domain constants
export const HUB_TYPE_ICONS: Record<HubType, LucideIcon> = {
  ALBUM: Layers,
  EP: Disc,
  SINGLE: Music,
}

export const HUB_COLORS = [
  '#d9933f', // Naranja Bronze
  '#e11d48', // Crimson
  '#7c3aed', // Royal Violet
  '#2563eb', // Deep Blue
  '#0ea5e9', // Sky Blue
  '#8bcb00', // Emerald
  'var(--foreground)', // Dynamic foreground (adapts to theme)
  '#dc64a3', // Pink
]
