import clsx from 'clsx'

const STATUS_LABELS: Record<string, string> = {
  lead: 'Lead',
  working: 'Working',
  done: 'Done',
  archived: 'Archived',
}

const STATUS_STYLES: Record<string, string> = {
  lead: 'bg-canvas-soft text-ink-mute border-hairline',
  working: 'bg-primary-subdued text-primary-deep border-transparent',
  done: 'bg-canvas-soft text-ink border-hairline',
  archived: 'bg-canvas text-ink-mute border-hairline',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-block text-xs font-normal border px-2.5 py-0.5 rounded-pill',
        STATUS_STYLES[status] ?? STATUS_STYLES.lead,
      )}
      style={{ fontSize: 11, letterSpacing: '0.1px' }}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
