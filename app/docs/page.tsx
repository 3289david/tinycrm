import Link from 'next/link'

const quickStart = `# 1. Clone
git clone https://github.com/yourusername/tinycrm /var/www/tinycrm
cd /var/www/tinycrm && npm install

# 2. Configure
cp .env.example .env && nano .env

# 3. Database
sudo -u postgres psql -c "CREATE DATABASE tinycrm;"
npx prisma db push

# 4. Build & run
npm run build
pm2 start ecosystem.config.js`

const cards = [
  {
    href: '/docs/installation',
    title: 'Installation',
    body: 'Clone, configure environment variables, set up PostgreSQL, and go live.',
  },
  {
    href: '/docs/nginx',
    title: 'Nginx & SSL',
    body: 'Proxy TinyCRM behind Nginx with HTTPS via Let\'s Encrypt.',
  },
  {
    href: '/docs/stripe',
    title: 'Stripe payments',
    body: 'Accept card payments from your clients. Set up keys and the webhook.',
  },
  {
    href: '/docs/invoicing',
    title: 'Invoicing',
    body: 'Create invoices, share a link. Your client pays, you get notified.',
  },
  {
    href: '/docs/admin',
    title: 'Admin panel',
    body: 'Manage all users, view revenue stats, promote and remove admins.',
  },
  {
    href: '/docs/scaling',
    title: 'Scaling',
    body: 'Run multiple instances with Nginx upstream and PM2 cluster mode.',
  },
]

export default function DocsHomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-12">
        <p className="text-primary font-normal mb-3 uppercase" style={{ fontSize: 11, letterSpacing: '0.1px' }}>
          Documentation
        </p>
        <h1 className="text-ink mb-4" style={{ fontSize: 40, fontWeight: 300, lineHeight: 1.1, letterSpacing: '-1px' }}>
          TinyCRM
        </h1>
        <p className="text-ink-mute mb-6" style={{ fontSize: 16, lineHeight: 1.6, maxWidth: 480 }}>
          Self-hosted client management with built-in invoicing.
          Runs on any VPS or dedicated server — no cloud required.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/docs/installation"
            className="bg-primary text-white font-normal text-sm px-4 py-2 rounded-pill hover:bg-primary-deep transition-colors"
          >
            Get started
          </Link>
          <Link
            href="/register"
            className="text-sm text-ink-mute hover:text-ink transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>

      {/* Quick start */}
      <div className="mb-12">
        <h2 className="text-ink mb-4" style={{ fontSize: 16, fontWeight: 300, letterSpacing: '-0.2px' }}>
          Quick start
        </h2>
        <pre
          className="bg-ink text-canvas-soft rounded-lg p-5 text-xs overflow-x-auto"
          style={{ fontFamily: 'ui-monospace, "Cascadia Code", monospace', lineHeight: 1.8 }}
        >
          {quickStart}
        </pre>
      </div>

      {/* Divider */}
      <div className="border-t border-hairline mb-10" />

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(({ href, title, body }) => (
          <Link
            key={href}
            href={href}
            className="p-6 rounded-lg border border-hairline bg-canvas hover:border-hairline-input hover:shadow-card transition-all group"
          >
            <p className="text-ink text-sm font-normal mb-1.5 group-hover:text-primary transition-colors" style={{ letterSpacing: '-0.1px' }}>
              {title}
            </p>
            <p className="text-ink-mute text-sm leading-relaxed">{body}</p>
          </Link>
        ))}
      </div>

      {/* Stack */}
      <div className="mt-12 pt-10 border-t border-hairline">
        <p className="text-xs text-ink-mute mb-4 uppercase font-normal" style={{ fontSize: 10, letterSpacing: '0.1px' }}>Stack</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {[
            ['Framework', 'Next.js 14 (App Router)'],
            ['Database', 'PostgreSQL + Prisma'],
            ['Auth', 'NextAuth.js — email/password'],
            ['Payments', 'Stripe Checkout'],
            ['Process manager', 'PM2'],
            ['Web server', 'Nginx'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline gap-2 py-1.5 border-b border-hairline">
              <span className="text-xs text-ink-mute shrink-0">{label}</span>
              <span className="text-xs text-ink ml-auto tnum">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
