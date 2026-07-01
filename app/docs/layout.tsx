import Link from 'next/link'
import DocsNav from './DocsNav'

export const metadata = {
  title: 'TinyCRM Documentation',
  description: 'Self-hosted client management with built-in invoicing. Install on any VPS.',
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Top nav */}
      <header className="border-b border-hairline sticky top-0 bg-canvas z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-ink font-light text-lg tracking-tight">
              TinyCRM
            </Link>
            <span className="text-hairline-input select-none">/</span>
            <Link href="/docs" className="text-ink-mute hover:text-ink text-sm transition-colors">
              Docs
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-ink-mute hover:text-ink text-sm transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-primary text-white font-normal text-sm px-4 py-1.5 rounded-pill hover:bg-primary-deep transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 flex gap-10 py-10">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <DocsNav />
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 max-w-2xl">
          {children}
        </main>
      </div>
    </div>
  )
}
