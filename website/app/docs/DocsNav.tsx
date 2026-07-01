'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export const docsSections = [
  { href: '/docs', label: 'Overview' },
  {
    group: 'Setup',
    items: [
      { href: '/docs/installation', label: 'Installation' },
      { href: '/docs/nginx', label: 'Nginx & SSL' },
      { href: '/docs/stripe', label: 'Stripe payments' },
    ],
  },
  {
    group: 'Features',
    items: [
      { href: '/docs/invoicing', label: 'Invoicing' },
      { href: '/docs/admin', label: 'Admin panel' },
      { href: '/docs/scaling', label: 'Scaling' },
    ],
  },
]

export default function DocsNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-5">
      {docsSections.map((section, i) => {
        if ('href' in section && section.href) {
          return (
            <Link
              key={section.href}
              href={section.href}
              className={clsx(
                'block text-sm transition-colors py-0.5',
                pathname === section.href
                  ? 'text-primary font-normal'
                  : 'text-ink-mute hover:text-ink',
              )}
            >
              {section.label}
            </Link>
          )
        }
        return (
          <div key={i}>
            <p className="text-xs text-ink-mute font-normal mb-2 uppercase" style={{ fontSize: 10, letterSpacing: '0.1px' }}>
              {section.group}
            </p>
            <div className="space-y-0.5">
              {(section.items ?? []).map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'block text-sm transition-colors py-1 pl-2 border-l',
                    pathname === item.href
                      ? 'text-primary border-primary font-normal'
                      : 'text-ink-mute border-hairline hover:text-ink hover:border-hairline-input',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </nav>
  )
}
