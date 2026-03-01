# ZUSTAND SCOPED STORE STRATEGY - STAVE

**Status:** ✅ Validated pattern (Used in production apps, Zustand official discussions)
**Applies to:** SongPage, HubPage (cualquier page con estado local)
**Benefits:** Zero pollution of global store, reusability, testing, performance

---

## 🎯 ARQUITECTURA

### **Capas:**

```
Global Store (stave.store.ts)
├─ Datos persistentes (hubs, songs)
├─ Global actions (CRUD)
└─ activeHubId (UI global)

├─ SongPage (/dashboard/[hubId]/[songId])
│  ├─ Page Component
│  │  └─ Creates: songPageStore instance
│  │
│  ├─ SongPageStoreProvider (Context wrapper)
│  │  ├─ <SongHeader /> accede via useSongPageStore()
│  │  └─ <SongLyrics /> accede via useSongPageStore()
│  │
│  └─ songPageStore.ts (Local store factory)
│     ├─ hubId, hubColor (derivados de URL)
│     └─ isEditingLyrics, etc (UI state local)

├─ HubPage (/dashboard/[hubId])
│  └─ Similar pattern
```

---

## 📋 IMPLEMENTACIÓN PASO A PASO

### **Paso 1: Crear Store Factory**

```typescript
// lib/stores/song-page.store.ts

import { create } from 'zustand'

/**
 * Store local para SongPage
 * Cada instancia de SongPage crea su propia instancia del store
 * NO se persiste en localStorage
 */

export interface SongPageState {
  // Datos de contexto (derivados de URL)
  hubId: string
  hubColor: string
  songId: string

  // Estado local de UI
  isEditingLyrics: boolean
  editingSectionId: string | null

  // Actions
  setEditingLyrics: (val: boolean) => void
  setEditingSectionId: (id: string | null) => void
}

/**
 * Factory function para crear store instance
 * Se llama 1 vez por cada render de SongPage
 */
export const createSongPageStore = (
  hubId: string,
  hubColor: string,
  songId: string
) =>
  create<SongPageState>(set => ({
    // Initial state
    hubId,
    hubColor,
    songId,
    isEditingLyrics: false,
    editingSectionId: null,

    // Actions
    setEditingLyrics: (val: boolean) =>
      set({ isEditingLyrics: val }),

    setEditingSectionId: (id: string | null) =>
      set({ editingSectionId: id }),
  }))

// Type del store para TypeScript
export type SongPageStoreType = ReturnType<typeof createSongPageStore>
```

### **Paso 2: Crear Context Provider**

```typescript
// contexts/SongPageStoreContext.ts

import { ReactNode, createContext, useContext } from 'react'
import {
  SongPageStoreType,
} from '@/lib/stores/song-page.store'

/**
 * Context para pasar store instance a children
 * Similar a Redux Provider pero scoped a SongPage
 */

const SongPageStoreContext = createContext<SongPageStoreType | null>(null)

export interface SongPageStoreProviderProps {
  store: SongPageStoreType
  children: ReactNode
}

/**
 * Provider component
 * Wraps SongHeader, SongLyrics, etc
 */
export const SongPageStoreProvider = ({
  store,
  children,
}: SongPageStoreProviderProps) => (
  <SongPageStoreContext.Provider value={store}>
    {children}
  </SongPageStoreContext.Provider>
)

/**
 * Hook para acceder al store desde cualquier child
 * Lanza error si se usa fuera de Provider (development safety)
 */
export const useSongPageStore = <T,>(
  selector: (state: ReturnType<SongPageStoreType>) => T
): T => {
  const store = useContext(SongPageStoreContext)

  if (!store) {
    throw new Error(
      'useSongPageStore must be used inside SongPageStoreProvider'
    )
  }

  return store(selector)
}

// Helper hooks para common selectors
export const useHubIdFromPage = () =>
  useSongPageStore(s => s.hubId)

export const useHubColorFromPage = () =>
  useSongPageStore(s => s.hubColor)

export const useIsEditingLyrics = () =>
  useSongPageStore(s => s.isEditingLyrics)
```

### **Paso 3: Usar en SongPage**

