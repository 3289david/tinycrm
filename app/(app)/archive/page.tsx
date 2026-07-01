import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ArchivePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, company, created_at')
    .eq('user_id', user.id)
    .eq('status', 'archived')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <h1 className="text-ink mb-8" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
        Archive
      </h1>

      {!clients || clients.length === 0 ? (
        <p className="text-ink-mute text-sm">No archived clients.</p>
      ) : (
        <div className="divide-y divide-hairline">
          {clients.map(c => (
            <Link
              key={c.id}
              href={`/app/clients/${c.id}`}
              className="flex items-center justify-between py-4 hover:bg-canvas-soft -mx-4 px-4 rounded-md transition-colors group"
            >
              <div>
                <p className="text-ink text-sm font-normal group-hover:text-primary transition-colors">{c.name}</p>
                {c.company && <p className="text-ink-mute text-xs mt-0.5">{c.company}</p>}
              </div>
              <span className="text-ink-mute text-xs tnum">
                {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
