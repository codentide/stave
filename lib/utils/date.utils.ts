import { formatDistanceToNow, isValid, Locale, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export const ensureDate = (
  date: string | Date | undefined | null
): Date | null => {
  if (!date) return null
  const newDate = typeof date === 'string' ? parseISO(date) : date
  return isValid(newDate) ? newDate : null
}

export const getRelativeTime = (
  date: string | Date | undefined | null,
  config: { addSuffix?: boolean; locale: Locale } = {
    addSuffix: false,
    locale: es,
  }
): string => {
  const newDate = ensureDate(date)
  if (!newDate) return 'Sin fecha'

  return formatDistanceToNow(newDate, config)
}
