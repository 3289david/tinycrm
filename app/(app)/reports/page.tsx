import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

function fmt(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

function monthKey(d: Date) {
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key: string) {
  const [year, month] = key.split('-')
  return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const [paidInvoices, allInvoices, clients] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId: session.user.id, status: 'paid' },
      orderBy: { paidAt: 'desc' },
      include: { client: { select: { id: true, name: true } } },
    }),
    prisma.invoice.findMany({
      where: { userId: session.user.id },
    }),
    prisma.client.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true, company: true },
    }),
  ])

  // Monthly revenue (last 12 months)
  const monthMap: Record<string, { count: number; cents: number }> = {}
  paidInvoices.forEach(inv => {
    const key = monthKey(inv.paidAt ?? inv.createdAt)
    if (!monthMap[key]) monthMap[key] = { count: 0, cents: 0 }
    monthMap[key].count++
    monthMap[key].cents += inv.amountCents
  })
  const now = new Date()
  const months: string[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(monthKey(d))
  }

  // Top clients by revenue
  const clientRevMap: Record<string, { name: string; company: string | null; cents: number; count: number }> = {}
  paidInvoices.forEach(inv => {
    if (!clientRevMap[inv.client.id]) {
      clientRevMap[inv.client.id] = { name: inv.client.name, company: null, cents: 0, count: 0 }
    }
    clientRevMap[inv.client.id].cents += inv.amountCents
    clientRevMap[inv.client.id].count++
  })
  const topClients = Object.entries(clientRevMap)
    .sort((a, b) => b[1].cents - a[1].cents)
    .slice(0, 8)

  const totalRevenue = paidInvoices.reduce((s, i) => s + i.amountCents, 0)
  const pendingCents = allInvoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amountCents, 0)
  const overdueCents = allInvoices.filter(i => {
    return i.status === 'pending' && i.dueDate && new Date(i.dueDate) < now
  }).reduce((s, i) => s + i.amountCents, 0)

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <h1 className="text-ink mb-8" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
        Reports
      </h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { label: 'Total collected', value: fmt(totalRevenue) },
          { label: 'Outstanding', value: fmt(pendingCents) },
          { label: 'Overdue', value: fmt(overdueCents), warn: overdueCents > 0 },
        ].map(({ label, value, warn }) => (
          <div key={label} className={`p-4 rounded-lg border bg-canvas ${warn ? 'border-ruby' : 'border-hairline'}`}>
            <p className={`text-xs mb-1 font-normal ${warn ? 'text-ruby' : 'text-ink-mute'}`}>{label}</p>
            <p className={`tnum ${warn ? 'text-ruby' : 'text-ink'}`} style={{ fontSize: 18, fontWeight: 300, letterSpacing: '-0.36px' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Monthly revenue */}
      <div className="mb-10">
        <p className="text-xs text-ink-mute uppercase font-normal mb-4" style={{ fontSize: 10, letterSpacing: '0.1px' }}>
          Monthly revenue (last 12 months)
        </p>
        <div className="border border-hairline rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 px-4 py-2 bg-canvas-soft border-b border-hairline">
            <span className="text-xs text-ink-mute font-normal">Month</span>
            <span className="text-xs text-ink-mute font-normal text-right">Invoices</span>
            <span className="text-xs text-ink-mute font-normal text-right">Revenue</span>
          </div>
          {months.map(key => {
            const data = monthMap[key] ?? { count: 0, cents: 0 }
            const isCurrentMonth = key === monthKey(now)
            return (
              <div
                key={key}
                className={`grid grid-cols-3 px-4 py-3 border-b border-hairline last:border-0 ${isCurrentMonth ? 'bg-canvas-soft' : 'bg-canvas'}`}
              >
                <span className="text-sm text-ink-mute">{monthLabel(key)}{isCurrentMonth && <span className="text-xs text-primary ml-2">current</span>}</span>
                <span className="text-sm text-ink text-right tnum">{data.count > 0 ? data.count : '—'}</span>
                <span className={`text-sm text-right tnum font-normal ${data.cents > 0 ? 'text-ink' : 'text-ink-mute'}`}>
                  {data.cents > 0 ? fmt(data.cents) : '—'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top clients */}
      {topClients.length > 0 && (
        <div>
          <p className="text-xs text-ink-mute uppercase font-normal mb-4" style={{ fontSize: 10, letterSpacing: '0.1px' }}>
            Top clients by revenue
          </p>
          <div className="border border-hairline rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 px-4 py-2 bg-canvas-soft border-b border-hairline">
              <span className="text-xs text-ink-mute font-normal">Client</span>
              <span className="text-xs text-ink-mute font-normal text-right">Invoices</span>
              <span className="text-xs text-ink-mute font-normal text-right">Total</span>
            </div>
            {topClients.map(([id, data]) => (
              <div key={id} className="grid grid-cols-3 px-4 py-3 border-b border-hairline last:border-0 bg-canvas">
                <span className="text-sm text-ink font-normal">{data.name}</span>
                <span className="text-sm text-ink text-right tnum">{data.count}</span>
                <span className="text-sm text-ink font-normal text-right tnum">{fmt(data.cents)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
