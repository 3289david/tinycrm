import Link from 'next/link'
import { createClient_action } from '@/lib/actions'

export default function NewClientPage() {
  return (
    <div className="max-w-xl mx-auto px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/app/clients" className="text-ink-mute hover:text-ink text-sm transition-colors">Clients</Link>
        <span className="text-ink-mute text-sm">/</span>
        <span className="text-ink text-sm">New</span>
      </div>

      <h1 className="text-ink mb-8" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
        New client
      </h1>

      <form action={async (fd: FormData) => { 'use server'; await createClient_action(fd) }} className="space-y-4">
        <Field name="name" label="Name" required />
        <div className="grid grid-cols-2 gap-4">
          <Field name="email" label="Email" type="email" />
          <Field name="phone" label="Phone" type="tel" />
        </div>
        <Field name="company" label="Company" />
        <Field name="tags" label="Tags" placeholder="VIP, Design, Retainer (comma separated)" />
        <div>
          <label className="block text-xs text-ink-mute mb-1.5 font-normal">Notes</label>
          <textarea
            name="notes"
            rows={4}
            className="w-full px-3 py-2.5 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors resize-none"
            style={{ borderRadius: 6 }}
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-primary text-white font-normal text-sm px-5 py-2.5 rounded-pill hover:bg-primary-deep transition-colors"
          >
            Create client
          </button>
          <Link href="/app/clients" className="text-ink-mute text-sm hover:text-ink transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  )
}

function Field({ name, label, type = 'text', placeholder, required }: {
  name: string; label: string; type?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs text-ink-mute mb-1.5 font-normal">
        {label}{required && <span className="text-ruby ml-0.5">*</span>}
      </label>
      <input
        name={name} type={type} required={required} placeholder={placeholder}
        className="w-full px-3 py-2.5 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
        style={{ borderRadius: 6 }}
      />
    </div>
  )
}
