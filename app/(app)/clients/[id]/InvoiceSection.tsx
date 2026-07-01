'use client'

import { useState } from 'react'
import { createInvoice_action, cancelInvoice_action } from '@/lib/actions'
import clsx from 'clsx'

interface Invoice {
  id: string
  amountCents: number
  currency: string
  description: string
  status: string
  dueDate: Date | null
  paidAt: Date | null
  createdAt: Date
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'text-ink-mute bg-canvas-soft border-hairline',
  paid: 'text-primary-deep bg-primary-subdued border-transparent',
  cancelled: 'text-ink-mute bg-canvas border-hairline line-through',
  refunded: 'text-ruby bg-canvas border-ruby',
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100)
}

function formatDate(d: Date | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function InvoiceSection({ clientId, invoices }: { clientId: string; invoices: Invoice[] }) {
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const result = await createInvoice_action(clientId, fd)
    setLoading(false)
    if (result?.error) { setError(result.error); return }
    setShowForm(false)
    ;(e.target as HTMLFormElement).reset()
  }

  function copyLink(invoiceId: string) {
    const url = `${window.location.origin}/pay/${invoiceId}`
    navigator.clipboard.writeText(url)
    setCopied(invoiceId)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-ink-mute uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>
          Invoices
        </p>
        <button
          onClick={() => setShowForm(v => !v)}
          className="text-xs font-normal text-primary hover:underline"
        >
          {showForm ? 'Cancel' : 'New invoice'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 p-5 rounded-lg border border-hairline bg-canvas-soft space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-ink-mute mb-1 font-normal">Amount (USD)<span className="text-ruby ml-0.5">*</span></label>
              <input
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="100.00"
                required
                className="w-full px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
                style={{ borderRadius: 6 }}
              />
            </div>
            <div>
              <label className="block text-xs text-ink-mute mb-1 font-normal">Due date</label>
              <input
                name="due_date"
                type="date"
                className="w-full px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
                style={{ borderRadius: 6 }}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-ink-mute mb-1 font-normal">Description<span className="text-ruby ml-0.5">*</span></label>
            <input
              name="description"
              type="text"
              placeholder="Web design — June 2025"
              required
              className="w-full px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
              style={{ borderRadius: 6 }}
            />
          </div>
          <input type="hidden" name="currency" value="usd" />
          {error && <p className="text-ruby text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white font-normal text-sm px-4 py-2 rounded-pill hover:bg-primary-deep transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create invoice'}
          </button>
        </form>
      )}

      {invoices.length === 0 && !showForm && (
        <p className="text-ink-mute text-sm">No invoices yet.</p>
      )}

      {invoices.length > 0 && (
        <div className="space-y-2">
          {invoices.map(inv => (
            <div key={inv.id} className="flex items-center justify-between py-3 border-b border-hairline last:border-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm text-ink font-normal tnum">
                    {formatMoney(inv.amountCents, inv.currency)}
                  </span>
                  <span className={clsx('text-xs border px-2 py-0.5 rounded-pill', STATUS_STYLE[inv.status])}
                    style={{ fontSize: 10 }}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-ink-mute truncate">{inv.description}</p>
                {inv.dueDate && (
                  <p className="text-xs text-ink-mute tnum">Due {formatDate(inv.dueDate)}</p>
                )}
                {inv.paidAt && (
                  <p className="text-xs text-ink-mute tnum">Paid {formatDate(inv.paidAt)}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                {inv.status === 'pending' && (
                  <>
                    <button
                      onClick={() => copyLink(inv.id)}
                      className="text-xs font-normal text-primary hover:underline"
                    >
                      {copied === inv.id ? 'Copied' : 'Copy link'}
                    </button>
                    <button
                      onClick={() => cancelInvoice_action(inv.id, clientId)}
                      className="text-xs text-ink-mute hover:text-ruby transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
