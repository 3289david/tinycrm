'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import clsx from 'clsx'

interface NavItem {
  href: string
  label: string
  matchPrefix?: boolean
}

interface NavGroup {
  label?: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    items: [
      { href: '/app/dashboard', label: 'Dashboard' },
    ],
  },
  {
    label: 'Clients',
    items: [
      { href: '/app/clients', label: 'Clients', matchPrefix: true },
      { href: '/app/archive', label: 'Archive' },
    ],
  },
  {
    label: 'Billing',
    items: [
      { href: '/app/invoices', label: 'Invoices' },
      { href: '/app/quotes', label: 'Quotes' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { href: '/app/services', label: 'Services' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { href: '/app/reports', label: 'Reports' },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/app/settings', label: 'Settings' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin

  function isActive(href: string, matchPrefix?: boolean) {
    if (href === '/app/clients' && matchPrefix) {
      return pathname.startsWith('/app/clients')
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <aside className="w-44 shrink-0 border-r border-hairline bg-canvas-soft min-h-screen flex flex-col py-6 px-4">
      <Link href="/app/dashboard" className="text-ink font-light text-base tracking-tight mb-8 block">
        TinyCRM
      </Link>

      <nav className="flex-1 space-y-4">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="px-3 mb-1 font-normal text-ink-mute" style={{ fontSize: 10, letterSpacing: '0.1px', textTransform: 'uppercase' }}>
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'block text-sm px-3 py-1.5 rounded-md transition-colors',
                    isActive(item.href, item.matchPrefix)
                      ? 'text-ink bg-hairline font-normal'
                      : 'text-ink-mute hover:text-ink hover:bg-hairline',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {isAdmin && (
          <div>
            <div className="border-t border-hairline mb-3" />
            <Link
              href="/admin"
              className={clsx(
                'block text-sm px-3 py-1.5 rounded-md transition-colors',
                pathname.startsWith('/admin')
                  ? 'text-primary bg-primary-subdued font-normal'
                  : 'text-ink-mute hover:text-ink hover:bg-hairline',
              )}
            >
              Admin panel
            </Link>
          </div>
        )}
      </nav>

      <div className="space-y-1 pt-4 border-t border-hairline">
        <p className="text-ink-mute text-xs px-3 truncate">{session?.user?.email}</p>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-left text-xs text-ink-mute hover:text-ink transition-colors px-3 py-1"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
