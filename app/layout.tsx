import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers'
import { serif, sans } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stave | Suite Musical',
  description: 'Crea y organiza proyectos musicales',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${serif.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
