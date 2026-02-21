import { Hub, HubType } from '@/types'
import { Disc, Layers, LucideIcon, Music } from 'lucide-react'

// Constant for FormComponente HubField
interface HubFieldConfig {
  label: string
  description: string
  icon: LucideIcon
}

export const HUBTYPE_FIELD_VALUES: Record<HubType, HubFieldConfig> = {
  ALBUM: {
    label: 'Álbum',
    description: 'Colección completa de canciones.',
    icon: Layers,
  },
  EP: {
    label: 'EP',
    description: 'Proyecto de duración media.',
    icon: Disc,
  },
  SINGLE: {
    label: 'Sencillo',
    description: 'Una sola canción.',
    icon: Music,
  },
}

// Constant for FormComponent HubColors
export const HUB_COLOR_VALUES: Hub['color'][] = [
  '#d9933f', // Naranja Bronze
  '#e11d48', // Crimson
  '#7c3aed', // Royal Violet
  '#2563eb', // Deep Blue
  '#0ea5e9', // Sky Blue
  '#8bcb00', // Emerald
  '#f4f4f5', // Snow White
  '#dc64a3', // Pink
]
