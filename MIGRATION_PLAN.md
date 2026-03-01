# STAVE - Post-MVP Migration Plan

## Decisión Arquitectónica
- **Fase 1 (Ahora):** Zustand + localStorage (MVP local)
- **Fase 2 (Post-MVP):** Supabase + React Query (con data layer agnóstica)
- **Filosofía:** Componentes nunca cambian, solo la implementación de hooks

---

## Requisitos para Migración

✅ SongLyrics completado y funcional
✅ Audio player básico implementado
✅ Export/Import JSON funcionando
✅ UX pulida y sin bugs críticos
✅ Todos los features del MVP local estables

---

## Pasos de Migración (Post-MVP)

### **1. Setup Supabase** (1-2 horas)
```bash
# Crear proyecto en supabase.com (free tier)
# Variables de entorno:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

### **2. Crear Tablas en Supabase**
```sql
-- hubs table
CREATE TABLE hubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT, -- 'ALBUM', 'EP', 'SINGLE'
  color TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  userId UUID REFERENCES auth.users
);

-- songs table
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hubId UUID REFERENCES hubs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT, -- 'DRAFT', 'WIP', 'FINISHED'
  bpm INTEGER,
  key TEXT,
  tags TEXT[],
  createdAt TIMESTAMP DEFAULT NOW()
);

-- lyrics table
CREATE TABLE lyrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  songId UUID REFERENCES songs(id) ON DELETE CASCADE,
  type TEXT, -- 'VERSO', 'CORO', 'PUENTE'
  content TEXT,
  order INTEGER
);
```

### **3. Refactor Data Layer** (2-3 horas)

#### Crear `lib/data/hooks.ts`
```typescript
import { useQuery } from '@tanstack/react-query'
import { supabase } from './supabase'

export const useHubs = () => {
  const { data } = useQuery(
    ['hubs'],
    async () => {
      const { data } = await supabase
        .from('hubs')
        .select('*, songs(*)')
      return data || []
    }
  )
  return data || []
}

export const useHub = (hubId: string | undefined) => {
  const { data } = useQuery(
    ['hubs', hubId],
    async () => {
      if (!hubId) return null
      const { data } = await supabase
        .from('hubs')
        .select('*, songs(*, lyrics(*))')
        .eq('id', hubId)
        .single()
      return data
    },
    { enabled: !!hubId }
  )
  return data || null
}

// ... resto de hooks (useSong, useLyrics, useActiveHubId)
```

#### Crear `lib/data/mutations.ts`
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'

export const useCreateHub = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async (input) => {
      const { data } = await supabase
        .from('hubs')
        .insert([input])
        .select()
        .single()
      return data
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['hubs'])
    }
  )
}

export const useUpdateHubMeta = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async ({ hubId, updates }) => {
      const { data } = await supabase
        .from('hubs')
        .update(updates)
        .eq('id', hubId)
        .select()
        .single()
      return data
    },
    {
      onSuccess: (_, { hubId }) => {
        queryClient.invalidateQueries(['hubs', hubId])
      }
    }
  )
}

// ... resto de mutations (createSong, updateSongMeta, updateLyrics)
```

### **4. Reemplazar en Componentes** (1-2 horas)

**ANTES:**
```typescript
// SongHeader.tsx
const { updateSongMeta } = useStaveActions()
const hubs = useHubs()
```

**DESPUÉS:**
```typescript
// SongHeader.tsx
const { mutate: updateSongMeta } = useUpdateSongMeta()
const hubs = useHubs() // ← Mismo hook, distinta implementación
```

**Componentes:** 0 cambios visuales

### **5. Agregar React Query Provider**
```typescript
// app/layout.tsx
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### **6. Remover Zustand** (Opcional, después)
- Eliminar `store/stave.store.ts`
- Eliminar `useStaveActions()` calls
- Mantener `create-modal.store.ts` (UI local state)

---

## Timeline Estimado
- **Setup + Tablas:** 1-2 horas
- **Data Layer:** 2-3 horas
- **Refactor componentes:** 1-2 horas
- **Testing + debugging:** 2-3 horas
- **Total:** ~8-10 horas (1 día de trabajo)

---

## Ventajas de Este Approach
✅ Componentes NUNCA cambian
✅ Zustand puede convivir con React Query
✅ Migramos sin riesgo de breaking changes
✅ Fácil rollback si algo falla
✅ Data layer agnóstico (cambiar backend después es trivial)

---

## Notas Importantes
- **Auth:** Agregar en Fase 2 (login/multi-user)
- **Storage:** Usar Supabase Storage para audio/artwork (después)
- **Realtime:** Usar Supabase Realtime sockets si quieres sync en vivo (después)
- **RLS Policies:** Configurar después de agregar Auth

---

## Referencia Rápida
| Recurso | Link |
|---------|------|
| Supabase Docs | https://supabase.com/docs |
| React Query | https://tanstack.com/query/latest |
| Supabase + Next.js | https://supabase.com/docs/guides/getting-started/quickstarts/nextjs |

---

**Status:** Pendiente hasta MVP local completado
**Última actualización:** 2026-02-27
