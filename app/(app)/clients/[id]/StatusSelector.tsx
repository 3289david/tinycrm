'use client'

import { updateStatus_action } from '@/lib/actions'
import clsx from 'clsx'

const STATUSES = ['lead', 'working', 'done', 'archived']
const LABELS: Record<string, string> = { lead: 'Lead', working: 'Working', done: 'Done', archived: 'Archive' }

export default function StatusSelector({ clientId, current }: { clientId: string; current: string }) {
  return (
    <div className="flex gap-1">
      {STATUSES.map(s => (
        <button
          key={s}
          onClick={() => updateStatus_action(clientId, s)}
          className={clsx(
            'text-xs font-normal px-2.5 py-1 rounded-pill border transition-colors',
            current === s
              ? 'bg-primary text-white border-primary'
              : 'text-ink-mute border-hairline hover:border-hairline-input hover:text-ink',
          )}
          style={{ fontSize: 11 }}
        >
          {LABELS[s]}
        </button>
      ))}
    </div>
  )
}
