'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminDeleteUser_action, adminToggleAdmin_action } from '@/lib/actions'

export default function AdminUserActions({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    await adminDeleteUser_action(userId)
    router.push('/admin/users')
    router.refresh()
  }

  async function handleToggleAdmin() {
    await adminToggleAdmin_action(userId, !isAdmin)
    router.refresh()
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleToggleAdmin}
        className="text-xs font-normal border border-primary text-primary px-3 py-1.5 rounded-pill hover:bg-primary hover:text-white transition-colors"
      >
        {isAdmin ? 'Remove admin' : 'Make admin'}
      </button>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="text-xs font-normal text-ruby border border-ruby px-3 py-1.5 rounded-pill hover:bg-ruby hover:text-white transition-colors"
        >
          Delete user
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs text-ruby">Confirm?</span>
          <button
            onClick={handleDelete}
            className="text-xs font-normal text-white bg-ruby px-3 py-1.5 rounded-pill hover:opacity-80 transition-opacity"
          >
            Delete
          </button>
          <button onClick={() => setConfirming(false)} className="text-xs text-ink-mute hover:text-ink transition-colors">
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
