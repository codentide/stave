# MIGRACIÓN DASHBOARD: Zustand → Jotai (PASO A PASO)

**Objetivo:** Entender EXACTAMENTE qué cambia y por qué

---

## 🎯 FLUJO ACTUAL (Zustand)

```
1. Dashboard.tsx monta
   ├─ useHubs() → lee hubsAtom de Zustand
   └─ useStaveActions() → obtiene { setActiveHubId, createHub }

2. User hace click en HubCard
   ├─ onClick → setActiveHubId(hubId)
   └─ Zustand actualiza state.activeHubId

3. User hace click en "Nuevo Hub"
   ├─ openCreateHubModal() → abre modal en Zustand
   └─ CreateHubModal monta

4. User llena formulario y hace click "Crear Hub"
   ├─ createHub({ name, type, color })
   ├─ Zustand: set({ hubs: [newHub, ...state.hubs], activeHubId: newHub.id })
   ├─ localStorage se actualiza (persist middleware)
   └─ Dashboard se re-renderiza con el nuevo hub

```

---

## 🔄 FLUJO NUEVO (Jotai)

```
1. Dashboard.tsx monta
   ├─ useHubs() → lee hubsAtom de Jotai
   └─ useSetActiveHubId() → obtiene función para actualizar activeHubIdAtom

2. User hace click en HubCard
   ├─ onClick → setActiveHubId(hubId)
   └─ Jotai actualiza activeHubIdAtom (en memoria)

3. User hace click en "Nuevo Hub"
   ├─ openCreateHubModal() → abre modal en Zustand (sin cambios)
   └─ CreateHubModal monta

4. User llena formulario y hace click "Crear Hub"
   ├─ useCreateHub() → llama setHubs([newHub, ...prev])
   ├─ Jotai notifica a todos los componentes que usan hubsAtom
   ├─ atomWithStorage auto-persiste en localStorage
   └─ Dashboard se re-renderiza automáticamente

```

---

## 📊 COMPARACIÓN LINEA POR LINEA

### **DASHBOARD.TSX**

#### ZUSTAND (ACTUAL):
```typescript
'use client'

import { useHubs, useStaveActions } from '@/store/stave.store'

export default function DashboardPage() {
  // Leer hubs + leer acciones (TODO junto)
  const hubs = useHubs() || []
  const { setActiveHubId } = useStaveActions()  // ← Desestructurar acciones

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {hubs.map((hub) => (
        <HubCard
          key={hub.id}
          content={hub}
          onClick={() => setActiveHubId(hub.id)}  // ← Llamar acción
        />
      ))}
      {hubs.length < 12 && (
        <EmptyHubCardState onCreate={openCreateHubModal} />
      )}
    </div>
  )
}
```

#### JOTAI (NUEVO):
```typescript
'use client'

import { useHubs, useSetActiveHubId } from '@/atoms'

export default function DashboardPage() {
  // Leer hubs + leer acción (separadas, pero importadas de @/atoms)
  const hubs = useHubs() || []
  const setActiveHubId = useSetActiveHubId()  // ← Hook que retorna función

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {hubs.map((hub) => (
        <HubCard
          key={hub.id}
          content={hub}
          onClick={() => setActiveHubId(hub.id)}  // ← Llamar función (igual)
        />
      ))}
      {hubs.length < 12 && (
        <EmptyHubCardState onCreate={openCreateHubModal} />
      )}
    </div>
  )
}
```

**¿QUÉ CAMBIÓ?**
- ✅ Import: `@/store/stave.store` → `@/atoms`
- ✅ Hook para setear: `useStaveActions().setActiveHubId` → `useSetActiveHubId()`
- ✅ El resto es IDÉNTICO

**¿POR QUÉ?**
- En Zustand: Todas las acciones están en UN objeto (`useStaveActions()`)
- En Jotai: Cada acción es un hook separado (`useSetActiveHubId()`)
- **Ventaja:** Más granular, más fácil de encontrar qué hook hace qué

---

### **CREATE HUB MODAL**

#### ZUSTAND (ACTUAL):
```typescript
'use client'

import { useStaveActions } from '@/store/stave.store'

export const CreateHubModal = ({ onOpenChange }: Props) => {
  const [formData, setFormData] = useState<createHubInput>(initalFormData)

  // Obtener TODAS las acciones
  const { createHub } = useStaveActions()  // ← Una acción de muchas
  const { close } = useCreateModalActions()

  const handleSubmit = () => {
    // Llamar acción para crear
    const newHub = createHub({
      name: formData.name,
      type: formData.type,
      color: formData.color,
    })  // ← Retorna el nuevo hub

    console.debug('[NUEVO-HUB]:', newHub)
    handleOpenChange()
  }

  // ... resto del JSX
}
```

#### JOTAI (NUEVO):
```typescript
'use client'

import { useCreateHub } from '@/atoms'

export const CreateHubModal = ({ onOpenChange }: Props) => {
  const [formData, setFormData] = useState<createHubInput>(initalFormData)

  // Obtener SOLO la acción que necesitamos
  const createHub = useCreateHub()  // ← Hook específico
  const { close } = useCreateModalActions()  // ← Sin cambios (Zustand)

  const handleSubmit = () => {
    // Llamar acción para crear
    const newHub = createHub({
      name: formData.name,
      type: formData.type,
      color: formData.color,
    })  // ← Retorna el nuevo hub (igual)

    console.debug('[NUEVO-HUB]:', newHub)
    handleOpenChange()
  }

  // ... resto del JSX
}
```

