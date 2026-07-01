'use client'

import { addTimelineEvent_action } from '@/lib/actions'
import { useRef } from 'react'

interface Event {
  id: string
  content: string
  created_at: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
}

export default function TimelineSection({ clientId, events }: { clientId: string; events: Event[] }) {
  const ref = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    await addTimelineEvent_action(clientId, formData)
    ref.current?.reset()
  }

  return (
    <div>
      <p className="text-xs text-ink-mute mb-4 font-normal uppercase" style={{ letterSpacing: '0.1px', fontSize: 10 }}>
        Timeline
      </p>

      {/* Add event */}
      <form ref={ref} action={handleSubmit} className="flex gap-2 mb-6">
        <input
          name="content"
          placeholder="Log a note, call, or meeting..."
          required
          className="flex-1 px-3 py-2 border border-hairline-input text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
          style={{ borderRadius: 6 }}
        />
        <button
          type="submit"
          className="bg-primary text-white font-normal text-sm px-4 py-2 rounded-pill hover:bg-primary-deep transition-colors shrink-0"
        >
          Add
        </button>
      </form>

      {/* Events */}
      {events.length === 0 ? (
        <p className="text-ink-mute text-sm">No activity yet.</p>
      ) : (
        <div className="space-y-0">
          {events.map((e, i) => (
            <div key={e.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-hairline-input mt-1.5 shrink-0" />
                {i < events.length - 1 && <div className="w-px flex-1 bg-hairline mt-1" />}
              </div>
              <div className="pb-4 min-w-0">
                <p className="text-ink text-sm">{e.content}</p>
                <p className="text-ink-mute text-xs mt-0.5 tnum">{formatDate(e.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
