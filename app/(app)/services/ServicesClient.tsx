'use client'

import { useState } from 'react'
import { createService_action, updateService_action, deleteService_action } from '@/lib/actions'

interface Service {
  id: string
  name: string
  description: string | null
  priceCents: number
  currency: string
}

function fmt(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export default function ServicesClient({ services: initial }: { services: Service[] }) {
  const [services, setServices] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await createService_action(new FormData(e.currentTarget))
    setLoading(false)
    if (result?.error) { setError(result.error); return }
    setShowForm(false)
    window.location.reload()
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await updateService_action(id, new FormData(e.currentTarget))
    setLoading(false)
    if (result?.error) { setError(result.error); return }
    setEditId(null)
    window.location.reload()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this service?')) return
    await deleteService_action(id)
    setServices(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span />
        <button
          onClick={() => setShowForm(v => !v)}
          className="bg-primary text-white font-normal text-sm px-4 py-2 rounded-pill hover:bg-primary-deep transition-colors"
        >
          {showForm ? 'Cancel' : 'Add service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 p-5 rounded-lg border border-hairline bg-canvas-soft space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-ink-mute mb-1 font-normal">Name<span className="text-ruby ml-0.5">*</span></label>
              <input name="name" required placeholder="Web design" className="w-full px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors rounded-md" />
            </div>
            <div>
              <label className="block text-xs text-ink-mute mb-1 font-normal">Price (USD)<span className="text-ruby ml-0.5">*</span></label>
              <input name="price" type="number" step="0.01" min="0" required placeholder="500.00" className="w-full px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-ink-mute mb-1 font-normal">Description</label>
            <input name="description" placeholder="Brief description" className="w-full px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors rounded-md" />
          </div>
          {error && <p className="text-ruby text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="bg-primary text-white font-normal text-sm px-4 py-2 rounded-pill hover:bg-primary-deep transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Save service'}
          </button>
        </form>
      )}

      {services.length === 0 && !showForm ? (
        <div className="py-16 text-center border border-dashed border-hairline rounded-lg">
          <p className="text-ink-mute text-sm">No services yet.</p>
          <p className="text-ink-mute text-xs mt-1">Add one to use as a template when creating invoices.</p>
        </div>
      ) : (
        <div className="divide-y divide-hairline border border-hairline rounded-lg overflow-hidden">
          {services.map(svc => (
            <div key={svc.id}>
              {editId === svc.id ? (
                <form onSubmit={e => handleUpdate(e, svc.id)} className="p-4 bg-canvas-soft space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-ink-mute mb-1 font-normal">Name</label>
                      <input name="name" defaultValue={svc.name} required className="w-full px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors rounded-md" />
                    </div>
                    <div>
                      <label className="block text-xs text-ink-mute mb-1 font-normal">Price (USD)</label>
                      <input name="price" type="number" step="0.01" min="0" defaultValue={(svc.priceCents / 100).toFixed(2)} required className="w-full px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors rounded-md" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-ink-mute mb-1 font-normal">Description</label>
                    <input name="description" defaultValue={svc.description ?? ''} className="w-full px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors rounded-md" />
                  </div>
                  {error && <p className="text-ruby text-sm">{error}</p>}
                  <div className="flex gap-2">
                    <button type="submit" disabled={loading} className="bg-primary text-white font-normal text-sm px-4 py-2 rounded-pill hover:bg-primary-deep transition-colors disabled:opacity-50">
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={() => setEditId(null)} className="text-sm text-ink-mute hover:text-ink transition-colors px-2">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between px-5 py-4 bg-canvas hover:bg-canvas-soft transition-colors">
                  <div>
                    <p className="text-sm font-normal text-ink">{svc.name}</p>
                    {svc.description && <p className="text-xs text-ink-mute">{svc.description}</p>}
                  </div>
                  <div className="flex items-center gap-4 ml-4 shrink-0">
                    <p className="text-sm text-ink tnum font-normal">{fmt(svc.priceCents)}</p>
                    <button onClick={() => setEditId(svc.id)} className="text-xs text-ink-mute hover:text-ink transition-colors">Edit</button>
                    <button onClick={() => handleDelete(svc.id)} className="text-xs text-ink-mute hover:text-ruby transition-colors">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
