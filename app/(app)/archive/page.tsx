import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ArchivePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id, status: 'archived' },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <h1 className="text-ink mb-8" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
        Archive
      </h1>

      {clients.length === 0 ? (
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
                {new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
