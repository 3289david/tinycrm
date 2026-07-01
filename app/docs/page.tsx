import Link from 'next/link'

const sections = [
  {
    id: 'install',
    title: 'Installation',
    content: [
      {
        heading: 'Requirements',
        body: `Your VPS needs Node.js 20+, PostgreSQL 14+, and Nginx. Works on Ubuntu, Debian, or any Linux distro. Compatible with servers managed by cPanel, DirectAdmin, or plain SSH access.`,
      },
      {
        heading: '1. Clone and install',
        code: `git clone https://github.com/yourusername/tinycrm.git /var/www/tinycrm
cd /var/www/tinycrm
npm install`,
      },
      {
        heading: '2. Configure environment',
        code: `cp .env.example .env
nano .env`,
        body: 'Fill in DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, and your Stripe keys.',
      },
      {
        heading: '3. Create the database',
        code: `sudo -u postgres psql
CREATE DATABASE tinycrm;
CREATE USER tinycrm WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE tinycrm TO tinycrm;
\\q`,
      },
      {
        heading: '4. Run migrations',
        code: `npx prisma migrate deploy
# or for first-time setup:
npx prisma db push`,
      },
      {
        heading: '5. Build and start',
        code: `npm run build
npm start
# or with PM2:
pm2 start ecosystem.config.js
pm2 save`,
      },
    ],
  },
  {
    id: 'nginx',
    title: 'Nginx setup',
    content: [
      {
        heading: 'Proxy config',
        body: 'Copy nginx.conf from the repo to /etc/nginx/sites-available/tinycrm and update the domain. Then enable and reload.',
        code: `cp nginx.conf /etc/nginx/sites-available/tinycrm
# edit the domain in the file
ln -s /etc/nginx/sites-available/tinycrm /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx`,
      },
      {
        heading: 'SSL with Let\'s Encrypt',
        code: `certbot --nginx -d yourdomain.com`,
      },
    ],
  },
  {
    id: 'stripe',
    title: 'Stripe setup',
    content: [
      {
        heading: 'Get your keys',
        body: 'Go to dashboard.stripe.com → Developers → API keys. Use the secret key and publishable key.',
      },
      {
        heading: 'Set up the webhook',
        body: 'Go to Developers → Webhooks → Add endpoint. Set the URL to:',
        code: `https://yourdomain.com/api/webhooks`,
        body2: 'Listen for the event: checkout.session.completed. Copy the signing secret into STRIPE_WEBHOOK_SECRET.',
      },
    ],
  },
  {
    id: 'admin',
    title: 'Admin panel',
    content: [
      {
        heading: 'First user is admin',
        body: 'The first account registered at /register automatically becomes the system administrator. All subsequent accounts are regular users.',
      },
      {
        heading: 'Admin panel access',
        body: 'Admins see an "Admin panel" link in the sidebar. The panel is at /admin and shows all users, clients, and revenue stats. Admins can promote/demote users and delete accounts.',
      },
    ],
  },
  {
    id: 'invoicing',
    title: 'Invoicing',
    content: [
      {
        heading: 'How it works',
        body: 'Open any client and scroll to Invoices. Click "New invoice", set the amount and description, and click Create. You get a payment link — share it with your client by email, message, or any way you like.',
      },
      {
        heading: 'Client payment',
        body: 'Your client opens the link in any browser. They see the invoice and click "Pay now". Stripe handles the card payment. When paid, the invoice status updates automatically via webhook.',
      },
      {
        heading: 'No client account needed',
        body: 'Your clients never need to register. The payment page is public — just a link.',
      },
    ],
  },
  {
    id: 'multi',
    title: 'Multiple instances',
    content: [
      {
        heading: 'Running multiple servers',
        body: 'TinyCRM is stateless — all state lives in PostgreSQL. You can run multiple Node.js instances behind Nginx with upstream load balancing.',
        code: `# In nginx.conf, replace the single proxy_pass with:
upstream tinycrm {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
}

# Then use:
proxy_pass http://tinycrm;`,
      },
      {
        heading: 'PM2 cluster mode',
        body: 'Change instances: 1 to instances: "max" in ecosystem.config.js to use all CPU cores.',
        code: `# ecosystem.config.js
instances: 'max',
exec_mode: 'cluster',`,
      },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between border-b border-hairline">
        <Link href="/" className="text-ink font-light text-xl tracking-tight">TinyCRM</Link>
        <div className="flex items-center gap-6">
          <span className="text-ink text-sm font-normal">Documentation</span>
          <Link href="/login" className="text-ink-mute hover:text-ink text-sm transition-colors">Sign in</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 flex gap-12">
        {/* Sidebar */}
        <aside className="w-48 shrink-0 hidden lg:block">
          <div className="sticky top-8">
            <p className="text-xs text-ink-mute mb-4 uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>Contents</p>
            <nav className="space-y-1">
              {sections.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-sm text-ink-mute hover:text-ink transition-colors py-1"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-16">
          <div>
            <h1 className="text-ink mb-3" style={{ fontSize: 36, fontWeight: 300, letterSpacing: '-0.64px' }}>
              Documentation
            </h1>
            <p className="text-ink-mute" style={{ fontSize: 16, lineHeight: 1.6 }}>
              TinyCRM is a self-hosted client management tool with built-in invoicing.
              Install it on any VPS or dedicated server.
            </p>
          </div>

          {sections.map(section => (
            <div key={section.id} id={section.id}>
              <h2 className="text-ink mb-8" style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.22px' }}>
                {section.title}
              </h2>
              <div className="space-y-8">
                {section.content.map((item, i) => (
                  <div key={i}>
                    <h3 className="text-ink font-normal text-sm mb-2" style={{ letterSpacing: '-0.1px' }}>
                      {item.heading}
                    </h3>
                    {item.body && <p className="text-ink-mute text-sm mb-3 leading-relaxed">{item.body}</p>}
                    {item.code && (
                      <pre className="bg-canvas-soft border border-hairline rounded-lg p-4 text-xs text-ink overflow-x-auto" style={{ fontFamily: 'ui-monospace, monospace', lineHeight: 1.7 }}>
                        {item.code}
                      </pre>
                    )}
                    {'body2' in item && item.body2 && (
                      <p className="text-ink-mute text-sm mt-3 leading-relaxed">{item.body2}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
