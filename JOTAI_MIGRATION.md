# JOTAI MIGRATION PLAN - STAVE

**Status:** 🚀 Ready to implement
**Timeline:** 2-2.5 hours (MVP local)
**Benefit:** Zero boilerplate, cleaner architecture, seamless Supabase integration

---

## 🎯 DECISIÓN

Migrar de Zustand global a **Jotai** para:
- ✅ Eliminar boilerplate (factory + context patterns)
- ✅ Atoms simples y composables
- ✅ Scope automático (sin Context provider necesario)
- ✅ Integración limpia post-Supabase (atomWithQuery)
- ✅ Less opinionated, more flexible

---

## 📋 ARQUITECTURA FINAL

### **Atoms Organization**

```
lib/atoms/
├── stave.atoms.ts       (Global data - persistent)
├── song-page.atoms.ts   (Song page local atoms)
└── hub-page.atoms.ts    (Hub page local atoms)
```

### **Layer Structure**

```
┌─ Global Atoms (Persistent, shared)
│  ├─ hubsAtom: Hub[]
│  ├─ songsAtom: Song[]
│  ├─ activeHubIdAtom: string | null
│  └─ (synced with localStorage via middleware)
│
├─ SongPage Atoms (Local, scoped)
│  ├─ pageHubIdAtom: string
│  ├─ pageHubColorAtom: string
│  ├─ isEditingLyricsAtom: boolean
│  └─ editingSectionIdAtom: string | null
│
├─ Components (consume atoms via useAtom)
│  ├─ SongHeader (uses pageHubIdAtom, pageHubColorAtom)
│  ├─ SongLyrics (uses isEditingLyricsAtom)
│  └─ SongTag (reads atoms)
│
└─ Hooks (custom logic)
   ├─ useSongMeta() → wrapper around mutations
   └─ useSongPageAtoms() → helper to access scoped atoms
```

---

## 🔄 IMPLEMENTACIÓN PASO A PASO

### **Paso 1: Setup Jotai** (5 minutos)

```bash
npm install jotai
# Optional (for future Supabase integration):
npm install jotai-tanstack-query
```

### **Paso 2: Global Atoms**

```typescript
// lib/atoms/stave.atoms.ts

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Hub, Song } from '@/types'

/**
 * Global atoms (persistent in localStorage)
 * These are the "source of truth" for all data
 */

// Data atoms
export const hubsAtom = atomWithStorage<Hub[]>('stave-hubs', [])
export const activeHubIdAtom = atom<string | null>(null)

// Derived atoms (computed from other atoms)
export const activeHubAtom = atom((get) => {
  const hubs = get(hubsAtom)
  const activeHubId = get(activeHubIdAtom)
  return hubs.find(h => h.id === activeHubId) || null
})

export const activeSongsAtom = atom((get) => {
  const activeHub = get(activeHubAtom)
  return activeHub?.songs || []
})

export const songCountAtom = atom((get) => {
  return get(activeSongsAtom).length
})
```

**Key Points:**
- `atomWithStorage` = persiste en localStorage automáticamente
- Atoms derived = computed values (sin repetir logic)
- Selectors granulares = componentes re-render solo si su atom cambia

### **Paso 3: Song Page Local Atoms**

```typescript
// lib/atoms/song-page.atoms.ts

import { atom } from 'jotai'

/**
 * Factory para crear atoms locales por instancia de SongPage
 * No se persisten, scope local a esa página
 */

export interface SongPageAtoms {
  pageHubIdAtom: ReturnType<typeof atom<string>>
  pageHubColorAtom: ReturnType<typeof atom<string>>
  pageSongIdAtom: ReturnType<typeof atom<string>>
  isEditingLyricsAtom: ReturnType<typeof atom<boolean>>
  editingSectionIdAtom: ReturnType<typeof atom<string | null>>
}

export const createSongPageAtoms = (
  hubId: string,
  hubColor: string,
  songId: string
): SongPageAtoms => ({
  pageHubIdAtom: atom(hubId),
  pageHubColorAtom: atom(hubColor),
  pageSongIdAtom: atom(songId),
  isEditingLyricsAtom: atom(false),
  editingSectionIdAtom: atom(null),
})
```

### **Paso 4: Refactor SongPage**

```typescript
// app/dashboard/[hubId]/[songId]/page.tsx

'use client'

import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import { useAtom } from 'jotai'
import { useHub, useSong } from '@/lib/data/hooks'
import { createSongPageAtoms } from '@/lib/atoms/song-page.atoms'
import { SongHeader } from '@/components/features/song/SongHeader'
import { SongLyrics } from '@/components/features/song/SongLyrics'
import { NotFound } from '@/components/shared'

export default function SongPage() {
  const { hubId, songId } = useParams()

  // Fetch data (1 vez)
  const hub = useHub(hubId as string)
  const song = useSong(hubId as string, songId as string)

  if (!hub || !song) return <NotFound />

  // Create scoped atoms (memoized)
  const atoms = useMemo(
    () => createSongPageAtoms(hub.id, hub.color, song.id),
    [hub.id, hub.color, song.id]
  )

  return (
    <main style={{ '--primary-color': hub.color } as React.CSSProperties}>
      {/* NO CONTEXT PROVIDER NEEDED! */}
      <SongHeader song={song} atoms={atoms} />
      <SongLyrics songId={song.id} atoms={atoms} />
    </main>
  )
}
```

