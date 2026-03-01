# STAVE ARCHITECTURE & FOLDER STRUCTURE

**Status:** Coherent organization plan
**Current State:** Store at root level (like components, hooks)
**Goal:** Maintain consistency while migrating to Jotai

---

## 📂 ACTUAL STRUCTURE (Current)

```
stave/
├── app/                    ← Next.js App Router pages
│  └── dashboard/
├── components/             ← React components (UI + features)
│  ├── ui/                 (shadcn base: Button, Input, Select, etc)
│  ├── shared/             (EditableText, TagInput, ActionMenu, etc)
│  ├── features/           (SongHeader, SongLyrics, HubCard, etc)
│  ├── form/               (Form fields)
│  └── providers/          (ThemeProvider, etc)
├── hooks/                  ← Custom React hooks
│  ├── useDebounce.ts
│  └── useHydrate.ts
├── lib/                    ← Utilities & helpers
│  ├── api/                (API layer - future)
│  ├── constants/          (SONG_KEYS, colors, etc)
│  └── utils/              (cn, capitalize, date, etc)
├── types/                  ← TypeScript types & Zod schemas
├── store/                  ← STATE MANAGEMENT (Zustand - to migrate)
│  ├── stave.store.ts      (Global state: hubs, actions)
│  └── create-modal.store.ts (Modal UI state)
├── public/
├── docs/
└── CLAUDE.md, etc
```

**Observation:** `store/` is a **ROOT-LEVEL directory** (like `components/`, `hooks/`, `lib/`)
→ This tells us: "State management is a first-class concern"

---

## 🎯 PROPOSED STRUCTURE (Coherent + Jotai)

### **Option 1: RECOMMENDED - Keep `store/` as container**

```
stave/
├── store/                          ← STATE MANAGEMENT (all solutions)
│  ├── zustand/                     ← Legacy (to delete after migration)
│  │  ├── create-modal.store.ts     (UI local state)
│  │  └── stave.store.ts            (Will be deleted)
│  │
│  └── jotai/                       ← NEW (Jotai atoms)
│     ├── core/                     (Primitive atoms)
│     │  ├── hubs.atoms.ts          (hubsAtom, activeHubIdAtom)
│     │  ├── navigation.atoms.ts    (activeHubIdAtom - MOVE HERE)
│     │  └── index.ts               (export all core)
│     │
│     ├── queries/                  (Derived atoms - read-only)
│     │  ├── hubs.queries.ts        (activeHubAtom, activeSongsAtom)
│     │  └── index.ts               (export all queries)
│     │
│     └── page-scopes/              (Scoped per route)
│        ├── song-page.atoms.ts     (createSongPageAtoms factory)
│        ├── hub-page.atoms.ts      (createHubPageAtoms factory)
│        └── index.ts               (export factories)
│
├── lib/                            ← UTILITIES (keep same)
│  ├── api/
│  ├── constants/
│  ├── utils/
│  └── data/                        ← NEW (Data layer abstraction)
│     ├── mutations.ts              (useCreateHub, useUpdateSongMeta, etc)
│     ├── hooks.ts                  (useHubs, useActiveHub, etc)
│     └── index.ts                  (export hooks + mutations)
│
├── hooks/                          ← CUSTOM HOOKS (keep same)
│
├── components/                     ← COMPONENTS (keep same)
│
└── types/                          ← SCHEMAS (keep same)
```

