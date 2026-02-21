'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useHydrate } from '@/hooks'

export function ThemeToggler() {
  const { setTheme, resolvedTheme: theme } = useTheme()
  const isDarkTheme = theme === 'dark'
  const hydrated = useHydrate()

  if (!hydrated) {
    return <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0" />
  }

  const toggleTheme = () => {
    setTheme(isDarkTheme ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-8 w-8 rounded-md hover:bg-accent transition-colors"
      title="Cambiar tema"
    >
      <div className="grid place-items-center h-5 w-5">
        {isDarkTheme ? (
          <Moon className="text-foreground/50 h-full w-full scale-0 dark:scale-100" />
        ) : (
          <Sun className="text-foreground/50 h-full w-full scale-100 dark:scale-0" />
        )}
      </div>
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
