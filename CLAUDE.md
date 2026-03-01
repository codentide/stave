# STAVE - Project Context & Architecture Decisions

**Project:** Stave - Music Production Suite
**Status:** MVP Local (Feature Development)
**Stack:** Next.js 16, React 19, TypeScript, Tailwind, Jotai, Zod
**Date:** 2026-02-27

---

## 📌 EXECUTIVE SUMMARY

Stave es una web app para crear, organizar y editar proyectos musicales. Permite gestionar **hubs** (álbumes, EPs, singles) con **canciones** que contienen metadata musical detallada (BPM, tonalidad, estatus, tags, letras).

**Current Phase:** MVP Local (Zustand → Jotai migration underway)
**Next Phase:** Supabase + React Query integration (post-MVP)

---

## 🎯 PROJECT VISION

**Goal:** Professional-grade music composition suite that scales from solo artists to small teams.

**Features Roadmap:**
- ✅ Phase 1 (MVP): Local hub/song/lyric management
- 🚧 Phase 2 (Post-MVP): Supabase backend + collaboration
- 📋 Phase 3: Real-time multiplayer, audio sync, sharing

---

## 🏗️ ARQUITECTURA ACTUAL

### **Stack Tecnológico**

```
Frontend:
├─ Next.js 16.1.6 (App Router, SSR/CSR hybrid)
├─ React 19.2.3 (functional components, hooks)
├─ TypeScript 5 (type safety, DX)
├─ Tailwind CSS 4 (utility-first, design tokens)
├─ Jotai (state management, atoms)
├─ Zod (schema validation)
└─ shadcn/ui + Radix UI (components, accessibility)

Data:
├─ localStorage (MVP local persistence)
├─ Jotai atoms (client-side state)
└─ Zustand (global store - being migrated to Jotai)

Backend (Future):
├─ Supabase (PostgreSQL, Auth, Storage, Realtime)
├─ React Query/TanStack Query (data fetching)
└─ Jotai + atomWithQuery (state-query integration)
```

### **Folder Structure**

```
/components
├─ /ui                  → shadcn base components
├─ /shared              → Custom reusable (EditableText, TagInput, etc)
├─ /features
│  ├─ /song            → SongHeader, SongLyrics, SongCard, etc
│  ├─ /hub             → HubCard, HubHeader, CreateHubModal, etc
│  └─ /audio           → (Placeholder)
├─ /form               → Form fields (HubColorField, HubTypeField)
└─ /providers          → App providers (ThemeProvider)

/lib
├─ /atoms              → Jotai atoms (NEW - migrating from Zustand)
│  ├─ stave.atoms.ts   → Global atoms (hubs, activeHubId)
│  ├─ song-page.atoms.ts → SongPage scoped atoms
│  └─ hub-page.atoms.ts → HubPage scoped atoms
├─ /data               → Data layer (agnostic to backend)
│  ├─ hooks.ts         → useHubs(), useSongs(), etc (abstraction)
│  └─ mutations.ts     → useCreateHub(), useUpdateSongMeta(), etc
├─ /constants          → Static data (SONG_KEYS, TAG_SUGGESTIONS, etc)
├─ /utils              → Helpers (cn, capitalize, date utils, etc)
├─ /stores             → (DEPRECATED - migrating to Jotai atoms)
└─ /types              → Zod schemas + type inference

/hooks
├─ useDebounce.ts      → Debounce hook (EditableText)
└─ useHydrate.ts       → SSR hydration safety

/app                   → Next.js App Router
├─ layout.tsx          → Root layout
├─ dashboard/
│  ├─ layout.tsx       → Dashboard sidebar layout
│  ├─ page.tsx         → Hub list view
│  ├─ [hubId]/
│  │  ├─ page.tsx      → Hub detail view (songs list)
│  │  └─ [songId]/
│  │     └─ page.tsx   → Song detail view (main editing page)

/types
└─ index.ts            → Zod schemas (Hub, Song, LyricSection, etc)
```

---

## 🎨 ARCHITECTURAL DECISIONS & RATIONALE

### **1. Atoms-Based State (Jotai) Instead of Global Store**

**Decision:** Migrate from Zustand global → Jotai atoms

**Why:**
- ✅ Zero boilerplate (atoms are just primitive values)
- ✅ Scope is implicit (no Context provider needed)
- ✅ Composable (derived atoms are simple)
- ✅ Scales to Supabase cleanly (atomWithQuery)
- ✅ Performant (granular subscriptions)

