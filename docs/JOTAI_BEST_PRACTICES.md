# JOTAI BEST PRACTICES - 2026 EDITION

**Status:** Reference guide for Stave migration
**Based on:** GitHub discussions #1884, #1472, #896; Jotai official docs; Feature-Sliced Design

---

## 🏗️ ARCHITECTURAL PRINCIPLES

### 1. **Atoms Are Configuration, Not Stores**

**Zustand Mindset:**
```typescript
// One big store with everything
const store = create((set) => ({
  users: [],
  posts: [],
  comments: [],
  actions: { addUser, deletePost, ... }
}))
```

**Jotai Mindset:**
```typescript
// Atoms are LIKE variables, not classes
const usersAtom = atom([])
const postsAtom = atom([])
const commentsAtom = atom([])
// Logic lives in hooks/components, not atoms
```

**Implication:** Atoms should be boring (just values). Complexity lives in **reading** them (derived atoms) and **writing** them (mutation hooks).

---

### 2. **Three Levels of Atoms**

```
LEVEL 1: Primitive Atoms (Base data)
├─ hubsAtom = atomWithStorage('stave-hubs', [])
├─ activeHubIdAtom = atom(null)
└─ createModalOpenAtom = atom(false)

LEVEL 2: Derived Atoms (Computed values, read-only)
├─ activeHubAtom = atom(get => get(hubsAtom).find(...))
├─ activeSongsAtom = atom(get => get(activeHubAtom)?.songs || [])
└─ hubCountAtom = atom(get => get(hubsAtom).length)

LEVEL 3: Scoped Atoms (Page-local, temporary)
├─ Song Page: pageHubIdAtom, isEditingLyricsAtom, etc
└─ Hub Page: selectedSongIdAtom, isCreatingSongAtom, etc
```

**Rule:** Each level has a purpose. Don't mix concerns.

---

## 📂 ORGANIZATION PATTERNS

### **Pattern A: Domain-Based (RECOMMENDED FOR STAVE)**

```
store/jotai/
├── core/                          ← Primitive & core atoms
│  ├── hubs.atoms.ts              (hubsAtom, activeHubIdAtom)
│  ├── navigation.atoms.ts        (activeHubIdAtom, activeSongIdAtom)
│  └── index.ts                   (export all core)
├── queries/                       ← Derived atoms (read-only)
│  ├── hubs.queries.ts            (activeHubAtom, activeSongsAtom)
│  └── index.ts
└── page-scopes/                   ← Scoped by route
   ├── song-page.atoms.ts         (factory: createSongPageAtoms)
   ├── hub-page.atoms.ts          (factory: createHubPageAtoms)
   └── index.ts
```

**Pros:**
- ✅ Clear separation of concerns
- ✅ Easy to find atoms (by domain)
- ✅ Scales well (add `shopping-cart/` later)
- ✅ Mirrors your data model

**Cons:**
- More files (but organized)

---

### **Pattern B: Feature-Based (For larger apps)**

```
features/
├── hubs/
│  ├── atoms.ts
│  ├── hooks.ts
│  ├── components/
│  └── types.ts
└── songs/
   ├── atoms.ts
   ├── hooks.ts
   └── components/
```

*Not ideal for Stave (too small), but good to know.*

---

### **Pattern C: Co-Location (For component-local state)**

```typescript
// components/features/hub/HubCard.tsx
const isHoveredAtom = atom(false)  // ← Local to this component

export const HubCard = () => {
  const [isHovered, setIsHovered] = useAtom(isHoveredAtom)
  // ...
}
```

**When to use:** State that's truly local to ONE component.

---

## 🎯 CORE PATTERNS

### **Pattern 1: Primitive Atoms (Base State)**

```typescript
// store/jotai/core/hubs.atoms.ts

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Hub } from '@/types'

// Persisted (localStorage)
export const hubsAtom = atomWithStorage<Hub[]>('stave-hubs', [])

// Non-persisted
export const activeHubIdAtom = atom<string | null>(null)
```

**Rules:**
- ✅ Simple type (string, number, array, object)
- ✅ No methods inside atoms
- ✅ Use `atomWithStorage` for persistence
- ✅ Clear naming: `hubsAtom`, not `hubStore` or `hub$`

---

### **Pattern 2: Derived Atoms (Read-Only Computed)**

```typescript
// store/jotai/queries/hubs.queries.ts

import { atom } from 'jotai'
import { hubsAtom, activeHubIdAtom } from '@/store/jotai/core'

// Read from other atoms, return computed value
export const activeHubAtom = atom((get) => {
  const hubs = get(hubsAtom)
  const activeHubId = get(activeHubIdAtom)
  return hubs.find((h) => h.id === activeHubId) || null
})

// Chain derived atoms
export const activeSongsAtom = atom((get) => {
  const activeHub = get(activeHubAtom)  // ← Reads derived atom
  return activeHub?.songs || []
})

// Computed counts (cheap)
export const hubCountAtom = atom((get) => {
  return get(hubsAtom).length
})
```