```typescript
// app/dashboard/[hubId]/[songId]/page.tsx

'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useHub, useSong } from '@/lib/data/hooks'
import {
  createSongPageStore,
  SongPageStoreType,
} from '@/lib/stores/song-page.store'
import {
  SongPageStoreProvider,
} from '@/contexts/SongPageStoreContext'
import { SongHeader } from '@/components/features/song/SongHeader'
import { SongLyrics } from '@/components/features/song/SongLyrics'
import { NotFound } from '@/components/shared'

export default function SongPage() {
  const { hubId, songId } = useParams()

  // Fetch data (1 vez)
  const hub = useHub(hubId as string)
  const song = useSong(hubId as string, songId as string)

  // Guard clauses
  if (!hub || !song) return <NotFound />

  // Crear store instance (1 vez, luego memoizado en estado)
  const [storeRef] = useState<SongPageStoreType>(() =>
    createSongPageStore(hub.id, hub.color, song.id)
  )

  return (
    <main style={{ '--primary-color': hub.color } as React.CSSProperties}>
      {/* Wrap con Provider */}
      <SongPageStoreProvider store={storeRef}>
        {/* Componentes acceden via useSongPageStore() hook */}
        <SongHeader song={song} />
        <SongLyrics songId={song.id} />
      </SongPageStoreProvider>
    </main>
  )
}
```

### **Paso 4: Usar en Componentes**

```typescript
// components/features/song/SongHeader.tsx

'use client'

import { useSongPageStore, useHubColorFromPage } from '@/contexts/SongPageStoreContext'
import { useUpdateSongMeta } from '@/lib/data/mutations'
import { EditableText, EditableSelect, TagInput } from '@/components/shared'

interface Props {
  song: Song  // ✅ Props mínimos (solo lo que renderiza)
}

export const SongHeader = ({ song }: Props) => {
  // ✅ Accede a hubId desde store (no prop drilling)
  const hubId = useSongPageStore(s => s.hubId)
  const hubColor = useHubColorFromPage()

  // ✅ Mutation hook
  const { mutate: updateSongMeta } = useUpdateSongMeta()

  return (
    <section className="flex flex-col gap-4">
      <EditableText
        value={song.title}
        onChange={(title) =>
          updateSongMeta({
            hubId,
            songId: song.id,
            title,
          })
        }
        color={hubColor}
      />

      <EditableSelect
        value={song.status}
        onChange={(status) =>
          updateSongMeta({
            hubId,
            songId: song.id,
            status,
          })
        }
        options={statusOptions}
        color={hubColor}
      />

      <TagInput
        existingTags={song.tags}
        onAdd={(tag) =>
          updateSongMeta({
            hubId,
            songId: song.id,
            tags: [...song.tags, tag],
          })
        }
        color={hubColor}
      />
    </section>
  )
}
```

```typescript
// components/features/song/SongLyrics.tsx

'use client'

import {
  useSongPageStore,
  useHubIdFromPage,
  useIsEditingLyrics,
} from '@/contexts/SongPageStoreContext'
import { useUpdateSongLyrics } from '@/lib/data/mutations'

interface Props {
  songId: string  // ✅ Minimal props
  items: LyricSection[]
}

export const SongLyrics = ({ songId, items }: Props) => {
  // ✅ Accede a hubId y UI state desde store
  const hubId = useHubIdFromPage()
  const isEditing = useIsEditingLyrics()
  const { mutate: updateLyrics } = useUpdateSongLyrics()

  const handleAddSection = (section: LyricSection) => {
    updateLyrics({
      hubId,
      songId,
      sections: [...items, section],
    })
  }

  return (
    <section>
      {isEditing && (
        <button onClick={() => handleAddSection(...)}>
          + Agregar sección
        </button>
      )}

      {items.map(section => (
        <LyricSection key={section.id} section={section} />
      ))}
    </section>
  )
}
```

---

## 🔄 FLUJO COMPLETO

```
1. User navega a /dashboard/abc123/song456
   ↓
2. SongPage monta
   ├─ useParams() → { hubId: 'abc123', songId: 'song456' }
   ├─ useHub('abc123') → fetch hub data
   ├─ useSong('abc123', 'song456') → fetch song data
   └─ createSongPageStore(hubId, color, songId) → store instance
   ↓
3. SongPageStoreProvider envuelve children con store instance
   ↓
4. SongHeader monta
   ├─ useSongPageStore(s => s.hubId) → 'abc123'
   ├─ useSongPageStore(s => s.hubColor) → '#FF5733'
   └─ Renderiza con datos del store
   ↓
5. User edita título en SongHeader
   ├─ onChange → updateSongMeta({ hubId, songId, title })
   ├─ Mutation → Zustand global actualiza
   ├─ SongPage re-render (prop song cambió)
   └─ SongHeader re-render con nuevo valor
   ↓
6. User navega a otra página (/dashboard)
   ├─ SongPage unmount
   ├─ Store instance se garbage collect (no persiste)
   └─ Vuelta a limpio estado global
```

