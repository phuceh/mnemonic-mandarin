import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '记 · Remember',
  description: 'Mandarin vocabulary builder with mnemonics',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}