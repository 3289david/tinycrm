'use client'

import { useState } from 'react'
import { updateProfile_action } from '@/lib/actions'

export default function ProfileForm({ name, company }: { name: string; company: string }) {
  const [saved, setSaved] = useState(false)

  async function handleSubmit(fd: FormData) {
    await updateProfile_action(fd)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs text-ink-mute mb-1.5 font-normal">Name</label>
        <input
          name="name"
          defaultValue={name}
          className="w-full px-3 py-2.5 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
          style={{ borderRadius: 6 }}
        />
      </div>
      <div>
        <label className="block text-xs text-ink-mute mb-1.5 font-normal">Company</label>
        <input
          name="company"
          defaultValue={company}
          placeholder="Your company name"
          className="w-full px-3 py-2.5 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
          style={{ borderRadius: 6 }}
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white font-normal text-sm px-4 py-2 rounded-pill hover:bg-primary-deep transition-colors"
      >
        {saved ? 'Saved' : 'Save'}
      </button>
    </form>
  )
}
