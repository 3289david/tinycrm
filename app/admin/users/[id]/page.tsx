import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdminUserActions from './AdminUserActions'

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      clients: { orderBy: { createdAt: 'desc' }, take: 20, select: { id: true, name: true, status: true, createdAt: true } },
      invoices: {
        orderBy: { createdAt: 'desc' }, take: 20,
        select: { id: true, amountCents: true, currency: true, description: true, status: true, createdAt: true },
      },
    },
  })

  if (!user) notFound()

  const formatMoney = (cents: number, cur: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(cents / 100)

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/users" className="text-ink-mute hover:text-ink text-sm transition-colors">Users</Link>
        <span className="text-ink-mute text-sm">/</span>
        <span className="text-ink text-sm">{user.name ?? user.email}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-ink" style={{ fontSize: 26, fontWeight: 300, letterSpacing: '-0.26px' }}>
            {user.name ?? 'Unnamed'}
          </h1>
          <p className="text-ink-mute text-sm mt-1">{user.email}</p>
          {user.company && <p className="text-ink-mute text-sm">{user.company}</p>}
          <p className="text-ink-mute text-xs mt-2 tnum">
            Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <AdminUserActions userId={user.id} isAdmin={user.isAdmin} />
      </div>

      {/* Clients */}
      {user.clients.length > 0 && (
        <div className="mb-8">
          <p className="text-xs text-ink-mute mb-3 uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>
            Clients ({user.clients.length})
          </p>
          <div className="divide-y divide-hairline">
            {user.clients.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-ink">{c.name}</span>
                <span className="text-xs text-ink-mute capitalize">{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoices */}
      {user.invoices.length > 0 && (
        <div>
          <p className="text-xs text-ink-mute mb-3 uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>
            Invoices ({user.invoices.length})
          </p>
          <div className="divide-y divide-hairline">
            {user.invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-ink">{inv.description}</span>
                <div className="text-right">
                  <span className="text-sm text-ink tnum">{formatMoney(inv.amountCents, inv.currency)}</span>
                  <span className="text-xs text-ink-mute ml-2 capitalize">{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
