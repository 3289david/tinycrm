import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import StatusSelector from './StatusSelector'
import EditClientForm from './EditClientForm'
import TimelineSection from './TimelineSection'
import InvoiceSection from './InvoiceSection'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const [client, tags, events, invoices] = await Promise.all([
    prisma.client.findFirst({
      where: { id: params.id, userId: session.user.id },
    }),
    prisma.clientTag.findMany({ where: { clientId: params.id } }),
    prisma.timelineEvent.findMany({
      where: { clientId: params.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.invoice.findMany({
      where: { clientId: params.id, userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  if (!client) notFound()

  const tagList = tags.map(t => t.tag)

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/app/clients" className="text-ink-mute hover:text-ink text-sm transition-colors">Clients</Link>
        <span className="text-ink-mute text-sm">/</span>
        <span className="text-ink text-sm">{client.name}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-ink mb-2" style={{ fontSize: 26, fontWeight: 300, letterSpacing: '-0.26px' }}>
            {client.name}
          </h1>
          <StatusBadge status={client.status} />
          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tagList.map(tag => (
                <span key={tag} className="text-xs font-normal text-primary-deep bg-primary-subdued px-2 py-0.5 rounded-pill" style={{ fontSize: 11 }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <StatusSelector clientId={params.id} current={client.status} />
      </div>

      <div className="space-y-8">
        <EditClientForm client={client} tags={tagList} />
        <div className="border-t border-hairline" />
        <InvoiceSection clientId={params.id} invoices={invoices} />
        <div className="border-t border-hairline" />
        <TimelineSection clientId={params.id} events={events} />
      </div>
    </div>
  )
}
