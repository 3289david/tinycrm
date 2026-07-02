import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import CopyLinkButton from './CopyLinkButton'

function fmt(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100)
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'text-ink-mute bg-canvas-soft border-hairline',
  paid: 'text-primary-deep bg-primary-subdued border-transparent',
  cancelled: 'text-ink-mute bg-canvas border-hairline',
  refunded: 'text-ruby bg-canvas border-ruby',
  overdue: 'text-ruby bg-canvas border-ruby',
}

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { client: { select: { id: true, name: true } } },
  })

  const now = new Date()
  const outstandingCents = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amountCents, 0)
  const overdueCents = invoices.filter(i =>
    i.status === 'pending' && i.dueDate && new Date(i.dueDate) < now
  ).reduce((s, i) => s + i.amountCents, 0)
  const collectedCents = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amountCents, 0)

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <h1 className="text-ink mb-8" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
        Invoices
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Outstanding', value: fmt(outstandingCents, 'usd') },
          { label: 'Overdue', value: fmt(overdueCents, 'usd'), warn: overdueCents > 0 },
          { label: 'Collected', value: fmt(collectedCents, 'usd') },
        ].map(({ label, value, warn }) => (
          <div key={label} className={clsx('p-5 rounded-lg border bg-canvas-soft', warn ? 'border-ruby' : 'border-hairline')}>
            <p className={clsx('text-xs mb-1 font-normal', warn ? 'text-ruby' : 'text-ink-mute')}>{label}</p>
            <p className={clsx('tnum', warn ? 'text-ruby' : 'text-ink')} style={{ fontSize: 20, fontWeight: 300, letterSpacing: '-0.4px' }}>{value}</p>
          </div>
        ))}
      </div>

      {invoices.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-ink-mute text-sm">No invoices yet.</p>
          <p className="text-ink-mute text-xs mt-1">Open a client to create one.</p>
        </div>
      ) : (
        <div className="divide-y divide-hairline">
          {invoices.map(inv => {
            const overdue = inv.status === 'pending' && inv.dueDate && new Date(inv.dueDate) < now
            const displayStatus = overdue ? 'overdue' : inv.status
            return (
              <div key={inv.id} className="py-4 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {inv.invoiceNumber && (
                      <span className="text-xs text-ink-mute tnum">{inv.invoiceNumber}</span>
                    )}
                    <Link
                      href={`/app/clients/${inv.client.id}`}
                      className="text-sm font-normal text-ink hover:text-primary transition-colors"
                    >
                      {inv.client.name}
                    </Link>
                    <span
                      className={clsx('text-xs border px-2 py-0.5 rounded-pill', STATUS_STYLE[displayStatus])}
                      style={{ fontSize: 10 }}
                    >
                      {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-ink-mute truncate">{inv.description}</p>
                  <p className={clsx('text-xs tnum mt-0.5', overdue ? 'text-ruby' : 'text-ink-mute')}>
                    {new Date(inv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {inv.dueDate && (
                      <> · Due {new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
                    )}
                  </p>
                </div>
                <div className="ml-4 text-right shrink-0">
                  <p className="text-sm text-ink tnum font-normal">{fmt(inv.amountCents, inv.currency)}</p>
                  {inv.status === 'pending' && <CopyLinkButton invoiceId={inv.id} />}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
