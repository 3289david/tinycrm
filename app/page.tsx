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
            <p className="text-primary font-normal mb-4 uppercase" style={{ fontSize: 11, letterSpacing: '0.1px' }}>
              Client management
            </p>
            <h1
              className="text-ink mb-6"
              style={{ fontSize: 52, fontWeight: 300, lineHeight: 1.04, letterSpacing: '-1.4px' }}
            >
              Know your clients.
              <br />
              Invoice them directly.
            </h1>
            <p className="text-ink-mute mb-10" style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.5, maxWidth: 480 }}>
              Manage your clients and send them a payment link in seconds.
              No accounting software. No invoicing platform. Just TinyCRM.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="bg-primary text-white font-normal text-sm px-5 py-2.5 rounded-pill hover:bg-primary-deep transition-colors"
              >
                Get started
              </Link>
              <Link
                href="#features"
                className="text-sm text-ink-mute hover:text-ink transition-colors"
              >
                See features
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* What it is not */}
      <div className="bg-canvas-soft border-y border-hairline py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { label: 'No AI', sub: 'You know your clients better than an algorithm does.' },
              { label: 'No pipeline stages', sub: 'Not every client relationship is a deal to be closed.' },
              { label: 'No enterprise clutter', sub: 'Built for individuals and small teams.' },
            ].map(({ label, sub }) => (
              <div key={label}>
                <p className="text-ink font-normal text-sm mb-1" style={{ letterSpacing: '-0.2px' }}>{label}</p>
                <p className="text-ink-mute text-sm">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-5xl mx-auto px-6 py-20">
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
            { title: 'Client records', body: 'Name, email, phone, company, notes. Always one click away.' },
            { title: 'Invoicing', body: 'Create an invoice, share the link. Your client pays with a card. Done.' },
            { title: 'Status tracking', body: 'Lead, Working, Done, Archived. Simple enough to actually use every day.' },
            { title: 'Timeline', body: 'Log calls, meetings, proposals. Know exactly where things stand.' },
            { title: 'Tags', body: 'VIP, Design, Retainer — organize however you think.' },
            { title: 'Search', body: 'Find any client in under a second.' },
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

      {/* How invoicing works */}
      <div className="bg-canvas-soft border-y border-hairline py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-ink mb-12"
            style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.64px', lineHeight: 1.1 }}
          >
            How invoicing works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create an invoice', body: 'Open a client, set the amount and description. Takes ten seconds.' },
              { step: '02', title: 'Share the link', body: 'Copy the payment link and send it by email or message. No setup required.' },
              { step: '03', title: 'Client pays by card', body: 'Your client opens the link and pays with a credit or debit card via Stripe. You get notified instantly.' },
            ].map(({ step, title, body }) => (
              <div key={step}>
                <p className="text-ink-mute tnum mb-3" style={{ fontSize: 11 }}>{step}</p>
                <p className="text-ink font-normal text-sm mb-1" style={{ letterSpacing: '-0.2px' }}>{title}</p>
                <p className="text-ink-mute text-sm">{body}</p>
              </div>
            ))}
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
