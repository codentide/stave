import { z } from 'zod'

// Enums
export const HubTypeEnum = z.enum(['ALBUM', 'EP', 'SINGLE'])
export const LyricSectionTypeEnum = z.enum([
  'INTRO',
  'VERSO',
  'CORO',
  'PRE-CORO',
  'PUENTE',
  'OUTRO',
])
export const SongStatusTypeEnum = z.enum([
  'IDEA',
  'DRAFT',
  'IN PROGRESS',
  'REVISION',
  'ENDED',
])
export const TrackTypeEnum = z.enum(['YOUTUBE', 'FILE'])

// Utils
const idSchema = z.uuid('ID inválido')
const dateSchema = z.iso.datetime().optional()
const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

// Schemas
export const lyricSectionSchema = z.object({
  id: idSchema,
  songId: idSchema.optional(),
  type: LyricSectionTypeEnum.default('VERSO'),
  content: z.string().default(''),
  order: z.number().int(),
})

export const trackSchema = z.object({
  id: idSchema,
  songId: idSchema.optional(),
  type: TrackTypeEnum,
  // url: z.url('URL de referencia inválida'),
  url: z.string().min(1, 'La ruta de la referencia es obligatoria'),
  name: z.string().min(1, 'El nombre de la referencia es obligatorio'),
})

// Big Schemas
export const songSchema = z.object({
  id: idSchema,
  hubId: idSchema.optional(),
  title: z.string().default('Nueva Canción'),
  status: SongStatusTypeEnum.default('DRAFT'),
  bpm: z.number().int().min(20).max(300).default(120),
  key: z.string().max(10).default('C'),
  tags: z.array(z.string()).default([]),
  sections: z.array(lyricSectionSchema).default([]),
  tracks: z.array(trackSchema).default([]),
  coverUrl: z.string().optional(),
  createdAt: dateSchema,
})

export const hubSchemaBase = z.object({
  id: idSchema,
  userId: z.string().optional(),
  name: z.string().default('Nuevo Proyecto'),
  description: z.string().default('Sin descripción'),
  type: HubTypeEnum.default('ALBUM'),
  // coverUrl: z.string().url().optional().or(z.literal('')),
  color: z.string().regex(hexRegex, 'Hex inválido').default('#d9933f'),
  songs: z.array(songSchema).default([]),
  createdAt: dateSchema,
})

export const hubSchema = hubSchemaBase.refine(
  ({ type, songs }) => {
    if (type === 'SINGLE' && songs.length > 1) return false
    return true
  },
  {
    message: 'Un proyecto de tipo SINGLE solo puede contener una canción',
    path: ['songs'],
  }
)

// Inferences
export type HubType = z.infer<typeof HubTypeEnum>
export type LyricSectionType = z.infer<typeof LyricSectionTypeEnum>
export type TrackType = z.infer<typeof TrackTypeEnum>

export type LyricSection = z.infer<typeof lyricSectionSchema>
export type Track = z.infer<typeof trackSchema>
export type Song = z.infer<typeof songSchema>
export type Hub = z.infer<typeof hubSchema>

// Contracts
export const createHubSchema = hubSchemaBase.omit({
  id: true,
  songs: true,
  createdAt: true,
})

export const createSongSchema = songSchema.omit({
  id: true,
  hubId: true,
  sections: true,
  tracks: true,
  createdAt: true,
})

export type createHubInput = z.infer<typeof createHubSchema>
export type CreateSongInput = z.infer<typeof createSongSchema>
