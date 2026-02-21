import { Inter, Prata } from 'next/font/google'

export const serif = Prata({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--google-font-serif',
})

export const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--google-font-sans',
})
