import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, email: true, isAdmin: true, createdAt: true,
      _count: { select: { clients: true, invoices: true } },
    },
  })

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <h1 className="text-ink mb-8" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
        Users
        <span className="ml-3 text-ink-mute tnum" style={{ fontSize: 14 }}>{users.length}</span>
      </h1>

      <div className="divide-y divide-hairline">
        {users.map(u => (
          <Link
            key={u.id}
            href={`/admin/users/${u.id}`}
            className="flex items-center justify-between py-3.5 hover:bg-canvas-soft -mx-4 px-4 rounded-md transition-colors group"
          >
            <div className="min-w-0">
              <p className="text-sm text-ink group-hover:text-primary transition-colors truncate">
                {u.name ?? u.email}
                {u.isAdmin && (
                  <span className="ml-2 text-xs text-primary-deep bg-primary-subdued px-2 py-0.5 rounded-pill" style={{ fontSize: 10 }}>
                    Admin
                  </span>
                )}
              </p>
              <p className="text-xs text-ink-mute mt-0.5 truncate">{u.email}</p>
            </div>
            <div className="ml-4 text-right text-xs text-ink-mute tnum shrink-0">
              <p>{u._count.clients} clients · {u._count.invoices} invoices</p>
              <p>{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
