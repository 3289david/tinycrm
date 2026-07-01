import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'

function timeAgo(date: string | null) {
  if (!date) return 'Never'
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const q = searchParams.q?.trim() ?? ''

  let query = supabase
    .from('clients')
    .select('id, name, email, company, status, last_contact_at, created_at')
    .eq('user_id', user.id)
    .neq('status', 'archived')
    .order('created_at', { ascending: false })

  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,company.ilike.%${q}%`)
  }

  const { data: clients } = await query

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-ink" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
          Clients
        </h1>
        <Link
          href="/app/clients/new"
          className="bg-primary text-white font-normal text-sm px-4 py-2 rounded-pill hover:bg-primary-deep transition-colors"
        >
          New client
        </Link>
      </div>

      {/* Search */}
      <form className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search..."
          autoComplete="off"
          className="w-full px-3 py-2.5 rounded-sm border border-hairline text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
          style={{ borderRadius: 6 }}
        />
      </form>

      {/* List */}
      {!clients || clients.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-ink-mute text-sm">
            {q ? 'No results.' : 'No clients yet.'}
          </p>
          {!q && (
            <Link href="/app/clients/new" className="text-primary text-sm hover:underline mt-2 inline-block">
              Add your first client
            </Link>
          )}
        </div>
      ) : (
        <div className="divide-y divide-hairline">
          {clients.map(c => (
            <Link
              key={c.id}
              href={`/app/clients/${c.id}`}
              className="flex items-center justify-between py-4 hover:bg-canvas-soft -mx-4 px-4 rounded-md transition-colors group"
            >
              <div>
                <p className="text-ink text-sm font-normal group-hover:text-primary transition-colors">
                  {c.name}
                </p>
                {c.company && (
                  <p className="text-ink-mute text-xs mt-0.5">{c.company}</p>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-ink-mute text-xs tnum hidden sm:block">
                  {timeAgo(c.last_contact_at ?? c.created_at)}
                </span>
                <StatusBadge status={c.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
