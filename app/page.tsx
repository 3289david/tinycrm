import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className="text-ink font-light text-xl tracking-tight">TinyCRM</span>
        <Link
          href="/login"
          className="text-ink-mute hover:text-ink text-sm transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <div className="mesh-backdrop pb-24 pt-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-normal text-primary mb-4 tracking-wide uppercase" style={{ letterSpacing: '0.1px', fontSize: 11 }}>
              The simplest CRM
            </p>
            <h1
              className="text-ink mb-6"
              style={{ fontSize: 52, fontWeight: 300, lineHeight: 1.04, letterSpacing: '-1.4px' }}
            >
              Your clients.
              <br />
              Nothing else.
            </h1>
            <p className="text-ink-mute mb-10" style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.5, maxWidth: 480 }}>
              Know who you work with. Remember the last call.
              Leave a note. That is all TinyCRM does — and that is the point.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="bg-primary text-white font-normal text-sm px-5 py-2.5 rounded-pill hover:bg-primary-deep transition-colors"
              >
                Start free
              </Link>
              <Link
                href="#pricing"
                className="text-sm text-ink-mute hover:text-ink transition-colors"
              >
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* No-feature strip */}
      <div className="bg-canvas-soft border-y border-hairline py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { label: 'No AI', sub: 'You know your clients better than an algorithm does.' },
              { label: 'No pipeline', sub: 'Not every client relationship is a deal to be closed.' },
              { label: 'No enterprise', sub: 'Built for one person. Maybe two.' },
            ].map(({ label, sub }) => (
              <div key={label}>
                <p className="text-ink font-normal text-sm mb-1" style={{ letterSpacing: '-0.2px' }}>{label}</p>
                <p className="text-ink-mute text-sm">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What you get */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h2
          className="text-ink mb-12"
          style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.64px', lineHeight: 1.1 }}
        >
          Everything you need.
          <br />
          Nothing you don't.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: 'Client records', body: 'Name, email, phone, company, notes. The basics. Always accessible.' },
            { title: 'Status tracking', body: 'Four states: Lead, Working, Done, Archived. Simple enough to actually use.' },
            { title: 'Timeline', body: 'Log what happened. When you last called. What you sent. No templates required.' },
            { title: 'Tags', body: 'Organize however you think. VIP. Design. Personal. You decide.' },
            { title: 'Search', body: 'Find anyone in under a second. No filters to configure.' },
            { title: 'Last contact', body: 'Always know when you last spoke to someone. No calendar required.' },
          ].map(({ title, body }) => (
            <div
              key={title}
              className="p-8 rounded-lg border border-hairline bg-canvas"
              style={{ boxShadow: 'rgba(0,55,112,0.08) 0 1px 3px' }}
            >
              <p className="text-ink font-normal text-sm mb-2" style={{ letterSpacing: '-0.2px' }}>{title}</p>
              <p className="text-ink-mute text-sm">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="bg-canvas-soft border-y border-hairline py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-ink mb-12"
            style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.64px', lineHeight: 1.1 }}
          >
            Pricing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            {/* Free */}
            <div className="p-8 rounded-lg border border-hairline bg-canvas">
              <p className="text-ink font-normal text-sm mb-1">Free</p>
              <p className="text-ink mb-6 tnum" style={{ fontSize: 36, fontWeight: 300, letterSpacing: '-0.96px' }}>$0</p>
              <ul className="space-y-2 text-sm text-ink-mute mb-8">
                {['Up to 100 clients', 'Tags and notes', 'Timeline', 'Search'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-hairline-input inline-block" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block text-center text-sm font-normal border border-primary text-primary px-4 py-2.5 rounded-pill hover:bg-primary hover:text-white transition-colors"
              >
                Start free
              </Link>
            </div>
            {/* Pro */}
            <div className="p-8 rounded-lg border border-brand-dark bg-brand-dark text-white">
              <p className="font-normal text-sm mb-1 opacity-80">Pro</p>
              <p className="mb-6 tnum" style={{ fontSize: 36, fontWeight: 300, letterSpacing: '-0.96px' }}>$4<span className="text-sm opacity-60 font-normal">/mo</span></p>
              <ul className="space-y-2 text-sm opacity-80 mb-8">
                {['Unlimited clients', 'Everything in Free', 'CSV export', 'Backup'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary-soft inline-block" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block text-center text-sm font-normal bg-primary text-white px-4 py-2.5 rounded-pill hover:bg-primary-deep transition-colors"
              >
                Get Pro
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 flex items-center justify-between">
        <span className="text-ink-mute text-sm font-light">TinyCRM</span>
        <p className="text-ink-mute text-sm">Know your people. Nothing more.</p>
      </footer>
    </div>
  )
}
