import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'IK SaaS',
  description: 'Multi-tenant HR SaaS',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
