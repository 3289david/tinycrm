'use client'

import { deleteAccount_action } from '@/lib/actions'
import { useState } from 'react'

export default function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-ruby">Are you sure?</span>
        <button
          onClick={() => deleteAccount_action()}
          className="text-xs font-normal text-white bg-ruby px-3 py-1.5 rounded-pill hover:opacity-80 transition-opacity"
        >
          Delete
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-ink-mute hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm font-normal text-ruby border border-ruby px-4 py-2 rounded-pill hover:bg-ruby hover:text-white transition-colors"
    >
      Delete account
    </button>
  )
}
