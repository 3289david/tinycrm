import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ServicesClient from './ServicesClient'

export default async function ServicesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const services = await prisma.service.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div className="max-w-2xl mx-auto px-8 py-10">
      <h1 className="text-ink mb-2" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
        Services
      </h1>
      <p className="text-ink-mute text-sm mb-8">
        Predefined services let you quickly fill in invoices and quotes.
      </p>
      <ServicesClient services={services} />
    </div>
  )
}
