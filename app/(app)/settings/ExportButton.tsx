'use client'

import { useState } from 'react'
import { exportClients_action } from '@/lib/actions'

export default function ExportButton() {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    const result = await exportClients_action()
    setLoading(false)
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
      className="border border-primary text-primary font-normal text-sm px-4 py-2 rounded-pill hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
    >
      {loading ? 'Exporting...' : 'Export CSV'}
    </button>
  )
}
