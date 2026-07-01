'use client'

import { useState } from 'react'
import { updateClient_action, deleteClient_action } from '@/lib/actions'

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  notes: string | null
}

export default function EditClientForm({ client, tags }: { client: Client; tags: string[] }) {
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    const result = await updateClient_action(client.id, formData)
    if (result?.error) { setError(result.error); return }
    setEditing(false)
    setError('')
  }

  async function handleDelete() {
    if (!confirm(`Delete ${client.name}? This cannot be undone.`)) return
    await deleteClient_action(client.id)
  }

  if (!editing) {
    return (
      <div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
          {[
            { label: 'Email', value: client.email },
            { label: 'Phone', value: client.phone },
            { label: 'Company', value: client.company },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-ink-mute mb-0.5 font-normal">{label}</p>
              <p className="text-sm text-ink">{value || <span className="text-ink-mute">—</span>}</p>
            </div>
          ))}
        </div>
        {client.notes && (
          <div className="mb-6">
            <p className="text-xs text-ink-mute mb-0.5 font-normal">Notes</p>
            <p className="text-sm text-ink whitespace-pre-wrap">{client.notes}</p>
          </div>
        )}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-primary hover:underline font-normal"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-sm text-ink-mute hover:text-ruby transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <Field name="name" label="Name" defaultValue={client.name ?? ''} required />
      <div className="grid grid-cols-2 gap-4">
        <Field name="email" label="Email" type="email" defaultValue={client.email ?? ''} />
        <Field name="phone" label="Phone" type="tel" defaultValue={client.phone ?? ''} />
      </div>
      <Field name="company" label="Company" defaultValue={client.company ?? ''} />
      <Field name="tags" label="Tags" defaultValue={tags.join(', ')} placeholder="VIP, Design (comma separated)" />
      <div>
        <label className="block text-xs text-ink-mute mb-1.5 font-normal">Notes</label>
        <textarea
          name="notes"
          rows={4}
          defaultValue={client.notes ?? ''}
          className="w-full px-3 py-2.5 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors resize-none"
          style={{ borderRadius: 6 }}
        />
      </div>
      {error && <p className="text-ruby text-sm">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="bg-primary text-white font-normal text-sm px-5 py-2.5 rounded-pill hover:bg-primary-deep transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => { setEditing(false); setError('') }}
          className="text-ink-mute text-sm hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function Field({
  name, label, type = 'text', defaultValue = '', placeholder, required,
}: {
  name: string; label: string; type?: string; defaultValue?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs text-ink-mute mb-1.5 font-normal">
        {label}{required && <span className="text-ruby ml-0.5">*</span>}
      </label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2.5 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
        style={{ borderRadius: 6 }}
      />
    </div>
  )
}
