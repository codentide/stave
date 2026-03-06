# Audio Player — Plan de Expansión a Audio Local

**Fecha:** 2026-03-03
**Estado actual:** YouTube únicamente (react-youtube + IFrame API)
**Próxima expansión:** Archivos locales subidos a Supabase Storage

---

## Arquitectura actual

```
SongAudio                    ← orquestador (estado, navegación, mutations)
├── YouTube                  ← player invisible off-screen (react-youtube)
├── AddTrackForm             ← formulario agregar URL
├── TrackCard[]              ← lista de pistas
└── AudioPlayer              ← controles UI (play/pause/seek/prev/next)
```

`AudioPlayer` es agnóstico a la fuente — solo recibe callbacks y no sabe si
reproduce YouTube o un archivo local. **No necesita cambios.**

---

## Expansión: audio local (FILE tracks)

### 1. Nuevo componente: `HtmlAudioEngine`

Equivalente a `YouTube` (el player invisible), pero usando el elemento `<audio>` nativo.

```tsx
// components/features/audio/HtmlAudioEngine.tsx

interface Props {
  url: string
  isPlaying: boolean
  onReady: (el: HTMLAudioElement) => void
  onPlay: () => void
  onPause: () => void
  onEnd: () => void
}

export const HtmlAudioEngine = ({ url, isPlaying, onReady, onPlay, onPause, onEnd }: Props) => {
  const ref = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (ref.current) onReady(ref.current)
  }, [])

  useEffect(() => {
    if (!ref.current) return
    if (isPlaying) { ref.current.play() } else { ref.current.pause() }
  }, [isPlaying])

  return (
    <audio
      ref={ref}
      src={url}
      onPlay={onPlay}
      onPause={onPause}
      onEnded={onEnd}
      style={{ display: 'none' }}
    />
  )
}
```

Diferencias clave con el player de YouTube:

| | YouTube (react-youtube) | Audio local (HtmlAudioEngine) |
|---|---|---|
| Control play/pause | `player.playVideo()` — async | `el.play()` — síncrono |
| Seek | `player.seekTo(t, true)` — async | `el.currentTime = t` — síncrono |
| Progress | polling `getCurrentTime()` cada 500ms | evento `onTimeUpdate` nativo |
| Duration | `getDuration()` — async | `el.duration` / `onDurationChange` |
| Ref type | `YouTubePlayer` | `HTMLAudioElement` |

### 2. Cambio en `SongAudio` — renderizado condicional por tipo

```tsx
// Solo cambia el bloque del player invisible, nada más

{activeTrack?.type === 'YOUTUBE' && activeVideoId && (
  <div style={{ position: 'absolute', left: '-9999px', width: '480px', height: '270px' }}>
    <YouTube
      key={activeVideoId}
      videoId={activeVideoId}
      opts={PLAYER_OPTS}
      onReady={handleYouTubeReady}
      onPlay={handlePlay}
      onPause={handlePause}
      onEnd={handleNext}
    />
  </div>
)}

{activeTrack?.type === 'FILE' && (
  <HtmlAudioEngine
    key={activeTrack.id}
    url={activeTrack.url}
    isPlaying={isPlaying}
    onReady={handleAudioReady}
    onPlay={handlePlay}
    onPause={handlePause}
    onEnd={handleNext}
  />
)}
```

El estado (`progress`, `duration`, `isPlaying`) y los controles (`AudioPlayer`)
no cambian. Solo el engine cambia según el tipo.

### 3. Cambios en `handleSeek` y el polling

```tsx
// El ref necesita ser un union type
const youtubeRef = useRef<YouTubePlayer | null>(null)
const audioRef = useRef<HTMLAudioElement | null>(null)

async function handleSeek(time: number) {
  setProgress(time)
  if (activeTrack?.type === 'YOUTUBE') {
    await youtubeRef.current?.seekTo(time, true)
  } else {
    if (audioRef.current) audioRef.current.currentTime = time
  }
}

// El polling de progress solo aplica a YouTube
// Los FILE tracks usan onTimeUpdate nativo → sin setInterval
useEffect(() => {
  if (!isPlaying || activeTrack?.type !== 'YOUTUBE') return
  const interval = setInterval(async () => {
    const t = await youtubeRef.current?.getCurrentTime()
    if (t !== undefined) setProgress(t)
  }, 500)
  return () => clearInterval(interval)
}, [isPlaying, activeTrack?.type])
```

### 4. `AddTrackForm` — habilitar subida de archivos

```tsx
// Cambio: de botón disabled a file input real
function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  if (!file) return

  // MVP local: crear object URL temporal (se pierde al recargar)
  // Post-Supabase: subir a storage y usar URL permanente
  const url = URL.createObjectURL(file)
  onAdd({ type: 'FILE', url, name: file.name })
}

<input type="file" accept="audio/*" onChange={handleFileChange} />
```

---

## Grabación (fase futura)

```tsx
// Usa MediaRecorder API — disponible en todos los browsers modernos

const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
const recorder = new MediaRecorder(stream)
const chunks: BlobPart[] = []

recorder.ondataavailable = (e) => chunks.push(e.data)
recorder.onstop = () => {
  const blob = new Blob(chunks, { type: 'audio/webm' })
  const url = URL.createObjectURL(blob)
  // → subir a Supabase Storage → guardar URL como track.url
}
```

Un componente `RecordingEngine` independiente manejaría esto.

---

## Resumen de lo que NO cambia

- `Track` schema (`type: 'YOUTUBE' | 'FILE'` — ya existe)
- `AudioPlayer` (controles UI — completamente agnóstico)
- `TrackCard` (display de pistas)
- Atoms y mutations (`useAddSongTrack`, `useRemoveSongTrack`)
- Toda la navegación prev/next

## Lo que SÍ cambia

- `SongAudio` — renderizado condicional por `track.type`
- `handleSeek` — dos ramas según tipo
- El polling `setInterval` — solo para YouTube
- `AddTrackForm` — habilitar file input
- Nuevo `HtmlAudioEngine.tsx` (~40 líneas)

---

## Prerequisito real: Supabase Storage

Los archivos locales con `URL.createObjectURL()` son efímeros — se pierden al recargar.
La expansión completa de FILE tracks requiere:

```
usuario sube archivo
    ↓
supabase.storage.from('tracks').upload(path, file)
    ↓
supabase.storage.from('tracks').getPublicUrl(path)
    ↓
track.url = url permanente
    ↓
persiste en DB como cualquier otro track
```

Sin Supabase, se puede hacer un MVP local con base64 (pero no recomendado para
archivos grandes de audio).
