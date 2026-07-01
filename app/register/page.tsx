'use client'

import { useState } from 'react'
import Link from 'next/link'
import { register_action } from '@/lib/actions'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const result = await register_action(fd)
    setLoading(false)
    if (result?.error) setError(result.error)
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <nav className="px-6 py-5">
        <a href="/" className="text-ink font-light text-xl tracking-tight">TinyCRM</a>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-ink mb-1" style={{ fontSize: 26, fontWeight: 300, letterSpacing: '-0.26px' }}>
            Create account
          </h1>
          <p className="text-ink-mute text-sm mb-8">
            Already have one?{' '}
            <Link href="/login" className="text-primary hover:underline">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              type="text"
              placeholder="Full name"
              required
              className="w-full px-3 py-2.5 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
              style={{ borderRadius: 6 }}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full px-3 py-2.5 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
              style={{ borderRadius: 6 }}
            />
            <input
              name="password"
              type="password"
              placeholder="Password (min. 8 characters)"
              required
              minLength={8}
              className="w-full px-3 py-2.5 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
              style={{ borderRadius: 6 }}
            />
            {error && <p className="text-ruby text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-normal text-sm py-2.5 rounded-pill hover:bg-primary-deep transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-ink-mute text-xs mt-6 leading-relaxed">
            The first account created becomes the system administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