**Trade-off:** New pattern to learn (but minimal)

**Future-Proof:** When migrating to Supabase, switch from `atom(value)` to `atomWithQuery()` with zero component changes.

---

### **2. Data Layer Abstraction (Hooks for Future Flexibility)**

**Decision:** All data access via `lib/data/hooks.ts` and `lib/data/mutations.ts`

**Why:**
- ✅ Components don't know if data is from localStorage, Zustand, or Supabase
- ✅ Single point to change backend (POST-MVP)
- ✅ Type-safe queries and mutations
- ✅ Easier to add React Query later

**Current Implementation:**
```typescript
// lib/data/hooks.ts
export const useHubs = () => {
  const [hubs] = useAtom(hubsAtom)  // ← Jotai
  return hubs
}

// Future (with Supabase):
export const useHubs = () => {
  const { data } = useQuery(['hubs'], fetchFromSupabase)  // ← React Query
  return data || []
}

// Components: ZERO changes 🎉
```

---

### **3. URL as Source of Truth for Navigation**

**Decision:** URLs contain `[hubId]` and `[songId]` params

**Why:**
- ✅ Bookmarkable links
- ✅ Browser back/forward works
- ✅ Shareable (future)
- ✅ SEO-ready (future SSR)
- ✅ Clear information architecture

**How It Works:**
```
/dashboard                → List all hubs
/dashboard/abc123         → Hub detail (abc123)
/dashboard/abc123/song456 → Song detail (abc123, song456)
```

---

### **4. Scoped Atoms for Page-Local State**

**Decision:** SongPage, HubPage create their own atom instances

