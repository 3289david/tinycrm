import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminOverviewPage() {
  const [userCount, clientCount, invoiceCount, paidRevenue, pendingRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.client.count(),
    prisma.invoice.count(),
    prisma.invoice.aggregate({ where: { status: 'paid' }, _sum: { amountCents: true } }),
    prisma.invoice.aggregate({ where: { status: 'pending' }, _sum: { amountCents: true } }),
  ])

  const formatMoney = (cents: number | null) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((cents ?? 0) / 100)

  const stats = [
    { label: 'Total users', value: String(userCount) },
    { label: 'Total clients', value: String(clientCount) },
    { label: 'Total invoices', value: String(invoiceCount) },
    { label: 'Revenue collected', value: formatMoney(paidRevenue._sum.amountCents) },
    { label: 'Revenue pending', value: formatMoney(pendingRevenue._sum.amountCents) },
  ]

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true, name: true, email: true, isAdmin: true, createdAt: true,
      _count: { select: { clients: true, invoices: true } },
    },
  })

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      <h1 className="text-ink mb-8" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
        Overview
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {stats.map(({ label, value }) => (
          <div key={label} className="p-5 rounded-lg border border-hairline bg-canvas-soft">
            <p className="text-xs text-ink-mute mb-1 font-normal">{label}</p>
            <p className="text-ink tnum" style={{ fontSize: 20, fontWeight: 300, letterSpacing: '-0.4px' }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-ink" style={{ fontSize: 15, fontWeight: 300 }}>Recent users</h2>
        <Link href="/admin/users" className="text-primary text-sm hover:underline">All users</Link>
      </div>

      <div className="divide-y divide-hairline">
        {recentUsers.map(u => (
          <Link
            key={u.id}
            href={`/admin/users/${u.id}`}
            className="flex items-center justify-between py-3 hover:bg-canvas-soft -mx-4 px-4 rounded-md transition-colors group"
          >
            <div>
              <p className="text-sm text-ink group-hover:text-primary transition-colors">
                {u.name ?? u.email}
                {u.isAdmin && (
                  <span className="ml-2 text-xs text-primary-deep bg-primary-subdued px-2 py-0.5 rounded-pill" style={{ fontSize: 10 }}>
                    Admin
                  </span>
                )}
              </p>
              <p className="text-xs text-ink-mute mt-0.5">{u.email}</p>
            </div>
            <div className="text-right text-xs text-ink-mute tnum">
              <p>{u._count.clients} clients · {u._count.invoices} invoices</p>
              <p>{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
