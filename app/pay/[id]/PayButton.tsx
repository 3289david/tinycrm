'use client'

import { useState } from 'react'

export default function PayButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePay() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/invoice-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      })
      const { url, error: err } = await res.json()
      if (err) { setError(err); return }
      window.location.href = url
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-primary text-white font-normal text-sm py-3 rounded-pill hover:bg-primary-deep transition-colors disabled:opacity-50"
      >
        {loading ? 'Redirecting to payment...' : 'Pay now'}
      </button>
      {error && <p className="text-ruby text-sm text-center mt-3">{error}</p>}
    </div>
  )
}