**Rules:**
- ✅ Use `(get) => value` syntax
- ✅ Read other atoms with `get(otherAtom)`
- ✅ Can chain (derived atoms reading other derived atoms)
- ✅ Automatically memoized (only re-compute when deps change)
- ✅ Don't mutate! Just return new value

---

### **Pattern 3: Scoped Atoms (Page-Local State)**

```typescript
// store/jotai/page-scopes/song-page.atoms.ts

import { atom } from 'jotai'

/**
 * Factory: Create a new set of atoms for each SongPage instance
 * Each SongPage gets its own isolated atoms (no interference)
 */
export interface SongPageAtoms {
  pageHubIdAtom: ReturnType<typeof atom<string>>
  pageHubColorAtom: ReturnType<typeof atom<string>>
  isEditingLyricsAtom: ReturnType<typeof atom<boolean>>
  editingSectionIdAtom: ReturnType<typeof atom<string | null>>
}

export const createSongPageAtoms = (
  hubId: string,
  hubColor: string
): SongPageAtoms => ({
  pageHubIdAtom: atom(hubId),
  pageHubColorAtom: atom(hubColor),
  isEditingLyricsAtom: atom(false),
  editingSectionIdAtom: atom(null),
})
```

**Rules:**
- ✅ Use factory pattern (function returns atoms)
- ✅ Create new instance per page mount
- ✅ Pass atoms as props (NO Context needed)
- ✅ Auto-cleanup on unmount
- ✅ Don't persist (local-only state)

---

### **Pattern 4: Mutation Hooks (Write Logic)**

```typescript
// lib/data/mutations.ts

import { useAtom, useSetAtom } from 'jotai'
import { hubsAtom, activeHubIdAtom } from '@/store/jotai/core'
import { v4 as uuid } from 'uuid'

/**
 * Hook to create a new hub
 * Encapsulates: validation, ID generation, state update
 */
export const useCreateHub = () => {
  const [, setHubs] = useAtom(hubsAtom)
  const [, setActiveHubId] = useAtom(activeHubIdAtom)

  return (input: Partial<Hub>) => {
    const newHub: Hub = {
      id: uuid(),
      name: input.name || 'Sin título',
      description: input.description || '',
      color: input.color || '#FFFFFF',
      type: input.type || 'ALBUM',
      songs: [],
      createdAt: new Date().toISOString(),
    }

    setHubs((prev) => [newHub, ...prev])
    setActiveHubId(newHub.id)
    return newHub
  }
}

/**
 * Hook to update hub metadata
 */
export const useUpdateHubMeta = () => {
  const [, setHubs] = useAtom(hubsAtom)

  return (hubId: string, updates: Partial<Hub>) => {
    setHubs((prev) =>
      prev.map((h) => (h.id === hubId ? { ...h, ...updates } : h))
    )
  }
}
```

**Rules:**
- ✅ One hook per mutation
- ✅ Use `useSetAtom` if only writing (lighter)
- ✅ Use `useAtom` if reading + writing
- ✅ Validation logic stays here
- ✅ Return values when useful
- ✅ Combine multiple atoms if needed

---

### **Pattern 5: Query Hooks (Read Logic)**

```typescript
// lib/data/hooks.ts

import { useAtom } from 'jotai'
import { hubsAtom, activeHubIdAtom } from '@/store/jotai/core'
import { activeHubAtom, activeSongsAtom } from '@/store/jotai/queries'

/**
 * Simple read hook
 */
export const useHubs = () => {
  const [hubs] = useAtom(hubsAtom)
  return hubs
}

/**
 * Hook that reads derived atom
 */
export const useActiveHub = () => {
  const [activeHub] = useAtom(activeHubAtom)
  return activeHub
}

/**
 * Selector pattern (only re-render if value changed)
 */
export const useHubCount = () => {
  const [hubs] = useAtom(hubsAtom)
  return hubs.length
}
```