**Cambios clave:**
- ❌ SIN `SongPageStoreProvider`
- ❌ SIN Context wrapper
- ✅ Atoms creados directamente
- ✅ Pasados como props

### **Paso 5: Refactor SongHeader**

```typescript
// components/features/song/SongHeader.tsx

'use client'

import { useAtom } from 'jotai'
import { SongPageAtoms } from '@/lib/atoms/song-page.atoms'
import { useUpdateSongMeta } from '@/lib/data/mutations'
import { EditableText, EditableSelect, TagInput } from '@/components/shared'
import { Song } from '@/types'

interface Props {
  song: Song
  atoms: SongPageAtoms
}

export const SongHeader = ({ song, atoms }: Props) => {
  // ✅ Read from scoped atoms (simple!)
  const [hubId] = useAtom(atoms.pageHubIdAtom)
  const [hubColor] = useAtom(atoms.pageHubColorAtom)

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

### **Paso 6: Refactor SongLyrics**

```typescript
// components/features/song/SongLyrics.tsx

'use client'

import { useAtom } from 'jotai'
import { SongPageAtoms } from '@/lib/atoms/song-page.atoms'
import { useUpdateSongLyrics } from '@/lib/data/mutations'
import { LyricSection } from '@/types'

interface Props {
  songId: string
  items: LyricSection[]
  atoms: SongPageAtoms
}

export const SongLyrics = ({ songId, items, atoms }: Props) => {
  // ✅ Read from scoped atoms
  const [hubId] = useAtom(atoms.pageHubIdAtom)
  const [isEditing, setIsEditing] = useAtom(atoms.isEditingLyricsAtom)
  const [editingId, setEditingId] = useAtom(atoms.editingSectionIdAtom)

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
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Listo' : 'Editar letras'}
      </button>

      {isEditing && (
        <button onClick={() => handleAddSection(...)}>
          + Agregar sección
        </button>
      )}

      {items.map(section => (
        <LyricSection
          key={section.id}
          section={section}
          isEditing={isEditing}
          isSelected={editingId === section.id}
          onSelect={() => setEditingId(section.id)}
        />
      ))}
    </section>
  )
}
```

### **Paso 7: Refactor Dashboard (Global atoms)**

```typescript
// app/dashboard/page.tsx

'use client'

import { useAtom } from 'jotai'
import { hubsAtom, activeHubIdAtom } from '@/lib/atoms/stave.atoms'
import { HubCard } from '@/components/features/hub/HubCard'
import { CreateHubButton } from '@/components/features/hub/CreateHubButton'

export default function Dashboard() {
  // ✅ Read from global atoms
  const [hubs] = useAtom(hubsAtom)
  const [activeHubId, setActiveHubId] = useAtom(activeHubIdAtom)

  return (
    <main>
      <div className="grid gap-4">
        {hubs.map(hub => (
          <HubCard
            key={hub.id}
            hub={hub}
            isActive={activeHubId === hub.id}
            onSelect={() => setActiveHubId(hub.id)}
          />
        ))}
      </div>
      <CreateHubButton />
    </main>
  )
}
```

### **Paso 8: Refactor CRUD Actions**

```typescript
// lib/actions/hub.actions.ts

import { useAtom } from 'jotai'
import { hubsAtom } from '@/lib/atoms/stave.atoms'
import { v4 as uuid } from 'uuid'

export const useCreateHub = () => {
  const [, setHubs] = useAtom(hubsAtom)

  return (input: Partial<Hub>) => {
    const newHub: Hub = {
      id: uuid(),
      name: input.name || 'Nuevo Hub',
      description: input.description || '',
      type: input.type || 'ALBUM',
      color: input.color || '#FFFFFF',
      createdAt: new Date(),
      songs: [],
    }

    setHubs(prev => [...prev, newHub])
  }
}

export const useUpdateHubMeta = () => {
  const [, setHubs] = useAtom(hubsAtom)

  return (hubId: string, updates: Partial<Hub>) => {
    setHubs(prev =>
      prev.map(h =>
        h.id === hubId ? { ...h, ...updates } : h
      )
    )
  }
}

