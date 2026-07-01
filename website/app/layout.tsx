import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TinyCRM — Self-hosted client management',
  description: 'Minimal self-hosted CRM with built-in invoicing. Runs on any VPS. No cloud required.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