**Advantages:**
- ✅ `store/` remains a cohesive "state management" folder
- ✅ Clear separation: `zustand/` vs `jotai/` (easy to remove legacy)
- ✅ Data layer abstraction lives in `lib/data/` (matches naming pattern)
- ✅ Consistent with your current structure
- ✅ Easy migration path (rename, don't move)

---

### **Option 2: ALTERNATIVE - Direct in lib (flatten)**

```
stave/
├── lib/
│  ├── atoms/                    ← Jotai atoms (not utils)
│  │  ├── core/
│  │  ├── queries/
│  │  └── page-scopes/
│  ├── data/
│  ├── constants/
│  ├── utils/
│  └── api/
├── store/
│  └── zustand/                  ← Only legacy
```

**Disadvantage:** `lib/` becomes a kitchen sink (atoms + utils + data + api)

---

## 🔄 MIGRATION STRATEGY (Cloning Approach)

### **Phase 1: Create Jotai atoms alongside Zustand (weeks 1-2)**

```
OLD STATE:                          NEW STATE (parallel):
store/stave.store.ts  ──────────→  store/jotai/core/
                      │            + store/jotai/queries/
                      │            + lib/data/mutations.ts
                      │            + lib/data/hooks.ts
                      └────────────→ Components still read Zustand
```

**Components:** Still use Zustand (no changes)
**Atoms:** Created and ready to use
**Risk:** Zero (Zustand continues working)

---

### **Phase 2: Create data layer hooks that switch sources (weeks 2-3)**

```typescript
// lib/data/hooks.ts
export const useHubs = () => {
  // STEP 1: Read from Zustand (migration mode)
  return useHubs_Zustand()

  // STEP 2: (Later) Switch to Jotai
  // return useHubs_Jotai()
}
```

**Components:** Use `useHubs()` (abstracted)
**Zustand:** Zustand store still alive
**Jotai:** Atoms exist, tests can verify they work

---

### **Phase 3: Refactor components one-by-one (weeks 3-4)**

```
SongHeader.tsx
├─ OLD: useHubs() from Zustand
└─ NEW: useHubs() from lib/data/hooks (reads Jotai)

SongLyrics.tsx
├─ OLD: useStaveActions().updateSongLyrics()
└─ NEW: useUpdateSongLyrics() from lib/data/mutations

Dashboard.tsx
├─ OLD: useHubs() from Zustand
└─ NEW: useHubs() from lib/data/hooks
```

---

### **Phase 4: Delete Zustand (week 4)**

```
store/
├── zustand/  ← DELETE (no longer used)
├── jotai/    ← NOW LIVE (all atoms)
└── (optional) keep create-modal.store.ts if it's still useful
```

---

## 📋 FILE MAPPINGS: Zustand → Jotai

| Zustand State/Action | Jotai Location | File |
|---|---|---|
| `hubs: Hub[]` | Primitive atom | `store/jotai/core/hubs.atoms.ts` |
| `activeHubId: null` | Primitive atom | `store/jotai/core/navigation.atoms.ts` |
| `setActiveHubId()` | Mutation hook | `lib/data/mutations.ts` |
| `useHubs()` | Query hook | `lib/data/hooks.ts` |
| `useActiveHub()` | Derived atom | `store/jotai/queries/hubs.queries.ts` |
| `createHub()` | Mutation hook | `lib/data/mutations.ts` |
| `updateSongMeta()` | Mutation hook | `lib/data/mutations.ts` |
| `useStaveActions()` | N/A (split into hooks) | - |

---

## 🎯 CONCRETE STEP-BY-STEP (What we'll do)

### **Step 1: Setup (5 min)**
```bash
npm install jotai
# Create folders
mkdir -p store/jotai/{core,queries,page-scopes}
mkdir -p lib/data
```

### **Step 2: Create atoms (20 min)**
```typescript
// store/jotai/core/hubs.atoms.ts
export const hubsAtom = atomWithStorage('stave-hubs', [])

// store/jotai/core/navigation.atoms.ts
export const activeHubIdAtom = atom(null)

// store/jotai/core/index.ts
export * from './hubs.atoms'
export * from './navigation.atoms'
```

### **Step 3: Create derived atoms (10 min)**
```typescript
// store/jotai/queries/hubs.queries.ts
export const activeHubAtom = atom(get => ...)
export const activeSongsAtom = atom(get => ...)

// store/jotai/queries/index.ts
export * from './hubs.queries'
```

### **Step 4: Create data layer (20 min)**
```typescript
// lib/data/hooks.ts
export const useHubs = () => useAtom(hubsAtom)[0]
export const useActiveHub = () => useAtom(activeHubAtom)[0]

// lib/data/mutations.ts
export const useCreateHub = () => { ... }
export const useUpdateHubMeta = () => { ... }
export const useDeleteHub = () => { ... }
// ... (8 more mutation hooks)

// lib/data/index.ts
export * from './hooks'
export * from './mutations'
```

### **Step 5: Refactor components (1-2 hours)**
```typescript
// OLD: SongHeader.tsx
import { useHubs, useStaveActions } from '@/store/stave.store'

// NEW: SongHeader.tsx
import { useHubs, useUpdateSongMeta } from '@/lib/data'
```

### **Step 6: Scoped atoms for SongPage (15 min)**
```typescript
// store/jotai/page-scopes/song-page.atoms.ts
export const createSongPageAtoms = (hubId, hubColor) => ({ ... })
```

### **Step 7: Delete Zustand (5 min)**
```bash
rm store/zustand/stave.store.ts
# Update imports
```

---

## 🗂️ FINAL STRUCTURE (After Migration)

```
stave/
├── store/jotai/
│  ├── core/
│  │  ├── hubs.atoms.ts
│  │  ├── navigation.atoms.ts
│  │  └── index.ts
│  ├── queries/
│  │  ├── hubs.queries.ts
│  │  └── index.ts
│  └── page-scopes/
│     ├── song-page.atoms.ts
│     └── index.ts
├── lib/data/
│  ├── hooks.ts         (All read operations)
│  ├── mutations.ts     (All write operations)
│  └── index.ts
├── store/zustand/
│  └── create-modal.store.ts  (Keep UI modals in Zustand if needed)
└── (rest unchanged)
```

---

## 🎨 NAMING CONVENTIONS

### **Atoms**
- `hubsAtom` - array of items
- `activeHubIdAtom` - single item selector
- `isLoadingAtom` - booleans
- `selectedTabAtom` - UI state
- Suffix: Always `Atom`

### **Derived Atoms**
- `activeHubAtom` - derived from activeHubIdAtom + hubsAtom
- `activeSongsAtom` - derived from activeHubAtom
- Suffix: Also `Atom` (no special prefix)
- Convention: Put in `queries/` folder

### **Hooks**
- `useHubs()` - read hook (returns value)
- `useActiveHub()` - derived read hook
- `useCreateHub()` - mutation hook (returns function)
- `useUpdateHubMeta()` - mutation hook
- Prefix: Always `use`

### **Page-Scoped Factories**
- `createSongPageAtoms()` - factory function
- `SongPageAtoms` - interface for type safety
- Convention: Factory in `page-scopes/`, imported in page components

---

## ✅ COHERENCE CHECKLIST

- [ ] `store/` remains a root-level directory (like components, hooks)
- [ ] `store/jotai/` organizes atoms by concern (core, queries, page-scopes)
- [ ] `lib/data/` contains hooks (abstraction layer)
- [ ] Naming is consistent (atoms, hooks, derived atoms)
- [ ] No atoms imported directly in components
- [ ] All mutations go through `lib/data/mutations.ts`
- [ ] All queries go through `lib/data/hooks.ts`
- [ ] Page-scoped atoms use factory pattern
- [ ] Zustand can be deleted once migration complete

---

## 🚀 READY TO START?

This structure is:
- ✅ Coherent with current architecture
- ✅ Professional grade
- ✅ Scalable (easy to add features)
- ✅ Migration-proof (Zustand → Jotai is gradual)

**Next:** Create the atoms! Ready?

---

**Created:** 2026-02-28
**For:** Stave project architecture decision
**Approved by:** Project team