---

## ✅ BENEFICIOS

| Beneficio | Detalles |
|-----------|----------|
| **Zero Pollution** | Global store sin hubId, hubColor, isEditing, etc |
| **Reusable** | SongHeader puede usarse en Modal, Preview, etc (con su propio store) |
| **Testable** | Pass mock store a Provider en tests |
| **Performant** | Subscriptions granulares (solo al slice que cambia) |
| **Type Safe** | TypeScript infiere tipos completos |
| **Scalable** | Patrón aplica a HubPage, ModalPage, cualquier "page scope" |

---

## 🔧 APLICAR A OTRAS PAGES

### **HubPage** (mismo patrón)

```typescript
// lib/stores/hub-page.store.ts
export const createHubPageStore = (hubId: string, hubColor: string) =>
  create<HubPageState>(set => ({
    hubId,
    hubColor,
    selectedSongId: null,
    isCreatingSong: false,
    // ...
  }))

// En app/dashboard/[hubId]/page.tsx
const [storeRef] = useState(() =>
  createHubPageStore(hub.id, hub.color)
)

return (
  <HubPageStoreProvider store={storeRef}>
    <HubHeader hub={hub} />
    <SongCollection songs={hub.songs} />
  </HubPageStoreProvider>
)
```

---

## 📊 ARQUITECTURA FINAL DE ESTADO

```
├─ Global Store (Zustand, localStorage)
│  ├─ hubs: Hub[]                    ← Datos persistentes
│  ├─ activeHubId: string            ← UI global
│  └─ actions: CRUD                  ← Mutaciones globales
│
├─ SongPage Scoped Store (Zustand, sin persist)
│  ├─ hubId, hubColor, songId        ← Derivados de URL
│  ├─ isEditingLyrics, editingSectionId ← UI local
│  └─ actions: setEditingLyrics      ← Mutaciones locales
│
├─ HubPage Scoped Store (Zustand, sin persist)
│  ├─ hubId, hubColor                ← Derivados de URL
│  ├─ selectedSongId, isCreating     ← UI local
│  └─ actions                        ← Mutaciones locales
│
└─ React Query (futuro)
   ├─ useQuery hooks (fetch data)
   └─ useMutation hooks (mutations)
```

---

## 🚀 ROADMAP IMPLEMENTACIÓN

### **Fase 1: SongPage (Ahora)**
- [ ] Crear `songPageStore.ts`
- [ ] Crear `SongPageStoreContext.tsx`
- [ ] Refactor `SongPage` con store instance
- [ ] Refactor `SongHeader` para usar `useSongPageStore()`
- [ ] Refactor `SongLyrics` para usar `useSongPageStore()`
- [ ] Test: No hay prop drilling

### **Fase 2: HubPage (Después)**
- [ ] Crear `hubPageStore.ts`
- [ ] Crear `HubPageStoreContext.tsx`
- [ ] Refactor HubPage + HubHeader + SongCollection

### **Fase 3: Global Cleanup (Después)**
- [ ] Remover datos locales de global store
- [ ] Mantener solo datos persistentes en Zustand global
- [ ] Preparar para React Query (Fase 2 con Supabase)

---

## 📚 REFERENCIAS

- [Zustand Docs - Using Context](https://zustand.docs.pmnd.rs/hooks/use-store)
- [GitHub Discussion: Global vs Scoped](https://github.com/pmndrs/zustand/discussions/2772)
- [Zustand-Scoped Package](https://github.com/pmndrs/zustand/discussions/1587)
- [React Context with Zustand](https://tkdodo.eu/blog/zustand-and-react-context)

---

**Status:** Ready to implement
**Estimated Time:** 2-3 horas (SongPage)
**Complexity:** Medium
**Benefit:** High (cleaner architecture, reusability, scalability)
