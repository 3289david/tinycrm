import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TinyCRM — Know your people. Nothing more.',
  description: 'The simplest CRM. No AI. No pipeline. No enterprise features. Just your clients.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
