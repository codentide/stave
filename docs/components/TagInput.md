# TagInput Component

## Descripción General

`TagInput` es un componente robusto y accesible para agregar múltiples etiquetas (tags) con soporte para:
- Sugerencias dinámicas filtradas
- Creación de tags personalizados
- Navegación por teclado (flechas, Enter, Escape)
- Theming dinámico con colores del hub
- Límite máximo de tags configurables

**Ubicación**: `components/shared/TagInput.tsx`

---

## Arquitectura

### Estado Interno

```typescript
[inputValue]       // Texto que está escribiendo el usuario
[isOpen]           // Si el dropdown está visible
[highlightedIndex] // Cuál opción está resaltada con flechas (-1 = ninguna)
```

### Lógica Derivada (no state)

```typescript
suggestions    // Array filtrado de ALL_TAG_SUGGESTIONS (solo si hay match)
isNewTag       // Boolean: ¿el input es un tag que NO existe en suggestions?
totalOptions   // Número total de opciones: suggestions.length + (isNewTag ? 1 : 0)
customStyles   // CSS variables para theming: --primary, --primary-foreground
```

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `onAdd` | `(tag: string) => void` | **requerido** | Callback cuando el usuario agrega un tag |
| `existingTags` | `string[]` | **requerido** | Array de tags ya asignados (excluye de sugerencias) |
| `maxTags` | `number` | `8` | Máximo de tags permitidos (cuando se alcanza, no renderiza) |
| `placeholder` | `string` | `'Agregar tag...'` | Placeholder del input |
| `color` | `string` | `undefined` | Color hex del hub (ej: `#d9933f`) para theming |

### Ejemplo de Uso

```typescript
<TagInput
  existingTags={tags}           // Ej: ['Rock', 'Pop']
  onAdd={handleAddTag}          // Valida y actualiza store
  maxTags={3}
  placeholder="Agregar género..."
  color={hub?.color}            // Hereda color del hub
/>
```

---

## Comportamiento

### 1. Estado Cerrado (Botón +)
```
[+]  ← Botón compacto, click para abrir
```

### 2. Estado Abierto (Input + Popover)
```
┌─────────────────────┐
│ Escribe aquí...     │  ← Input con focus automático
└─────────────────────┘
┌─────────────────────┐
│ Rock                │  ← Sugerencia filtrada
│ Reggae              │
│ Crear nuevo "text"  │  ← Opción si el input NO está en sugerencias
└─────────────────────┘
```

### 3. Flujo de Interacción

#### **Búsqueda Filtrada**
- Usuario escribe → suggestions se actualizan en tiempo real
- Si no hay coincidencias → se ofrece "Crear nuevo tag 'x'"
- Si input está vacío → no muestra nada (dropdown cerrado)

#### **Navegación por Teclado**
```
ArrowUp/ArrowDown    → Resalta opciones (cicla)
Enter                → Agrega la opción resaltada (o lo escrito si no hay resaltado)
Escape               → Cancela y cierra
Backspace            → Edita el input normalmente
```

#### **Navegación por Mouse**
```
Click en sugerencia  → Agrega el tag
Click fuera         → Cierra (blur)
```

---

## Validación

El componente tiene **validación multicapa**:

```typescript
// 1. Lógica interna (canAdd)
const canAdd = (tag: string) =>
  tag.trim() !== '' &&                    // No vacío
  !existingTags.includes(tag.trim()) &&   // No duplicado
  existingTags.length < maxTags            // Espacio disponible

// 2. Antes de agregar
if (!canAdd(tag)) return  // ← No hace nada si falla validación

// 3. onAdd es responsabilidad del parent
// El parent debe validar nuevamente (defensa en profundidad)
```

---

## Theming (Color del Hub)

El componente usa `createCustomStyles(color)` para inyectar CSS variables:

```typescript
const customStyles = color ? createCustomStyles(color) : undefined
// Resultado: { '--primary': '#d9933f', '--primary-foreground': '#ffffff' }
```

Se aplica a:
- `PopoverContent` → El dropdown hereda el color
- `Input` (via style={customStyles})
- Buttons resaltados → Usan `bg-primary/20 text-primary`

---

## Performance

### Memoización
```typescript
suggestions    // useMemo → recalcula solo si inputValue o existingTags cambia
canAdd         // useCallback → no recrea función innecesariamente
handleAdd      // useCallback → captura dependencias correctamente
handleKeyDown  // useCallback → previene closures stale
handleInputChange // useCallback → reset de highlighted
```

