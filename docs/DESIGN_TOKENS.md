# Design Tokens - Color System

## Filosofía

Sistema **monocromático** con un único color primario (ambar). Todo lo demás usa **opacidades de foreground/background**.

**NO usar**: `muted`, `accent`, `secondary` - son innecesarios en un sistema monocromático.

---

## Opacidades Estándar

Usa estos valores de opacidad directamente en las clases Tailwind:

### Borders

| Uso | Opacidad | Ejemplo |
|-----|----------|---------|
| Borders suave, poco visible | `/30` | `border-border/30`, `border-foreground/30` |
| Borders normal | `/40` | `border-border/40` |
| Borders más fuerte | `/50` | `border-border/50` |

### Backgrounds

| Uso | Opacidad | Ejemplo |
|-----|----------|---------|
| Hover backgrounds, muy suave | `/20` | `bg-background/20`, `hover:bg-primary/20` |
| Active/selected backgrounds | `/30` | `bg-background/30`, `active:bg-primary/30` |
| Disabled backgrounds | `/50` | `disabled:opacity-50` |

### Text

| Uso | Opacidad | Ejemplo |
|-----|----------|---------|
| Texto atenuado (placeholder, secundario) | `/64` | `text-foreground/64` |
| Texto ligeramente atenuado | `/72` | `text-foreground/72` |
| Texto visible (botones, iconos) | `/80` | `text-foreground/80` |
| Texto disabled | `/50` | `text-foreground/50` |

### Primary (Interactivo)

El color `primary` (ambar) solo se usa sin opacidad para énfasis máximo:

| Uso | Clase | Ejemplo |
|-----|-------|---------|
| Texto primary | `text-primary` | Links, botones primarios |
| Backgrounds hover | `hover:bg-primary/20` | Hover states |
| Backgrounds active | `active:bg-primary/30` | Active states |

---

## Colores Semánticos en Uso

Solo estos colores se usan en la app:

| Color | Luz | Oscuridad | Uso |
|-------|-----|-----------|-----|
| **primary** | `oklch(70.865% 0.1581 61.015)` ambar | `oklch(74.499% 0.15418 63.485)` ambar más claro | Interactivo, énfasis, links, botones |
| **foreground** | Negro oscuro | Blanco claro | Texto principal |
| **background** | Blanco | Gris oscuro | Fondos |
| **border** | Gris claro | Gris con opacidad | Líneas divisoras |
| **muted** | ❌ NO USAR | ❌ NO USAR | Eliminado, usar `foreground/X` |
| **accent** | ❌ NO USAR | ❌ NO USAR | Eliminado, usar `background/X` |

---

## Ejemplos de Uso

### ✅ CORRECTO

```tsx
// Texto muted
className="text-foreground/64"

// Borders suave
className="border-border/30"

// Hover background
className="hover:bg-primary/20"

// Placeholder
className="placeholder:text-foreground/50"

// Disabled
className="disabled:opacity-50"

// Botón primario
className="bg-primary text-primary-foreground"
```

### ❌ INCORRECTO

```tsx
// Usar muted-foreground
className="text-muted-foreground"  // ❌ No existe

// Usar accent
className="hover:bg-accent"  // ❌ No existe

// Valores de opacidad inconsistentes
className="text-foreground/35"  // ❌ No está en la guía
className="border-border/25"  // ❌ No está en la guía
```

---

## Principios

1. **Consistencia**: Siempre usa opacidades de la tabla arriba
2. **Simplicidad**: Menos colores = menos opciones = menos confusión
3. **Predictibilidad**: `/64` siempre significa "texto muted" en cualquier componente
4. **Semántica**: Cada valor tiene un significado claro

---

## Cambios Respecto a Shadcn Default

Shadcn viene con `muted` y `accent`, pero **no los usamos**:

- ❌ `text-muted-foreground` → ✅ `text-foreground/64`
- ❌ `bg-muted/30` → ✅ `bg-background/30`
- ❌ `hover:bg-accent` → ✅ `hover:bg-primary/20`
- ❌ `text-accent-foreground` → ✅ `text-primary`

Esto hace el sistema **más simple y consistente** para nuestro caso monocromático.
