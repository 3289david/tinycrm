'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

const links = [
  { href: '/app/clients', label: 'Clients' },
  { href: '/app/archive', label: 'Archive' },
  { href: '/app/settings', label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-44 shrink-0 border-r border-hairline bg-canvas-soft min-h-screen flex flex-col py-6 px-4">
      <Link href="/app/clients" className="text-ink font-light text-base tracking-tight mb-8 block">
        TinyCRM
      </Link>
      <nav className="flex-1 space-y-0.5">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'block text-sm px-3 py-2 rounded-md transition-colors',
              pathname === href || (href === '/app/clients' && pathname.startsWith('/app/clients'))
                ? 'text-ink bg-hairline font-normal'
                : 'text-ink-mute hover:text-ink hover:bg-hairline',
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={signOut}
        className="text-left text-xs text-ink-mute hover:text-ink transition-colors px-3 py-2"
      >
        Sign out
      </button>
    </aside>
  )
}
