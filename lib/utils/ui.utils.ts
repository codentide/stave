import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de Tailwind de forma segura, evitando duplicados
 * y conflictos de especificidad.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
