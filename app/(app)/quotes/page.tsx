import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'

function fmt(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

const STATUS_STYLE: Record<string, string> = {
  draft: 'text-ink-mute bg-canvas-soft border-hairline',
  sent: 'text-primary-deep bg-primary-subdued border-transparent',
  accepted: 'text-ink bg-canvas-soft border-hairline',
  declined: 'text-ruby bg-canvas border-ruby',
  expired: 'text-ink-mute bg-canvas border-hairline',
}

export default async function QuotesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const quotes = await prisma.quote.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { client: { select: { id: true, name: true } } },
  })

  const openCents = quotes
    .filter(q => q.status === 'draft' || q.status === 'sent')
    .reduce((s, q) => s + q.amountCents, 0)
  const acceptedCents = quotes
    .filter(q => q.status === 'accepted')
    .reduce((s, q) => s + q.amountCents, 0)

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <h1 className="text-ink mb-8" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
        Quotes
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: 'Open', value: fmt(openCents) },
          { label: 'Accepted', value: fmt(acceptedCents) },
        ].map(({ label, value }) => (
          <div key={label} className="p-5 rounded-lg border border-hairline bg-canvas-soft">
            <p className="text-xs text-ink-mute mb-1 font-normal">{label}</p>
            <p className="text-ink tnum" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.5px' }}>{value}</p>
          </div>
        ))}
      </div>

      {quotes.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-ink-mute text-sm">No quotes yet.</p>
          <p className="text-ink-mute text-xs mt-1">Open a client to create one.</p>
        </div>
      ) : (
        <div className="divide-y divide-hairline">
          {quotes.map(q => (
            <div key={q.id} className="py-4 flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {q.quoteNumber && (
                    <span className="text-xs text-ink-mute tnum">{q.quoteNumber}</span>
                  )}
                  <Link
                    href={`/app/clients/${q.client.id}`}
                    className="text-sm font-normal text-ink hover:text-primary transition-colors"
                  >
                    {q.client.name}
                  </Link>
                  <span
                    className={clsx('text-xs border px-2 py-0.5 rounded-pill', STATUS_STYLE[q.status])}
                    style={{ fontSize: 10 }}
                  >
                    {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-ink-mute truncate">{q.description}</p>
                <p className="text-xs text-ink-mute tnum mt-0.5">
                  {new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {q.validUntil && (
                    <> · Valid until {new Date(q.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
                  )}
                </p>
              </div>
              <div className="ml-4 text-right shrink-0">
                <p className="text-sm text-ink tnum font-normal">{fmt(q.amountCents)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
