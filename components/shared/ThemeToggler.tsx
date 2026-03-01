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

  const Icon = isDarkTheme ? Sun : Moon

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-8 w-8 rounded-md hover:bg-background/20 transition-colors"
      title="Cambiar tema"
    >
      <div className="grid place-items-center h-5 w-5">
        <Icon className="text-foreground/50 h-full w-full" />
      </div>
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
