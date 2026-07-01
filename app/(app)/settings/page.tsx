import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ExportButton from './ExportButton'
import DeleteAccountButton from './DeleteAccountButton'
import ProfileForm from './ProfileForm'
import PasswordForm from './PasswordForm'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const [user, clientCount, invoiceCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true, name: true, company: true } }),
    prisma.client.count({ where: { userId: session.user.id, status: { not: 'archived' } } }),
    prisma.invoice.count({ where: { userId: session.user.id, status: 'pending' } }),
  ])

  return (
    <div className="max-w-xl mx-auto px-8 py-10">
      <h1 className="text-ink mb-8" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
        Settings
      </h1>

      <div className="space-y-8">
        {/* Stats */}
        <section>
          <p className="text-xs text-ink-mute mb-4 uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>Account</p>
          <div className="space-y-2">
            {[
              { label: 'Email', value: user?.email },
              { label: 'Active clients', value: String(clientCount) },
              { label: 'Pending invoices', value: String(invoiceCount) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-hairline last:border-0">
                <span className="text-sm text-ink-mute">{label}</span>
                <span className="text-sm text-ink tnum">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-hairline" />

        {/* Profile */}
        <section>
          <p className="text-xs text-ink-mute mb-4 uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>Profile</p>
          <ProfileForm name={user?.name ?? ''} company={user?.company ?? ''} />
        </section>

        <div className="border-t border-hairline" />

        {/* Password */}
        <section>
          <p className="text-xs text-ink-mute mb-4 uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>Password</p>
          <PasswordForm />
        </section>

        <div className="border-t border-hairline" />

        {/* Export */}
        <section>
          <p className="text-xs text-ink-mute mb-4 uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>Data</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink">Export clients</p>
              <p className="text-xs text-ink-mute mt-0.5">Download all client data as CSV.</p>
            </div>
            <ExportButton />
          </div>
        </section>

        <div className="border-t border-hairline" />

        {/* Danger */}
        <section>
          <p className="text-xs text-ink-mute mb-4 uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>Danger zone</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink">Delete account</p>
              <p className="text-xs text-ink-mute mt-0.5">Permanently remove your account and all data.</p>
            </div>
            <DeleteAccountButton />
          </div>
        </section>
      </div>
    </div>
  )
}
