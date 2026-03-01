# STAVE - TODO List (Post-MVP)

## 🎯 Status: MVP LOCAL COMPLETO ✅

**MVP Achievements:**
- ✅ Hub CRUD (Create, Read, Update, Delete)
- ✅ Song CRUD
- ✅ Metadata editing (title, BPM, key, status, tags)
- ✅ Lyrics editing (sections)
- ✅ Cover image upload (Data URL)
- ✅ Export lyrics to .txt
- ✅ Data persistence (localStorage)
- ✅ Error boundaries
- ✅ Input validation (Zod)
- ✅ Performance optimization (memoization, debouncing)

---

## 📋 PRÓXIMAS TAREAS

### 🔴 ALTOS (Important Performance & UX)

#### 1. Memoize Grid/List Components
- **Files:** `components/features/hub/HubCard.tsx`, `components/shared/Sidebar.tsx`
- **Impact:** 30-50% performance improvement in navigation
- **What:** Add `React.memo()` to both components
- **Why:** Always-visible/grid components re-render unnecessarily
- **Time:** 5 min

#### 2. Memoize onChange Handlers
- **Files:** `components/features/song/SongHeader.tsx` (lines 113-114, 140-142, 157-159)
- **Impact:** Prevents debounce timer reset, smoother editing
- **What:** Wrap inline `onChange` functions with `useCallback`
- **Why:** New function reference each render → EditableText useEffect re-runs
- **Time:** 10 min

#### 3. Fix Variable Naming Consistency
- **File:** `components/features/hub/HubHeader.tsx:43`
- **Issue:** `BreadcrumbItems` uses PascalCase (implies component, not data)
- **Fix:** Rename to `breadcrumbItems` (camelCase)
- **Also:** `createHubInput` → `CreateHubInput` in types
- **Time:** 2 min

#### 4. Remove Debug Logs
- **Files:**
  - `components/features/hub/CreateHubModal.tsx:71` - `console.debug('[NUEVO-HUB]:', newHub)`
  - `components/form/Form.tsx:15` - `console.debug('[FORM-COMPONENT]', data)`
- **Fix:** Remove or wrap with `if (process.env.NODE_ENV === 'development')`
- **Time:** 2 min

---

### 🟡 MEDIANOS (Nice-to-Have, Before Production)

#### 5. Image Optimization
- **Files:** `components/features/song/SongCard.tsx:112`, `SongHeader.tsx:234`
- **Issue:** Using `<img>` instead of `next/image` Image
- **Impact:** Better LCP, automatic optimization, responsive images
- **What:** Replace `<img>` with `Image` from `next/image`
- **Note:** Requires `width` and `height` props
- **Time:** 15 min

#### 6. Error Handling in Mutations
- **Files:** `atoms/features/hub/hub.actions.ts`, `atoms/features/song/song.actions.ts`
- **What:** Add try-catch for localStorage operations
- **Why:** Storage quota exceeded, disabled storage, privacy mode
- **Example:**
  ```typescript
  try {
    setHubs(...)
  } catch (error) {
    console.error('Failed to save:', error)
    throw new Error('Could not save changes')
  }
  ```
- **Time:** 10 min

#### 7. Atom Subscription Optimization
- **Current:** Single `hubsAtom` causes cascade re-renders
- **Future:** Consider split atoms or derived selectors
- **When:** Post-MVP, if performance issues arise
- **Time:** Not critical now

---

### 🟢 BAJOS (Nice-to-Have, Low Priority)

#### 8. Extract SongCover Component
- **File:** `components/features/song/SongHeader.tsx:180-270`
- **What:** Move private `SongCover` component to separate file (optional)
- **Why:** Keep SongHeader smaller, reusable if needed
- **Status:** Works fine as-is, not urgent
- **Time:** 5 min

#### 9. Remove Dead Code
- **File:** `components/ui/combobox.tsx` - 319 lines, never used
- **What:** Remove from exports and delete file
- **Impact:** Small bundle size reduction
- **Time:** 2 min

#### 10. Integrate SongReferences
- **File:** `app/dashboard/[hubId]/[songId]/page.tsx:46` (commented out)
- **Status:** Feature incomplete, schema ready
- **Time:** 20 min (if implementing)

#### 11. Fix Comment Typos
- **File:** `components/features/hub/HubHeader.tsx:85`
- **Issue:** `{/* [ ]: Crear updatedAd */}` - incomplete and typo
- **Also:** "createdAt" shows as both created and updated
- **Time:** 2 min

---

## 📈 PERFORMANCE METRICS (Current)

| Component | Lines | Status | Optimized |
|-----------|-------|--------|-----------|
| SongCard | 141 | ✅ Memo'd | Yes |
| SongCollection | 34 | ✅ Direct render | Yes |
| HubCard | ~100 | ❌ Needs memo | No |
| Sidebar | 152 | ❌ Needs memo | No |
| SongHeader | 284 | ⚠️ Needs useCallback | Partial |

---

## 🚀 RECOMMENDED WORKFLOW

### This Week (Performance Polish)
1. ✅ Memoize HubCard + Sidebar
2. ✅ Fix variable naming
3. ✅ Add useCallback to SongHeader
4. ✅ Remove console.debug

### Next Week (Polish Before Production)
5. Image optimization
6. Error handling in mutations
7. Code cleanup (dead code, typos)

### Post-MVP (Future)
8. Supabase integration (atomWithQuery)
9. React Query setup
10. Real-time collaboration
11. Audio player
12. Offline support

---

## 📚 USEFUL REFERENCES

- See `CLAUDE.md` for architecture decisions
- See `JOTAI_MIGRATION.md` for state management pattern
- See `MIGRATION_PLAN.md` for Supabase roadmap

---

**Last Updated:** 2026-03-01
**Status:** MVP Local Complete, Post-MVP tasks identified