**¿QUÉ CAMBIÓ?**
- ✅ Import: `useStaveActions` → `useCreateHub` (específico)
- ✅ Desestructuración: `{ createHub } = useStaveActions()` → `useCreateHub()`
- ✅ El resto es IDÉNTICO

**¿POR QUÉ?**
- En Zustand: Pides TODO (`useStaveActions()`) y desestructuras lo que necesitas
- En Jotai: Pides SOLO lo que necesitas (`useCreateHub()`)
- **Ventaja:** Menos boilerplate, más transparente

---

## 🧠 EXPLICACIÓN: POR QUÉ FUNCIONA

### **En Zustand:**
```typescript
const useStaveStore = create((set, get) => ({
  hubs: [],
  activeHubId: null,
  actions: {
    setActiveHubId: (id) => set({ activeHubId: id }),
    createHub: (input) => {
      const newHub = { ... }
      set({ hubs: [newHub, ...get().hubs], activeHubId: newHub.id })
      return newHub
    },
    // ... 9 más acciones
  }
}))

// Componente pide TODAS las acciones
const { createHub, setActiveHubId, ... } = useStaveActions()
```

**Problema:** Todo en un lugar. Si necesitas una acción, importas TODO.

---

### **En Jotai:**
```typescript
// atoms/core/hubs.atoms.ts
const hubsAtom = atomWithStorage<Hub[]>('stave-hubs', [])
const activeHubIdAtom = atom<string | null>(null)

// atoms/actions/hubs.actions.ts
const useCreateHub = () => {
  const [hubs, setHubs] = useAtom(hubsAtom)  // ← Lee + escribe hubsAtom
  const setActiveHubId = useSetAtom(activeHubIdAtom)  // ← Solo escribe

  return (input) => {
    const newHub = { ... }
    setHubs([newHub, ...hubs])            // ← Actualiza hubsAtom
    setActiveHubId(newHub.id)             // ← Actualiza activeHubIdAtom
    return newHub
  }
}

// Componente pide SOLO lo que necesita
const createHub = useCreateHub()
```

**Ventaja:** Cada hook es independiente. Importas solo lo que necesitas.

---

## 🔄 CICLO COMPLETO: User flow

### **Paso 1: Dashboard carga**

**ZUSTAND:**
```
useHubs() → lee Zustand store.hubs → retorna array
Dashboard renderiza cards
```

**JOTAI:**
```
useHubs() → lee hubsAtom (Jotai) → retorna array
Dashboard renderiza cards
(Functiona igual, fuente diferente)
```

---

### **Paso 2: User hace click en "Nuevo Hub"**

**ZUSTAND:**
```
openCreateHubModal()
→ Zustand (create-modal.store) → isOpen = true
→ CreateHubModal monta
```

**JOTAI:**
```
openCreateHubModal()
→ Zustand (create-modal.store) → isOpen = true  (SIN CAMBIOS)
→ CreateHubModal monta
```

**Nota:** El modal sigue usando Zustand porque es UI local. OK.

---

### **Paso 3: User llena form y hace click "Crear Hub"**

**ZUSTAND:**
```
createHub({ name, type, color })
  ↓
Zustand: set({
  hubs: [newHub, ...state.hubs],     ← Actualiza array
  activeHubId: newHub.id              ← Actualiza selección
})
  ↓
localStorage se actualiza (persist middleware)
  ↓
Zustand notifica suscriptores
  ↓
Dashboard se re-renderiza (useHubs vuelve a leer)
```

**JOTAI:**
```
createHub({ name, type, color })
  ↓
Jotai: setHubs([newHub, ...hubs])     ← Actualiza hubsAtom
       setActiveHubId(newHub.id)      ← Actualiza activeHubIdAtom
  ↓
atomWithStorage persiste automáticamente en localStorage
  ↓
Jotai notifica suscriptores
  ↓
Dashboard se re-renderiza (useHubs vuelve a leer)
```

**Resultado:** IDÉNTICO. Solo cambió la plumería interna.

---

## 🎯 LO MÁS IMPORTANTE

### **Zustand:**
```
"Tengo un STORE con ESTADO y ACCIONES"
useStaveStore() → obtengo TODO → desestructuro lo que necesito
```

### **Jotai:**
```
"Tengo ATOMS (valores) y HOOKS (lectura/escritura)"
useHubs() → obtengo solo hubs
useSetActiveHubId() → obtengo función para cambiar ID
useCreateHub() → obtengo función para crear hub
```

**La diferencia es FILOSÓFICA:**
- Zustand: "Aquí está tu store, toma lo que necesites"
- Jotai: "Aquí está exactamente lo que pediste"

---

## ✅ CHECKLIST MIGRACIÓN DASHBOARD

- [ ] **Dashboard.tsx**
  - [ ] Cambiar import de `@/store/stave.store` a `@/atoms`
  - [ ] `useHubs()` funciona igual
  - [ ] `useSetActiveHubId()` reemplaza `useStaveActions().setActiveHubId`

- [ ] **CreateHubModal.tsx**
  - [ ] Cambiar import de `useStaveActions` a `useCreateHub`
  - [ ] `createHub` funciona igual
  - [ ] Modal state sigue en Zustand (OK)

- [ ] **Verificar:**
  - [ ] Hubs se cargan al abrir Dashboard
  - [ ] Click en hub cambia activeHubId
  - [ ] Modal abre al hacer click "Nuevo Hub"
  - [ ] Crear hub funciona
  - [ ] Nuevo hub aparece en Dashboard
  - [ ] localStorage se actualiza

---

## 🚀 SIGUIENTE: Implementación

Ready para refactorizar los componentes?

