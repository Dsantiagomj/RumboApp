import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rumbo - AI-Powered Life Assistant',
  description: 'Navigate your financial journey with intelligent guidance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
