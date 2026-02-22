import { HubType } from '@/types'
import { HUB_COLORS, HUB_TYPE_ICONS } from './hub.constant'
import { LucideIcon } from 'lucide-react'

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
    icon: HUB_TYPE_ICONS.ALBUM,
  },
  EP: {
    label: 'EP',
    description: 'Proyecto de duración media.',
    icon: HUB_TYPE_ICONS.EP,
  },
  SINGLE: {
    label: 'Sencillo',
    description: 'Una sola canción.',
    icon: HUB_TYPE_ICONS.SINGLE,
  },
}

// Re-export for form usage
export const HUB_COLOR_VALUES = HUB_COLORS
