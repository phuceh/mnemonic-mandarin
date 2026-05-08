import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Memorize Mandarin',
  description: 'Mandarin vocabulary with mnemonics',
  icons: {
    icon: '/seal.svg',
  },
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