### Sin Memory Leaks
- `handleBlur` reset de state + clear de timeout con delay (150ms)
- No hay subscriptions o listeners olvidados
- No hay referencias cíclicas

---

## Patrones y Decisiones Técnicas

### 1. Popover en lugar de Select
**Por qué**: El componente `Select` de Radix UI es para valores simples (trigger + dropdown). TagInput necesita un input libre con dropdown, así que usamos `Popover` + `Input` + lista de botones.

### 2. PopoverAnchor sin Trigger
```typescript
<PopoverAnchor asChild>
  <Input ... />        {/* El Input ancla el popover, no es trigger */}
</PopoverAnchor>
```
El `open` state se controla manualmente con `isOpen` + `shouldShowDropdown`.

### 3. onMouseDown en lugar de onClick
```typescript
<button onMouseDown={() => handleAdd(suggestion)} ... />
```
`onClick` se dispararía DESPUÉS de `onBlur`, cerrando el dropdown. `onMouseDown` se dispara antes, permitiendo que el tag se agregue.

### 4. Reset en handleInputChange
```typescript
const handleInputChange = (e) => {
  setInputValue(e.target.value)
  setHighlightedIndex(-1)  // Reset cuando el usuario escribe
}
```
UX estándar: al cambiar el input, la selección con flechas se resetea (como en Figma/VS Code).

---

## Extensibilidad Futura

Si necesitas extender el componente:

### Opción 1: Custom Suggestions
```typescript
interface TagInputProps {
  // ... existing props
  suggestions?: string[]        // Override de ALL_TAG_SUGGESTIONS
}
```

### Opción 2: Debounce en búsqueda
```typescript
const debouncedSuggestions = useDebounce(suggestions, 200)
// Para apps con muchas sugerencias (~100+)
```

### Opción 3: Scroll en Popover
```typescript
<PopoverContent className="max-h-[200px] overflow-y-auto">
  {/* items */}
</PopoverContent>
```

---

## Testing

### Casos a Cubrir
```typescript
✓ Abre/cierra con botón +
✓ Filtra sugerencias al escribir
✓ No muestra dropdown si input vacío
✓ Muestra "Crear nuevo" si no hay coincidencia
✓ Agrega tag con Enter
✓ Navega con ArrowUp/ArrowDown
✓ Cicla correctamente con flechas
✓ No permite duplicados
✓ Respeta maxTags
✓ Reset al escribir (highlightedIndex → -1)
✓ Cierra con Escape
✓ Theming aplica correctamente
```

---

## Troubleshooting

### Dropdown no muestra
**Posible causa**: `shouldShowDropdown` es false
```typescript
const shouldShowDropdown =
  inputValue.trim() !== '' &&          // ← Input vacío?
  (suggestions.length > 0 || isNewTag)  // ← Sin coincidencias Y no es tag nuevo?
```
**Solución**: Asegurar que `ALL_TAG_SUGGESTIONS` tiene datos.

### Tags duplicados se agregan
**Posible causa**: `onAdd` no valida duplicados
**Solución**: El parent debe validar:
```typescript
const handleAddTag = (tag: string) => {
  if (tags.includes(tag)) return  // ← Validación parent
  updateSongMeta(hubId, songId, { tags: [...tags, tag] })
}
```

### Navegación de flechas no funciona
**Posible causa**: `isOpen` es false cuando el usuario presiona flechas
**Solución**: Solo funciona cuando el Popover está visible (abierto).

---

## Notas de Mantenimiento

- El componente confía en `ALL_TAG_SUGGESTIONS` de `lib/constants/song.constant.ts`
- Si cambias `ALL_TAG_SUGGESTIONS`, el componente se adapta automáticamente
- El color theming es opcional (`color` puede ser undefined)
- Los validadores (`canAdd`) son internos; el parent es responsable de su lógica

---

## Referencias

- **Componentes relacionados**:
  - `Select.tsx` - Similar pero para valores simples
  - `EditableText.tsx` - Input with debounce
  - `SongTag.tsx` - Renderiza tags individuales con botón X

- **Utilidades usadas**:
  - `createCustomStyles()` - lib/utils/ui.utils.ts
  - `ALL_TAG_SUGGESTIONS` - lib/constants/song.constant.ts
  - `cn()` - Merge de clases Tailwind

- **Design Pattern**: Combobox with Custom Tags (similar a Gmail labels, Figma components, GitHub topics)
