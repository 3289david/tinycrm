'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import clsx from 'clsx'

const links = [
  { href: '/app/clients', label: 'Clients' },
  { href: '/app/invoices', label: 'Invoices' },
  { href: '/app/archive', label: 'Archive' },
  { href: '/app/settings', label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin

  return (
    <aside className="w-44 shrink-0 border-r border-hairline bg-canvas-soft min-h-screen flex flex-col py-6 px-4">
      <Link href="/app/clients" className="text-ink font-light text-base tracking-tight mb-8 block">
        TinyCRM
      </Link>

      <nav className="flex-1 space-y-0.5">
        {links.map(({ href, label }) => {
          const active = href === '/app/clients'
            ? pathname.startsWith('/app/clients')
            : pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'block text-sm px-3 py-2 rounded-md transition-colors',
                active
                  ? 'text-ink bg-hairline font-normal'
                  : 'text-ink-mute hover:text-ink hover:bg-hairline',
              )}
            >
              {label}
            </Link>
          )
        })}

        {isAdmin && (
          <>
            <div className="border-t border-hairline my-2" />
            <Link
              href="/admin"
              className={clsx(
                'block text-sm px-3 py-2 rounded-md transition-colors',
                pathname.startsWith('/admin')
                  ? 'text-primary bg-primary-subdued font-normal'
                  : 'text-ink-mute hover:text-ink hover:bg-hairline',
              )}
            >
              Admin panel
            </Link>
          </>
        )}
      </nav>

      <div className="space-y-1">
        <p className="text-ink-mute text-xs px-3 truncate">{session?.user?.email}</p>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-left text-xs text-ink-mute hover:text-ink transition-colors px-3 py-1"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
