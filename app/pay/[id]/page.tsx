import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PayButton from './PayButton'

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100)
}

export default async function PayPage({ params }: { params: { id: string } }) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      client: { select: { name: true } },
      user: { select: { name: true, company: true, email: true } },
    },
  })

  if (!invoice) notFound()

  const isPaid = invoice.status === 'paid'
  const isCancelled = invoice.status === 'cancelled'
  const from = invoice.user.company ?? invoice.user.name ?? invoice.user.email

  return (
    <div className="min-h-screen bg-canvas-soft flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="bg-canvas rounded-lg border border-hairline p-8" style={{ boxShadow: 'rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px' }}>
          {/* From */}
          <p className="text-xs text-ink-mute mb-6 font-normal">Invoice from {from}</p>

          {/* Amount */}
          <p className="text-ink tnum mb-1" style={{ fontSize: 40, fontWeight: 300, letterSpacing: '-1px' }}>
            {formatMoney(invoice.amountCents, invoice.currency)}
          </p>
          <p className="text-ink-mute text-sm mb-6">{invoice.description}</p>

          {/* Details */}
          <div className="space-y-2 mb-8 pb-6 border-b border-hairline">
            <div className="flex justify-between text-sm">
              <span className="text-ink-mute">For</span>
              <span className="text-ink">{invoice.client.name}</span>
            </div>
            {invoice.dueDate && (
              <div className="flex justify-between text-sm">
                <span className="text-ink-mute">Due</span>
                <span className="text-ink tnum">
                  {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-ink-mute">Status</span>
              <span className={`font-normal capitalize ${isPaid ? 'text-primary' : isCancelled ? 'text-ink-mute' : 'text-ink'}`}>
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Action */}
          {isPaid ? (
            <div className="text-center">
              <p className="text-primary text-sm font-normal">Payment received</p>
              {invoice.paidAt && (
                <p className="text-ink-mute text-xs mt-1 tnum">
                  {new Date(invoice.paidAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          ) : isCancelled ? (
            <p className="text-ink-mute text-sm text-center">This invoice has been cancelled.</p>
          ) : (
            <PayButton invoiceId={invoice.id} />
          )}
        </div>

        <p className="text-center text-ink-mute text-xs mt-6">
          Powered by TinyCRM · Secured by Stripe
        </p>
      </div>
    </div>
  )
}
