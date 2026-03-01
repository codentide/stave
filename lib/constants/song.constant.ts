// Tonos musicales (keys)
export const SONG_KEYS = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
  'Cm',
  'C#m',
  'Dm',
  'D#m',
  'Em',
  'Fm',
  'F#m',
  'Gm',
  'G#m',
  'Am',
  'A#m',
  'Bm',
] as const

export type SongKey = (typeof SONG_KEYS)[number]

// Géneros musicales comunes
export const MUSIC_GENRES = [
  'Rock',
  'Pop Rock',
  'Pop',
  'Latin Pop',
  'Hip Hop',
  'Rap',
  'Trap',
  'Jersey Club',
  'Boom Bap',
  'Electronic',
  'House',
  'Drum & Bass',
  'Jazz',
  'Blues',
  'Rhythm & Blues',
  'Soul',
  'Classical',
  'Acoustic',
  'Country',
  'Reggae',
  'Reggaetón',
  'Dancehall',
  'Salsa',
  'Bachata',
  'Merengue',
  'Metal',
  'Afrobeat',
  'Cumbia',
  'Bossa Nova',
  'Flamenco',
  'Tango',
  'Experimental',
] as const

// Sentimientos y emociones comunes en música
export const MUSIC_EMOTIONS = [
  'Feliz',
  'Romántico',
  'Relajado',
  'Inspirador',
  'Triste',
  'Enojo',
  'Ansiedad',
  'Reflexión',
] as const

// Temas y conceptos principales
export const MUSIC_THEMES = [
  'Amor',
  'Ruptura',
  'Amistad',
  'Futuro',
  'Recuerdos',
  'Sueños',
  'Espiritualidad',
  'Identidad',
  'Crecimiento',
  'Pérdida',
  'Esperanza',
  'Libertad',
  'Celebración',
  'Lucha',
  'Triunfo',
] as const

// Combinación de todas las sugerencias
export const ALL_TAG_SUGGESTIONS = [
  ...MUSIC_GENRES,
  ...MUSIC_EMOTIONS,
  ...MUSIC_THEMES,
] as const

export type TagSuggestion = (typeof ALL_TAG_SUGGESTIONS)[number]

export const MAX_TITLE_LENGTH = 100
export const MAX_SONG_TAGS = 3
