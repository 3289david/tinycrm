'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import clsx from 'clsx'

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-44 shrink-0 border-r border-hairline bg-brand-dark min-h-screen flex flex-col py-6 px-4">
      <div className="mb-1">
        <Link href="/admin" className="text-white font-light text-base tracking-tight block">
          TinyCRM
        </Link>
        <span className="text-xs font-normal" style={{ color: '#665efd', fontSize: 10, letterSpacing: '0.1px' }}>
          ADMIN
        </span>
      </div>

      <div className="border-t border-white/10 my-4" />

      <nav className="flex-1 space-y-0.5">
        {links.map(({ href, label }) => {
          const active = href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'block text-sm px-3 py-2 rounded-md transition-colors',
                active
                  ? 'text-white bg-white/10 font-normal'
                  : 'text-white/60 hover:text-white hover:bg-white/10',
              )}
            >
              {label}
            </Link>
          )
        })}

        <div className="border-t border-white/10 my-2" />
        <Link
          href="/app/clients"
          className="block text-sm px-3 py-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          My CRM
        </Link>
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="text-left text-xs text-white/40 hover:text-white/80 transition-colors px-3 py-1"
      >
        Sign out
      </button>
    </aside>
  )
}
