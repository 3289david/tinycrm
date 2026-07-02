import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'

function fmt(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'text-ink-mute bg-canvas-soft border-hairline',
  paid: 'text-primary-deep bg-primary-subdued border-transparent',
  cancelled: 'text-ink-mute bg-canvas border-hairline',
  refunded: 'text-ruby bg-canvas border-ruby',
  overdue: 'text-ruby bg-canvas border-ruby',
}

const CLIENT_STATUS: Record<string, string> = {
  lead: 'text-ink-mute bg-canvas-soft border-hairline',
  working: 'text-primary-deep bg-primary-subdued border-transparent',
  done: 'text-ink bg-canvas-soft border-hairline',
  archived: 'text-ink-mute bg-canvas border-hairline',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  const userId = session.user.id

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [clients, invoices, quotes] = await Promise.all([
    prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, company: true, status: true, createdAt: true },
    }),
    prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { client: { select: { id: true, name: true } } },
    }),
    prisma.quote.findMany({
      where: { userId, status: { in: ['draft', 'sent'] } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { client: { select: { id: true, name: true } } },
    }),
  ])

  const activeClients = clients.filter(c => c.status !== 'archived').length

  const pendingInvoices = invoices.filter(i => i.status === 'pending')
  const overdueInvoices = pendingInvoices.filter(i => i.dueDate && new Date(i.dueDate) < now)
  const outstandingCents = pendingInvoices.reduce((s, i) => s + i.amountCents, 0)
  const overdueCents = overdueInvoices.reduce((s, i) => s + i.amountCents, 0)
  const collectedThisMonthCents = invoices
    .filter(i => i.status === 'paid' && i.paidAt && new Date(i.paidAt) >= startOfMonth)
    .reduce((s, i) => s + i.amountCents, 0)
  const collectedTotalCents = invoices
    .filter(i => i.status === 'paid')
    .reduce((s, i) => s + i.amountCents, 0)

  const recentInvoices = invoices.slice(0, 8)
  const recentClients = clients.slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-ink" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
          Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <Link
            href="/app/clients/new"
            className="bg-primary text-white font-normal text-sm px-4 py-2 rounded-pill hover:bg-primary-deep transition-colors"
          >
            New client
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: 'Active clients', value: String(activeClients) },
          { label: 'Outstanding', value: fmt(outstandingCents) },
          { label: 'Collected (total)', value: fmt(collectedTotalCents) },
          { label: 'Overdue', value: fmt(overdueCents), warn: overdueCents > 0 },
        ].map(({ label, value, warn }) => (
          <div
            key={label}
            className={clsx(
              'p-4 rounded-lg border bg-canvas',
              warn ? 'border-ruby' : 'border-hairline',
            )}
          >
            <p className={clsx('text-xs mb-1 font-normal', warn ? 'text-ruby' : 'text-ink-mute')}>{label}</p>
            <p
              className={clsx('tnum', warn ? 'text-ruby' : 'text-ink')}
              style={{ fontSize: 20, fontWeight: 300, letterSpacing: '-0.4px' }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Recent invoices */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-ink-mute uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>
              Recent invoices
            </p>
            <Link href="/app/invoices" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {recentInvoices.length === 0 ? (
            <p className="text-ink-mute text-sm">No invoices yet.</p>
          ) : (
            <div className="divide-y divide-hairline">
              {recentInvoices.map(inv => {
                const isOverdue = inv.status === 'pending' && inv.dueDate && new Date(inv.dueDate) < now
                const displayStatus = isOverdue ? 'overdue' : inv.status
                return (
                  <div key={inv.id} className="py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {inv.invoiceNumber && (
                          <span className="text-xs text-ink-mute tnum">{inv.invoiceNumber}</span>
                        )}
                        <Link
                          href={`/app/clients/${inv.client.id}`}
                          className="text-sm text-ink hover:text-primary transition-colors font-normal truncate"
                        >
                          {inv.client.name}
                        </Link>
                        <span
                          className={clsx('text-xs border px-1.5 py-0.5 rounded-pill shrink-0', STATUS_STYLE[displayStatus])}
                          style={{ fontSize: 10 }}
                        >
                          {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-ink-mute truncate">{inv.description}</p>
                    </div>
                    <p className="text-sm text-ink tnum font-normal ml-4 shrink-0">
                      {fmt(inv.amountCents)}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Recent clients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-ink-mute uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>
                Recent clients
              </p>
              <Link href="/app/clients" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-1">
              {recentClients.map(c => (
                <Link
                  key={c.id}
                  href={`/app/clients/${c.id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-canvas-soft transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-ink font-normal truncate">{c.name}</p>
                    {c.company && <p className="text-xs text-ink-mute truncate">{c.company}</p>}
                  </div>
                  <span
                    className={clsx('text-xs border px-1.5 py-0.5 rounded-pill ml-2 shrink-0', CLIENT_STATUS[c.status])}
                    style={{ fontSize: 10 }}
                  >
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Open quotes */}
          {quotes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-ink-mute uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>
                  Open quotes
                </p>
                <Link href="/app/quotes" className="text-xs text-primary hover:underline">View all</Link>
              </div>
              <div className="space-y-2">
                {quotes.map(q => (
                  <Link
                    key={q.id}
                    href={`/app/clients/${q.client.id}`}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-canvas-soft transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-ink font-normal truncate">{q.client.name}</p>
                      <p className="text-xs text-ink-mute">{q.quoteNumber} · {q.status}</p>
                    </div>
                    <p className="text-xs text-ink tnum ml-2 shrink-0">{fmt(q.amountCents)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* This month */}
          <div className="p-4 rounded-lg border border-hairline bg-canvas-soft">
            <p className="text-xs text-ink-mute mb-2 font-normal">Collected this month</p>
            <p className="text-ink tnum" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.4px' }}>
              {fmt(collectedThisMonthCents)}
            </p>
            <p className="text-xs text-ink-mute mt-1">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
