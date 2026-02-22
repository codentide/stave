# SONG PAGE: SCOPED ATOMS (LOCAL STATE)

**Lo que hace SongPage especial:** Usa atoms **locales a la página**, no globales.

---

## 🎯 PROBLEMA: Por qué necesitamos atoms scoped

### **Situación actual (Zustand global):**

SongHeader necesita `hubId` y `hubColor` para editar la canción. ¿De dónde los obtiene?

```typescript
// components/features/song/SongHeader.tsx
const hubs = useHubs()  // ← Lee TODOS los hubs desde global
const hub = hubs.find((h) => h.id === content.hubId)  // ← Busca el hub
const { id: hubId, color: hubColor } = hub  // ← Extrae lo que necesita
```

**Problema:**
- ❌ Lee datos innecesarios (todos los hubs)
- ❌ Búsqueda redundante (cada render)
- ❌ Si hubs cambian, SongHeader re-renderiza aunque el hub específico no cambió

### **Solución: Atoms scoped (Jotai)**

SongPage crea atoms locales con los datos que SongHeader necesita:

```typescript
// app/dashboard/[hubId]/[songId]/page.tsx
const atoms = useMemo(
  () => createSongPageAtoms(hub.id, hub.color, song.id),
  [hub.id, hub.color, song.id]
)

return (
  <SongHeader content={song} atoms={atoms} />  // ← Pasa atoms como prop
  <SongLyrics songId={song.id} atoms={atoms} />
)
```

**Ventaja:**
- ✅ Datos específicos, no globales
- ✅ Sin búsqueda redundante
- ✅ Auto-limpieza al desmontar la página
- ✅ Múltiples SongPages no interfieren

---

## 📊 ESTRUCTURA DE ATOMS SCOPED

### **Lo que contienen:**

```typescript
// atoms/page-scopes/song-page.atoms.ts
export const createSongPageAtoms = (
  hubId: string,
  hubColor: string,
  songId: string
) => ({
  pageHubIdAtom: atom<string>(hubId),              // ← Hub ID de esta página
  pageHubColorAtom: atom<string>(hubColor),        // ← Color de este hub
  pageSongIdAtom: atom<string>(songId),            // ← Song ID de esta página
  isEditingLyricsAtom: atom<boolean>(false),       // ← UI state local
  editingSectionIdAtom: atom<string | null>(null), // ← Qué sección está editando
})
```

**Diferencia con atoms globales:**
- Globales (`hubsAtom`, `activeHubIdAtom`): Persistentes, compartidas por toda la app
- Scoped (`pageHubIdAtom`, `isEditingLyricsAtom`): Temporales, locales a esta página

---

## 🔄 FLUJO COMPLETO: Cómo funciona

### **PASO 1: SongPage se monta**

```typescript
// app/dashboard/[hubId]/[songId]/page.tsx
export default function SongPage() {
  const { hubId, songId } = useParams()
  const hubs = useHubs()

  const hub = hubs.find((h) => h.id === hubId)      // ← Busca UNA VEZ
  const song = hub?.songs.find((s) => s.id === songId)

  // ✅ Crear atoms scoped con los datos específicos
  const atoms = useMemo(
    () => createSongPageAtoms(hub.id, hub.color, song.id),
    [hub.id, hub.color, song.id]
  )

  return (
    <SongHeader content={song} atoms={atoms} />
    <SongLyrics songId={song.id} atoms={atoms} />
  )
}
```

**¿Por qué useMemo?**
- Atoms creados UNA VEZ y reutilizados
- Si atoms recreadas cada render = pérdida de performance
- useMemo garantiza estabilidad

---

### **PASO 2: SongHeader recibe atoms**

```typescript
// components/features/song/SongHeader.tsx
interface Props {
  content: Song
  atoms: SongPageAtoms  // ← Recibe atoms scoped
}

export const SongHeader = ({ content, atoms }: Props) => {
  // ✅ Lee de atoms en lugar de buscar en global
  const [hubId] = useAtom(atoms.pageHubIdAtom)
  const [hubColor] = useAtom(atoms.pageHubColorAtom)

  const updateSongMeta = useUpdateSongMeta()

  // Ahora hubId y hubColor están listos, sin búsqueda
  const handleUpdateTitle = (newTitle: string) => {
    updateSongMeta(hubId, content.id, { title: newTitle })
  }

  // ... resto del componente
}
```

**¿Qué cambió vs antes?**

**ANTES (Zustand global):**
```typescript
const hubs = useHubs()
const hub = hubs.find((h) => h.id === content.hubId)
const { id: hubId, color: hubColor } = hub
```

