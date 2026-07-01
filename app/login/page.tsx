'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  async function signInWithProvider(provider: 'google' | 'github') {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <nav className="px-6 py-5">
        <a href="/" className="text-ink font-light text-xl tracking-tight">TinyCRM</a>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-ink mb-1" style={{ fontSize: 26, fontWeight: 300, letterSpacing: '-0.26px' }}>
            Sign in
          </h1>
          <p className="text-ink-mute text-sm mb-8">No password required.</p>

          {sent ? (
            <div className="p-6 rounded-lg border border-hairline bg-canvas-soft">
              <p className="text-ink text-sm font-normal mb-1">Check your email</p>
              <p className="text-ink-mute text-sm">We sent a magic link to <span className="text-ink">{email}</span>.</p>
            </div>
          ) : (
            <>
              <form onSubmit={signInWithEmail} className="space-y-3 mb-6">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-sm border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
                  style={{ borderRadius: 6 }}
                />
                {error && <p className="text-ruby text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-normal text-sm py-2.5 rounded-pill hover:bg-primary-deep transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send magic link'}
                </button>
              </form>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-hairline" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-canvas px-3 text-ink-mute text-xs">or</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => signInWithProvider('google')}
                  className="w-full border border-hairline text-ink text-sm font-normal py-2.5 rounded-pill hover:border-hairline-input transition-colors"
                >
                  Continue with Google
                </button>
                <button
                  onClick={() => signInWithProvider('github')}
                  className="w-full border border-hairline text-ink text-sm font-normal py-2.5 rounded-pill hover:border-hairline-input transition-colors"
                >
                  Continue with GitHub
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
