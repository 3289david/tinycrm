import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import StatusSelector from './StatusSelector'
import EditClientForm from './EditClientForm'
import TimelineSection from './TimelineSection'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: client }, { data: tags }, { data: events }] = await Promise.all([
    supabase
      .from('clients')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('client_tags')
      .select('tag')
      .eq('client_id', params.id),
    supabase
      .from('timeline_events')
      .select('*')
      .eq('client_id', params.id)
      .order('created_at', { ascending: false }),
  ])

  if (!client) notFound()

  const tagList = tags?.map(t => t.tag) ?? []

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/app/clients" className="text-ink-mute hover:text-ink text-sm transition-colors">
          Clients
        </Link>
        <span className="text-ink-mute text-sm">/</span>
        <span className="text-ink text-sm">{client.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-ink mb-2" style={{ fontSize: 26, fontWeight: 300, letterSpacing: '-0.26px' }}>
            {client.name}
          </h1>
          <StatusBadge status={client.status} />
          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tagList.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-normal text-primary-deep bg-primary-subdued px-2 py-0.5 rounded-pill"
                  style={{ fontSize: 11 }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <StatusSelector clientId={params.id} current={client.status} />
      </div>

      <div className="space-y-8">
        {/* Edit form */}
        <EditClientForm client={client} tags={tagList} />

        {/* Divider */}
        <div className="border-t border-hairline" />

        {/* Timeline */}
        <TimelineSection clientId={params.id} events={events ?? []} />
      </div>
    </div>
  )
}