**Rules:**
- ✅ One hook per query
- ✅ Read from atoms or derived atoms
- ✅ Return the value (not the atom)
- ✅ No logic - just reading
- ✅ Used by components (they don't know about atoms)

---

## 🔄 MIGRATION PATH: Zustand → Jotai

### **Before (Zustand):**
```typescript
// store/stave.store.ts (138 lines)
const useStaveStore = create(persist((set, get) => ({
  hubs: [],
  actions: {
    createHub: (input) => { /* 20 lines */ },
    updateHubMeta: (id, updates) => { /* 10 lines */ },
    // ... 9 more actions
  }
})))
```

### **After (Jotai):**
```typescript
// store/jotai/core/hubs.atoms.ts (5 lines)
export const hubsAtom = atomWithStorage('stave-hubs', [])

// store/jotai/core/navigation.atoms.ts (2 lines)
export const activeHubIdAtom = atom(null)

// lib/data/mutations.ts (50 lines)
export const useCreateHub = () => { /* 15 lines */ }
export const useUpdateHubMeta = () => { /* 8 lines */ }
// ... same 11 mutations, now as separate hooks
```

**Difference:**
- **Zustand:** Everything in one big create() call
- **Jotai:** Atoms separate, mutations as hooks

---

## 🎨 PERFORMANCE TIPS

### **1. Split Large Atoms**

```typescript
// ❌ BAD: One big atom forces re-renders
const appStateAtom = atom({
  user: null,
  theme: 'dark',
  modal: { open: false, data: null },
  sidebar: { expanded: true }
})

// ✅ GOOD: Granular atoms, granular re-renders
const userAtom = atom(null)
const themeAtom = atom('dark')
const modalOpenAtom = atom(false)
const sidebarExpandedAtom = atom(true)
```

**Result:** When `themeAtom` changes, only theme-consuming components re-render.

---

### **2. Use Derived Atoms for Expensive Computations**

```typescript
// ✅ GOOD: Memoized (only re-compute when deps change)
export const filteredSongsAtom = atom((get) => {
  const songs = get(activeSongsAtom)
  const searchQuery = get(searchQueryAtom)
  // Only re-run when songs or searchQuery changes
  return songs.filter(s => s.title.includes(searchQuery))
})
```

---

### **3. useSetAtom for Write-Only**

```typescript
// ✅ GOOD: Don't subscribe to reads if only writing
const ThemeToggle = () => {
  const setTheme = useSetAtom(themeAtom)  // Lighter (no read)
  return <button onClick={() => setTheme('light')}>Toggle</button>
}
```

---

## 🚀 NEXT.JS + SSR CONSIDERATIONS

### **1. Hydration Mismatch Fix**

```typescript
// app/layout.tsx
'use client'

import { HydrateAtoms } from 'jotai/react/NextjsHydrateAtoms'
import { Provider } from 'jotai'

export default function RootLayout({ children }) {
  return (
    <Provider>
      <HydrateAtoms>{children}</HydrateAtoms>
    </Provider>
  )
}
```

---

### **2. Only Render After Hydration**

```typescript
// components/ThemeToggle.tsx
'use client'

import { useHydrate } from '@/hooks'
import { useAtom } from 'jotai'
import { themeAtom } from '@/store/jotai/core'

export const ThemeToggle = () => {
  const hydrated = useHydrate()
  const [theme, setTheme] = useAtom(themeAtom)

  if (!hydrated) return null  // ← Wait for hydration

  return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme}</button>
}
```

---

## 📊 COMPARISON: ZUSTAND VS JOTAI

| Aspect | Zustand | Jotai |
|--------|---------|-------|
| **Store Creation** | `create<State>()` | `atom()` |
| **Persistence** | middleware | `atomWithStorage` |
| **Derived State** | selector functions | `atom((get) => ...)` |
| **Performance** | Good (if optimized) | Better (granular) |
| **SSR Friendly** | Needs workarounds | Built-in |
| **React Query Compat** | Manual integration | `atomWithQuery` |
| **Learning Curve** | Medium | Low |
| **File Count** | 1 big store | Multiple atoms |
| **Scalability** | Good | Excellent |

---

## ✅ CHECKLIST: IS YOUR ATOM WELL-DESIGNED?

- [ ] Atom name ends with `Atom` (hubsAtom, not hubStore)
- [ ] Single responsibility (atoms are boring)
- [ ] No methods inside atoms
- [ ] Persistence handled with `atomWithStorage` if needed
- [ ] Derived atoms use `(get) => value` pattern
- [ ] Mutations are separate hooks in `lib/data/mutations.ts`
- [ ] Queries are separate hooks in `lib/data/hooks.ts`
- [ ] Scoped atoms use factory pattern
- [ ] No atom imports in components (use hooks instead)
- [ ] Performance: atoms are granular (not one mega-atom)

---

## 📚 REFERENCES

- [Jotai Official Docs](https://jotai.org/)
- [GitHub Discussion #1884: Recommended Store Layout](https://github.com/pmndrs/jotai/discussions/1884)
- [Jotai + Next.js Guide](https://jotai.org/docs/guides/nextjs)
- [Feature-Sliced Design with Jotai](https://feature-sliced.design/blog/jotai-minimalist-architecture)

---

**Last Updated:** 2026-02-28
**For:** Stave project
**Status:** Ready to implement
