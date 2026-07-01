import { H1, H2, Body, Note, Warning, NextLink, PrevLink } from '../components'

export default function AdminPage() {
  return (
    <div>
      <H1>Admin panel</H1>
      <Body>
        TinyCRM has a built-in admin panel at <strong className="font-normal text-ink">/admin</strong>.
        It lets the system administrator see all users, manage accounts, and view revenue stats.
      </Body>

      <H2>First account = admin</H2>
      <Body>
        The first account registered at <strong className="font-normal text-ink">/register</strong> automatically becomes the system administrator.
        All subsequent accounts are regular users with their own separate CRM workspace.
      </Body>
      <Note>
        Each user's data is completely isolated. A regular user cannot see other users' clients or invoices.
        Only admins have cross-user visibility.
      </Note>

      <H2>Accessing the admin panel</H2>
      <Body>
        Admins see an <strong className="font-normal text-ink">Admin panel</strong> link at the bottom of the sidebar.
        It opens <strong className="font-normal text-ink">/admin</strong> which has its own sidebar and layout.
      </Body>

      <H2>Admin panel pages</H2>
      <div className="divide-y divide-hairline border border-hairline rounded-lg overflow-hidden mb-8">
        {[
          ['/admin', 'Overview', 'System stats: total users, clients, invoices, revenue collected, and revenue outstanding. Recent users list.'],
          ['/admin/users', 'Users', 'All registered users with client and invoice counts. Click any user to view their details.'],
          ['/admin/users/[id]', 'User detail', 'View a user\'s clients and invoices. Promote to admin, demote, or delete the account.'],
        ].map(([path, title, desc]) => (
          <div key={path} className="px-4 py-4 bg-canvas">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-xs text-ink-mute" style={{ fontFamily: 'ui-monospace, monospace' }}>{path}</span>
              <span className="text-sm font-normal text-ink">{title}</span>
            </div>
            <p className="text-xs text-ink-mute leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <H2>Managing users</H2>
      <Body>On any user's detail page, admins can:</Body>
      <div className="space-y-3 mb-8">
        {[
          ['Make admin', 'Grants full admin access to the user. They will see the Admin panel link.'],
          ['Remove admin', 'Revokes admin access. The user becomes a regular user.'],
          ['Delete user', 'Permanently deletes the account and all their data (clients, invoices, timeline events).'],
        ].map(([action, desc]) => (
          <div key={action} className="flex items-start gap-3">
            <span className="text-sm font-normal text-ink shrink-0 w-28">{action}</span>
            <span className="text-sm text-ink-mute">{desc}</span>
          </div>
        ))}
      </div>
      <Warning>Deleting a user is permanent and cannot be undone. All their clients and invoices are deleted with the account.</Warning>

      <H2>Registration control</H2>
      <Body>
        Currently all registrations are open. If you want to restrict who can register,
        you can disable the registration page by removing or protecting <strong className="font-normal text-ink">/register</strong>.
        The easiest way is to add an invite check in the register action inside <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>lib/actions.ts</code>.
      </Body>

      <div className="mt-10 pt-8 border-t border-hairline flex items-center justify-between">
        <PrevLink href="/docs/invoicing">Invoicing</PrevLink>
        <NextLink href="/docs/scaling">Scaling</NextLink>
      </div>
    </div>
  )
}