**DESPUÉS (Jotai scoped):**
```typescript
const [hubId] = useAtom(atoms.pageHubIdAtom)
const [hubColor] = useAtom(atoms.pageHubColorAtom)
```

**Ventaja:** Directo, sin búsqueda.

---

### **PASO 3: SongLyrics recibe atoms**

```typescript
// components/features/song/SongLyrics.tsx
interface Props {
  songId: Song['id']
  atoms: SongPageAtoms  // ← Recibe atoms scoped
  items: LyricSection[]
}

export const SongLyrics = ({ songId, atoms, items }: Props) => {
  // ✅ Lee de atoms
  const [hubId] = useAtom(atoms.pageHubIdAtom)
  const [isEditing, setIsEditing] = useAtom(atoms.isEditingLyricsAtom)
  const [editingId, setEditingId] = useAtom(atoms.editingSectionIdAtom)

  const updateSongLyrics = useUpdateSongLyrics()

  const handleAddLyric = (section: LyricSection) => {
    updateSongLyrics(hubId, songId, [...items, section])
  }

  // ... resto del componente
}
```

**¿Qué cambió?**

**ANTES:**
```typescript
interface Props {
  hubId: string        // ← Prop drilling
  songId: string
  items: LyricSection[]
}
const { updateSongLyrics } = useStaveActions()
```

**DESPUÉS:**
```typescript
interface Props {
  songId: string
  atoms: SongPageAtoms  // ← Atoms scoped en lugar de hubId prop
  items: LyricSection[]
}
const [hubId] = useAtom(atoms.pageHubIdAtom)
const updateSongLyrics = useUpdateSongLyrics()
```

**Ventaja:** No necesitamos pasar hubId como prop. Está en el atom.

---

## 🎨 VISUAL: Cómo los atoms scoped evitan prop drilling

### **CON PROP DRILLING (Zustand):**
```
SongPage
├─ hubId prop ──────────┐
├─ songId prop ─────────┼──> SongHeader
├─ hubColor prop ───────┤
└─ items prop ──────────┼──> SongLyrics
                        └─ (necesita hubId desde SongPage)
```

### **CON ATOMS SCOPED (Jotai):**
```
SongPage
├─ createSongPageAtoms()
│  ├─ pageHubIdAtom
│  ├─ pageHubColorAtom
│  └─ pageHubColorAtom
│
├─ <SongHeader atoms={atoms} />
│  └─ [hubId, hubColor] = useAtom(atoms)
│
└─ <SongLyrics atoms={atoms} />
   └─ [hubId] = useAtom(atoms)
```

**Diferencia:**
- Prop drilling: Pasas props por niveles de componentes
- Atoms scoped: Componentes leen directamente del atom

---

## ✅ CHECKLIST: Migración SongPage

### **SongPage Component:**
- [ ] Import `createSongPageAtoms` desde `@/atoms`
- [ ] Cambiar `useHubs()` a import de `@/atoms`
- [ ] Crear `atoms` con `useMemo` + `createSongPageAtoms()`
- [ ] Pasar `atoms={atoms}` a SongHeader y SongLyrics

### **SongHeader Component:**
- [ ] Cambiar `Props` para recibir `atoms: SongPageAtoms`
- [ ] Cambiar imports de `@/store/stave.store` a `@/atoms`
- [ ] Reemplazar `useHubs().find()` con `useAtom(atoms.pageHubIdAtom)`
- [ ] Reemplazar `useStaveActions()` con `useUpdateSongMeta`, `useDeleteSong`
- [ ] Remover búsqueda de hub (ya no necesaria)

### **SongLyrics Component:**
- [ ] Cambiar `Props` para recibir `atoms: SongPageAtoms`
- [ ] Cambiar imports de `@/store/stave.store` a `@/atoms`
- [ ] Reemplazar `hubId` prop con `useAtom(atoms.pageHubIdAtom)`
- [ ] Reemplazar `useStaveActions()` con `useUpdateSongLyrics`
- [ ] Agregar `isEditing` y `editingId` atoms si se necesitan

---

## 🚀 KEY INSIGHT

**Zustand:** Context provider + scoped store (boilerplate)
```
<SongPageStoreProvider store={store}>
  <SongHeader />  ← Accede via useSongPageStore()
</SongPageStoreProvider>
```

**Jotai:** Atoms como props (simple)
```
<SongHeader atoms={atoms} />  ← Atoms directo en props
  useAtom(atoms.pageHubIdAtom)
```

**Ventaja de Jotai:** Atoms no necesitan Context. Son valores, no behaviors.

---

**Ready to implement?**
