'use client'

import { useState, useRef } from 'react'
import { changePassword_action } from '@/lib/actions'

export default function PasswordForm() {
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const ref = useRef<HTMLFormElement>(null)

  async function handleSubmit(fd: FormData) {
    setError('')
    const result = await changePassword_action(fd)
    if (result?.error) { setError(result.error); return }
    setSaved(true)
    ref.current?.reset()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form ref={ref} action={handleSubmit} className="space-y-3">
      {['current', 'password', 'confirm'].map((name, i) => (
        <input
          key={name}
          name={name}
          type="password"
          placeholder={['Current password', 'New password', 'Confirm new password'][i]}
          required
          className="w-full px-3 py-2.5 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
          style={{ borderRadius: 6 }}
        />
      ))}
      {error && <p className="text-ruby text-sm">{error}</p>}
      <button
        type="submit"
        className="bg-primary text-white font-normal text-sm px-4 py-2 rounded-pill hover:bg-primary-deep transition-colors"
      >
        {saved ? 'Changed' : 'Change password'}
      </button>
    </form>
  )
}
