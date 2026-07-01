import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ExportButton from './ExportButton'
import UpgradeButton from './UpgradeButton'
import DeleteAccountButton from './DeleteAccountButton'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const { count: clientCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .neq('status', 'archived')

  const plan = profile?.plan ?? 'free'
  const isPro = plan === 'pro'

  return (
    <div className="max-w-xl mx-auto px-8 py-10">
      <h1 className="text-ink mb-8" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
        Settings
      </h1>

      <div className="space-y-8">
        {/* Account */}
        <section>
          <p className="text-xs text-ink-mute mb-4 uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>Account</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-ink-mute">Email</span>
              <span className="text-sm text-ink">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-ink-mute">Plan</span>
              <span className="text-sm text-ink font-normal capitalize">{plan}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-ink-mute">Active clients</span>
              <span className="text-sm text-ink tnum">
                {clientCount ?? 0}{!isPro && ' / 100'}
              </span>
            </div>
          </div>
        </section>

        <div className="border-t border-hairline" />

        {/* Pro */}
        {!isPro && (
          <>
            <section>
              <p className="text-xs text-ink-mute mb-4 uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>Upgrade</p>
              <div className="p-6 rounded-lg border border-hairline bg-canvas-soft">
                <p className="text-ink text-sm font-normal mb-1">Pro — $4/month</p>
                <p className="text-ink-mute text-sm mb-4">Unlimited clients, CSV export, and backup.</p>
                <UpgradeButton />
              </div>
            </section>
            <div className="border-t border-hairline" />
          </>
        )}

        {/* Export */}
        <section>
          <p className="text-xs text-ink-mute mb-4 uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>Data</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink">Export clients</p>
              <p className="text-xs text-ink-mute mt-0.5">Download all your client data as CSV.</p>
            </div>
            <ExportButton isPro={isPro} />
          </div>
        </section>

        <div className="border-t border-hairline" />

        {/* Danger */}
        <section>
          <p className="text-xs text-ink-mute mb-4 uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>Danger zone</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink">Delete account</p>
              <p className="text-xs text-ink-mute mt-0.5">Permanently remove all your data.</p>
            </div>
            <DeleteAccountButton />
          </div>
        </section>
      </div>
    </div>
  )
}
