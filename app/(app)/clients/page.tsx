import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'

function timeAgo(date: Date | null) {
  if (!date) return 'Never'
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const q = searchParams.q?.trim() ?? ''

  const clients = await prisma.client.findMany({
    where: {
      userId: session.user.id,
      status: { not: 'archived' },
      ...(q ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { company: { contains: q, mode: 'insensitive' } },
        ],
      } : {}),
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, email: true, company: true,
      status: true, lastContactAt: true, createdAt: true,
    },
  })

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

      <form className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name, email, company..."
          autoComplete="off"
          className="w-full px-3 py-2.5 border border-hairline text-ink text-sm bg-canvas outline-none focus:border-primary transition-colors"
          style={{ borderRadius: 6 }}
        />
      </form>

      {clients.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-ink-mute text-sm">{q ? 'No results.' : 'No clients yet.'}</p>
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
              <div className="min-w-0">
                <p className="text-ink text-sm font-normal group-hover:text-primary transition-colors truncate">
                  {c.name}
                </p>
                {c.company && (
                  <p className="text-ink-mute text-xs mt-0.5 truncate">{c.company}</p>
                )}
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className="text-ink-mute text-xs tnum hidden sm:block">
                  {timeAgo(c.lastContactAt ?? c.createdAt)}
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
