'use client'

import { useState } from 'react'
import { exportClients_action } from '@/lib/actions'

export default function ExportButton({ isPro }: { isPro: boolean }) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    if (!isPro) {
      alert('Export is a Pro feature. Upgrade to download your data.')
      return
    }
    setLoading(true)
    const result = await exportClients_action()
    setLoading(false)
    if (result.error) { alert(result.error); return }
    if (!result.csv) return

    const blob = new Blob([result.csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clients-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`text-sm font-normal px-4 py-2 rounded-pill border transition-colors disabled:opacity-50 ${
        isPro
          ? 'border-primary text-primary hover:bg-primary hover:text-white'
          : 'border-hairline text-ink-mute'
      }`}
    >
      {loading ? 'Exporting...' : 'Export CSV'}
    </button>
  )
}