export const useDeleteHub = () => {
  const [, setHubs] = useAtom(hubsAtom)

  return (hubId: string) => {
    setHubs(prev => prev.filter(h => h.id !== hubId))
  }
}
```

---

## 🚀 FUTURO POST-SUPABASE: TanStack Query + Jotai

### **Cómo Jotai escala con Supabase:**

```typescript
// Futuro: lib/atoms/supabase.atoms.ts
import { atom } from 'jotai'
import { atomWithQuery } from 'jotai-tanstack-query'
import { supabase } from '@/lib/supabase'

/**
 * Atoms que se sincronizan automáticamente con React Query
 * Cuando los datos en Supabase cambian, los atoms se actualizan
 */

// Query atom: fetch data from Supabase
export const hubsQueryAtom = atomWithQuery(queryOptions({
  queryKey: ['hubs'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('hubs')
      .select('*, songs(*)')
    if (error) throw error
    return data
  }
}))

// Mutation atom: update data in Supabase
export const updateHubMutationAtom = atom(
  null,
  async (get, set, { hubId, updates }: { hubId: string; updates: Partial<Hub> }) => {
    const { error } = await supabase
      .from('hubs')
      .update(updates)
      .eq('id', hubId)

    if (error) throw error

    // Auto-refresh query (React Query cache invalidation)
    queryClient.invalidateQueries({ queryKey: ['hubs'] })
  }
)

// En componente:
const [hubsData] = useAtom(hubsQueryAtom)  // ← Auto-synced with Supabase
const hubs = hubsData.data || []            // ← TypeScript knows this is Hub[]
```

### **Seamless Migration Path:**

```
AHORA (MVP Local):
├─ hubsAtom = atomWithStorage('hubs', [])
├─ Componentes: useAtom(hubsAtom)
└─ Data source: localStorage

FUTURO (Post-Supabase):
├─ hubsAtom = atomWithQuery(...)
├─ Componentes: useAtom(hubsAtom) ← MISMO CÓDIGO!
└─ Data source: Supabase

✅ ZERO cambios en componentes
✅ Solo cambia implementación de atoms
```

---

## 📊 BENEFICIOS POR FASE

### **Fase 1: MVP Local (Ahora)**
```
✅ Zero boilerplate (atoms are simple)
✅ Atoms as props (no context needed)
✅ Scoped atoms (SongPage independent)
✅ localStorage persistence (built-in)
✅ Clean architecture
```

### **Fase 2: Supabase + React Query (Post-MVP)**
```
✅ atomWithQuery integration (seamless)
✅ Auto-sync with server data
✅ Caching built-in (React Query)
✅ Optimistic updates easy
✅ Components ZERO changes
```

### **Fase 3: Collaboration (Future)**
```
✅ Realtime atoms with Supabase listeners
✅ Multi-user sync (WebSockets)
✅ Offline-first with atoms
✅ Still zero component changes
```

---

## 🔄 MIGRATION TIMELINE

| Task | Time | Notes |
|------|------|-------|
| Setup Jotai | 5 min | `npm install jotai` |
| Global atoms | 15 min | stave.atoms.ts |
| Local atoms factory | 15 min | song-page.atoms.ts |
| Refactor SongPage | 20 min | Remove Provider |
| Refactor SongHeader | 15 min | useAtom calls |
| Refactor SongLyrics | 15 min | useAtom calls |
| Refactor Dashboard | 10 min | Global atoms |
| Refactor CRUD actions | 20 min | useAtom setters |
| Testing | 30 min | Verify no breakage |
| **TOTAL** | **2-2.5 hours** | Fully migrated |

---

## ✅ CHECKLIST IMPLEMENTACIÓN

- [ ] Install Jotai: `npm install jotai`
- [ ] Create `lib/atoms/stave.atoms.ts`
- [ ] Create `lib/atoms/song-page.atoms.ts`
- [ ] Create `lib/atoms/hub-page.atoms.ts` (for future)
- [ ] Refactor `app/dashboard/page.tsx` (global atoms)
- [ ] Refactor `app/dashboard/[hubId]/[songId]/page.tsx` (scoped atoms)
- [ ] Refactor `SongHeader.tsx` (useAtom)
- [ ] Refactor `SongLyrics.tsx` (useAtom)
- [ ] Refactor `HubHeader.tsx` (global atoms)
- [ ] Refactor `Sidebar.tsx` (global atoms)
- [ ] Refactor CRUD actions to use `useAtom`
- [ ] Test: No broken functionality
- [ ] Verify: atoms persist correctly
- [ ] Update MEMORY.md

---

## 📚 REFERENCES

- [Jotai Docs](https://jotai.org/)
- [Jotai + TanStack Query](https://jotai.org/docs/extensions/query)
- [atomWithStorage (localStorage integration)](https://jotai.org/docs/utils/atom-with-storage)
- [atomWithQuery (React Query integration)](https://jotai.org/docs/extensions/query)

---

**Status:** Ready to implement
**Next Step:** Start with `lib/atoms/stave.atoms.ts`
**Estimated Completion:** Today (~2.5 hours)
