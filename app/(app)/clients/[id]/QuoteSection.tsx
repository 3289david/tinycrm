'use client'

import { useState } from 'react'
import { createQuote_action, updateQuoteStatus_action, convertQuoteToInvoice_action } from '@/lib/actions'
import clsx from 'clsx'

interface Quote {
  id: string
  quoteNumber: string | null
  amountCents: number
  currency: string
  description: string
  status: string
  validUntil: Date | null
  createdAt: Date
}

interface Service {
  id: string
  name: string
  description: string | null
  priceCents: number
}

const STATUS_STYLE: Record<string, string> = {
  draft: 'text-ink-mute bg-canvas-soft border-hairline',
  sent: 'text-primary-deep bg-primary-subdued border-transparent',
  accepted: 'text-ink bg-canvas-soft border-hairline',
  declined: 'text-ruby bg-canvas border-ruby',
  expired: 'text-ink-mute bg-canvas border-hairline',
}

function fmt(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

function formatDate(d: Date | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function QuoteSection({
  clientId,
  quotes,
  services,
}: {
  clientId: string
  quotes: Quote[]
  services: Service[]
}) {
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  function applyService(svc: Service) {
    setAmount((svc.priceCents / 100).toFixed(2))
    setDescription(svc.name + (svc.description ? ` — ${svc.description}` : ''))
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await createQuote_action(clientId, new FormData(e.currentTarget))
    setLoading(false)
    if (result?.error) { setError(result.error); return }
    setShowForm(false)
    setAmount('')
    setDescription('')
  }

  async function markSent(id: string) {
    await updateQuoteStatus_action(id, clientId, 'sent')
  }
  async function markDeclined(id: string) {
    await updateQuoteStatus_action(id, clientId, 'declined')
  }
  async function handleConvert(id: string) {
    if (!confirm('Convert this quote to an invoice?')) return
    const result = await convertQuoteToInvoice_action(id, clientId)
    if (result?.error) alert(result.error)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-ink-mute uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>
          Quotes
        </p>
        <button
          onClick={() => setShowForm(v => !v)}
          className="text-xs font-normal text-primary hover:underline"
        >
          {showForm ? 'Cancel' : 'New quote'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 p-5 rounded-lg border border-hairline bg-canvas-soft space-y-3">
          {services.length > 0 && (
            <div>
              <label className="block text-xs text-ink-mute mb-1.5 font-normal">Quick-fill from service</label>
              <div className="flex flex-wrap gap-2">
                {services.map(svc => (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => applyService(svc)}
                    className="text-xs font-normal px-3 py-1.5 border border-hairline rounded-pill bg-canvas hover:bg-primary hover:text-white hover:border-primary transition-colors"
                  >
                    {svc.name} · {fmt(svc.priceCents)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-ink-mute mb-1 font-normal">Amount (USD)<span className="text-ruby ml-0.5">*</span></label>
              <input
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="500.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-mute mb-1 font-normal">Valid until</label>
              <input
                name="valid_until"
                type="date"
                className="w-full px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-ink-mute mb-1 font-normal">Description<span className="text-ruby ml-0.5">*</span></label>
            <input
              name="description"
              type="text"
              required
              placeholder="Website redesign"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs text-ink-mute mb-1 font-normal">Notes</label>
            <textarea
              name="notes"
              rows={2}
              placeholder="Any additional notes for the client..."
              className="w-full px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors rounded-md resize-none"
            />
          </div>
          {error && <p className="text-ruby text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white font-normal text-sm px-4 py-2 rounded-pill hover:bg-primary-deep transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create quote'}
          </button>
        </form>
      )}

      {quotes.length === 0 && !showForm && (
        <p className="text-ink-mute text-sm">No quotes yet.</p>
      )}

      {quotes.length > 0 && (
        <div className="space-y-2">
          {quotes.map(q => (
            <div key={q.id} className="py-3 border-b border-hairline last:border-0">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {q.quoteNumber && (
                      <span className="text-xs text-ink-mute tnum">{q.quoteNumber}</span>
                    )}
                    <span className="text-sm text-ink font-normal tnum">{fmt(q.amountCents)}</span>
                    <span
                      className={clsx('text-xs border px-2 py-0.5 rounded-pill', STATUS_STYLE[q.status])}
                      style={{ fontSize: 10 }}
                    >
                      {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-ink-mute truncate">{q.description}</p>
                  {q.validUntil && (
                    <p className="text-xs text-ink-mute tnum">Valid until {formatDate(q.validUntil)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  {q.status === 'draft' && (
                    <button onClick={() => markSent(q.id)} className="text-xs text-ink-mute hover:text-ink transition-colors">
                      Mark sent
                    </button>
                  )}
                  {(q.status === 'draft' || q.status === 'sent') && (
                    <>
                      <button
                        onClick={() => handleConvert(q.id)}
                        className="text-xs font-normal text-primary hover:underline"
                      >
                        Convert to invoice
                      </button>
                      <button onClick={() => markDeclined(q.id)} className="text-xs text-ink-mute hover:text-ruby transition-colors">
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