**Why:**
- ✅ Isolated state (no pollution of global)
- ✅ Automatic cleanup on unmount
- ✅ Independent instances (two SongPages don't interfere)
- ✅ Simple to reason about

**Example:**
```typescript
// SongPage creates its own atoms
const atoms = createSongPageAtoms(hubId, hubColor, songId)

// SongHeader and SongLyrics access via atoms prop
<SongHeader atoms={atoms} />
<SongLyrics atoms={atoms} />
```

---

### **5. Component Prop Strategy: Minimal Props**

**Decision:** Pass only what component renders + atoms for context

**Why:**
- ✅ No prop drilling (atoms provide context)
- ✅ Clear dependencies (props are visible)
- ✅ Composable (easy to reuse in different contexts)
- ✅ Testable (minimal mocks needed)

**Pattern:**
```typescript
// ✅ Good - Minimal explicit props
<SongHeader song={song} atoms={atoms} />

// ❌ Avoid - Props drilling
<SongHeader
  song={song}
  hubId={hubId}
  hubColor={hubColor}
  onUpdate={handleUpdate}
  canEdit={canEdit}
/>
```

---

### **6. Debounced Edits for Performance**

**Decision:** EditableText uses 600ms debounce before mutation

**Why:**
- ✅ Fewer mutations (API calls post-Supabase)
- ✅ Better UX (smooth typing)
- ✅ Prevents thundering herd
- ✅ Responsive UI (local state updates instantly)

**Implementation:**
```typescript
const [text, setText] = useState(value)
const debouncedText = useDebounce(text, 600)

useEffect(() => {
  if (debouncedText !== value) {
    onChange(debouncedText)  // ← Mutation happens here
  }
}, [debouncedText])
```

---

### **7. Validation Centralized in Components**

**Decision:** Zod schemas in `/types`, validation logic in components

**Why:**
- ✅ Single source of truth (Zod schema)
- ✅ Type inference (TS knows validated types)
- ✅ Easy to reuse in backend (POST-Supabase)
- ✅ Clear validation rules per domain

**Example:**
```typescript
// types/index.ts
export const HubSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string(),
  // ...
})

// components/features/hub/HubHeader.tsx
const parsed = HubSchema.partial().safeParse(updates)
if (!parsed.success) {
  console.error('Validation failed:', parsed.error)
  return
}
```

---

## 📊 DATA FLOW ARCHITECTURE

### **Request → Response Cycle**

```
USER INPUT (SongHeader.tsx)
    ↓
EditableText onChange + debounce
    ↓
useUpdateSongMeta(hubId, songId, { title: newValue })
    ↓
Jotai atom setter:
├─ Update hubsAtom in memory
└─ localStorage auto-persists (atomWithStorage)
    ↓
Jotai subscribers re-render:
├─ SongPage (reads from hubsAtom)
├─ Dashboard (reads from hubsAtom)
├─ Sidebar (reads from hubsAtom)
└─ (any component using hubsAtom)
    ↓
✅ UI Updates across app
```

### **Post-Supabase (Same API, Different Plumbing):**

```
USER INPUT (SongHeader.tsx)  ← SAME
    ↓
useUpdateSongMeta(hubId, songId, { title })  ← SAME API
    ↓
useMutation → Supabase.updateSong()  ← DIFFERENT IMPLEMENTATION
    ↓
Supabase sends response
    ↓
React Query invalidates cache
    ↓
atomWithQuery re-fetches + updates atom
    ↓
Components re-render  ← SAME
    ↓
✅ UI Updates (from Supabase data)
```

---

## 🚀 MIGRATION TIMELINE & PHASES

### **Phase 1: MVP Local (Current)**
**Duration:** 1-2 weeks
**Scope:**
- ✅ Hub CRUD (CREATE, UPDATE, DELETE)
- ✅ Song CRUD
- ✅ Lyric editing (sections)
- ✅ Metadata editing (title, BPM, key, status, tags)
- ✅ Local persistence (localStorage)
- ✅ Tag suggestions system
- ✅ Debounced edits
- 🚧 Audio player (basic)
- 🚧 Export/Import JSON

**Deliverable:** Fully functional music app for local use

---

### **Phase 2: Supabase Backend (Post-MVP)**
**Duration:** 3-5 days
**Scope:**
- [ ] Setup Supabase project
- [ ] Create PostgreSQL tables (hubs, songs, lyrics)
- [ ] Migrate data layer: Jotai atoms → atomWithQuery
- [ ] Add React Query for server-side caching
- [ ] Setup Supabase auth (future: multi-user)
- [ ] Move file storage to Supabase Storage

**Deliverable:** App synced with cloud database

**Key:** Zero component changes (data layer abstraction pays off)

---

### **Phase 3: Collaboration & Advanced (Future)**
**Duration:** TBD
**Scope:**
- [ ] Realtime multiplayer (Supabase listeners)
- [ ] User authentication & sharing
- [ ] Audio upload/streaming
- [ ] Revision history
- [ ] Comments/feedback system

---

## 📋 KEY FILES TO UNDERSTAND

**Critical for Development:**
- `app/dashboard/[hubId]/[songId]/page.tsx` - SongPage (main editing)
- `components/features/song/SongHeader.tsx` - Metadata editing
- `components/features/song/SongLyrics.tsx` - Lyric sections
- `lib/atoms/stave.atoms.ts` - Global state (Jotai)
- `lib/atoms/song-page.atoms.ts` - Scoped state factory
- `lib/data/hooks.ts` - Data access abstraction
- `types/index.ts` - Zod schemas (single source of truth)

**Design System:**
- `lib/constants/` - Colors, keys, tags, form constants
- `docs/DESIGN_TOKENS.md` - Design system documentation
- `components/ui/` - shadcn base components

**Planning & Architecture:**
- `JOTAI_MIGRATION.md` - Step-by-step Jotai implementation
- `MIGRATION_PLAN.md` - Supabase migration strategy
- `ZUSTAND_SCOPED_STRATEGY.md` - (Deprecated - replaced by Jotai)

---

## ⚙️ DEVELOPER WORKFLOW

### **Starting a Task**
1. Pick a task from TODO or GitHub issues
2. Create a feature branch: `git checkout -b feature/thing`
3. Understand the component/page it affects
4. Check if data layer exists (lib/data/hooks.ts)
5. Code in feature branch
6. Test locally: `npm run dev`
7. Commit: `git commit -m "feature: description"`
8. Create PR for review

### **Adding a Feature (General Pattern)**
1. **Define schema** (types/index.ts)
2. **Add data hook** (lib/data/hooks.ts or lib/atoms/*.ts)
3. **Create/update atom** (lib/atoms/*.ts)
4. **Build component** (components/features/*.tsx)
5. **Wire up mutations** (lib/data/mutations.ts)
6. **Test end-to-end**

### **Debugging**
- Check browser DevTools → Console (Zod parse errors, etc)
- Check `localStorage` for data persistence
- Use React DevTools to inspect atom state
- Check component re-renders (why did it re-render?)

---

## 🔍 CODE STANDARDS

### **TypeScript**
- ✅ Always use strict types (no `any`)
- ✅ Define interfaces for component props
- ✅ Use Zod for runtime validation
- ✅ Type derived atoms with generics

### **Component Design**
- ✅ One component per file (unless internal)
- ✅ Props interface first
- ✅ Minimal props (avoid drilling)
- ✅ Use atoms for cross-component data
- ✅ No direct Zustand imports (use data layer)

### **Styling**
- ✅ Tailwind classes only (no inline styles)
- ✅ Use design tokens (colors from constants)
- ✅ Responsive mobile-first
- ✅ No `!important` hacks

### **Performance**
- ✅ Memo components if they re-render unnecessarily
- ✅ useCallback for callbacks passed to memoized components
- ✅ Lazy load routes with `next/dynamic` if needed
- ✅ Debounce expensive operations

### **Comments**
- ✅ Add comments for non-obvious logic
- ✅ Explain WHY, not WHAT
- ✅ Keep comments up-to-date

---

## 📚 USEFUL COMMANDS

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build           # Build for production
npm run lint            # ESLint check
npm run type-check      # TypeScript check

# Testing (when setup)
npm run test           # Run tests
npm run test:watch    # Watch tests

# Git
git checkout -b feature/name   # Create branch
git commit -m "type: description"  # Commit
git push origin feature/name    # Push
gh pr create            # Create PR
```

---

## 🎓 LEARNING RESOURCES

**For This Project:**
- [Next.js App Router Docs](https://nextjs.org/docs)
- [Jotai Documentation](https://jotai.org/)
- [React Query (TanStack Query)](https://tanstack.com/query/latest)
- [Zod Schema Validation](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)

**For Future (Post-Supabase):**
- [Supabase Docs](https://supabase.com/docs)
- [React Query + Supabase](https://makerkit.dev/blog/saas/supabase-react-query)
- [Jotai + React Query Integration](https://jotai.org/docs/extensions/query)

---

## 🐛 KNOWN ISSUES & TODOs

### **Current Blockers**
- [ ] SongLyrics `updateSongLyrics()` not fully implemented
- [ ] Audio player (placeholder only)
- [ ] Export/Import JSON (not started)

### **Technical Debt**
- [ ] Remove old Zustand store once Jotai migration complete
- [ ] Create unit tests for hooks
- [ ] Add E2E tests for critical flows
- [ ] Optimize re-renders with React DevTools Profiler

### **Future Improvements**
- [ ] Add keyboard shortcuts (Vim mode, etc)
- [ ] Dark mode polish
- [ ] Offline-first with Service Workers
- [ ] Better error boundaries

---

## 🤝 COLLABORATION NOTES

**Communication:**
- Tag `@me` in PRs for feedback
- Describe your changes in PR body
- Link related issues

**Code Review Checklist:**
- [ ] Types are correct (no `any`)
- [ ] Props are minimal
- [ ] No prop drilling
- [ ] Uses atoms/data layer (not direct store imports)
- [ ] Responsive design considered
- [ ] No console errors/warnings
- [ ] Commit message is clear

**Pair Programming:**
- Use VS Code LiveShare for real-time editing
- Share context first (this document)
- Test together before commit

---

## 📈 SUCCESS METRICS

**MVP Complete When:**
- ✅ Create/edit/delete hubs
- ✅ Create/edit/delete songs
- ✅ Edit metadata (title, BPM, key, status, tags)
- ✅ Edit lyrics (sections)
- ✅ Data persists across sessions
- ✅ UI is responsive and intuitive
- ✅ No console errors
- ✅ Load time < 1 second

**Post-Supabase Ready When:**
- ✅ All data layer abstractions in place
- ✅ Jotai atoms fully tested
- ✅ No Zustand imports remaining
- ✅ Performance benchmarked

---

## 🎉 FINAL NOTES

This is an ambitious project. The architecture decisions made here (atoms, data layer abstraction, URL-driven navigation) will serve us well as we grow from MVP to collaboration suite.

**Core Principle:** Keep components dumb, atoms simple, and the data layer flexible.

When in doubt, refer back to this document and the pattern of how things are structured. The consistency is what makes this codebase maintainable.

---

**Last Updated:** 2026-02-27
**Maintained By:** Development team
**Questions?** Check the linked documents or the code itself (it's designed to be readable)
