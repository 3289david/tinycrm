import { H1, H2, H3, Body, Code, Note, Warning, NextLink, PrevLink } from '../components'

export default function StripePage() {
  return (
    <div>
      <H1>Stripe payments</H1>
      <Body>
        Stripe is used to accept card payments from your clients when they pay an invoice.
        TinyCRM uses Stripe Checkout — your clients see a hosted payment page, you receive the money.
      </Body>

      <H2>How it works</H2>
      <div className="divide-y divide-hairline border border-hairline rounded-lg overflow-hidden mb-8">
        {[
          ['1', 'You create an invoice in TinyCRM and copy the payment link'],
          ['2', 'You send the link to your client (email, message, etc.)'],
          ['3', 'Client clicks the link, sees the invoice, and pays by card'],
          ['4', 'Stripe processes the payment and notifies TinyCRM via webhook'],
          ['5', 'Invoice status automatically updates to Paid'],
        ].map(([step, desc]) => (
          <div key={step} className="flex items-start gap-4 px-4 py-3 bg-canvas">
            <span className="text-xs text-ink-mute tnum pt-0.5 shrink-0">{step}</span>
            <span className="text-sm text-ink-mute">{desc}</span>
          </div>
        ))}
      </div>

      <H2>Get your Stripe keys</H2>
      <Body>
        Create a free Stripe account at stripe.com. Then go to{' '}
        <strong className="font-normal text-ink">Dashboard → Developers → API keys</strong>.
      </Body>
      <div className="divide-y divide-hairline border border-hairline rounded-lg overflow-hidden mb-6">
        {[
          ['STRIPE_SECRET_KEY', 'Starts with sk_live_... (keep this private)'],
          ['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'Starts with pk_live_...'],
        ].map(([key, hint]) => (
          <div key={key} className="px-4 py-3 bg-canvas">
            <p className="text-xs font-normal text-ink mb-0.5" style={{ fontFamily: 'ui-monospace, monospace' }}>{key}</p>
            <p className="text-xs text-ink-mute">{hint}</p>
          </div>
        ))}
      </div>
      <Warning>Never commit your secret key to git. Only add it to your .env file on the server.</Warning>

      <H2>Set up the webhook</H2>
      <Body>
        TinyCRM needs to know when a payment completes. Stripe calls your server automatically via a webhook.
      </Body>
      <H3>1. Add the endpoint</H3>
      <Body>Go to <strong className="font-normal text-ink">Dashboard → Developers → Webhooks → Add endpoint</strong>.</Body>
      <Code>{`Endpoint URL:
https://yourdomain.com/api/webhooks

Event to listen for:
checkout.session.completed`}</Code>

      <H3>2. Copy the signing secret</H3>
      <Body>After creating the endpoint, Stripe shows a <strong className="font-normal text-ink">Signing secret</strong> starting with <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>whsec_</code>. Add it to your .env:</Body>
      <Code>{`STRIPE_WEBHOOK_SECRET=whsec_your_secret_here`}</Code>
      <Note>Restart TinyCRM after changing environment variables: <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>pm2 restart tinycrm</code></Note>

      <H2>Test mode</H2>
      <Body>
        For testing, use your test API keys (starting with <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>sk_test_</code>) and the test card number <code className="text-xs bg-canvas-soft px-1 py-0.5 rounded" style={{ fontFamily: 'ui-monospace, monospace' }}>4242 4242 4242 4242</code> with any future date and any CVC.
      </Body>

      <div className="mt-10 pt-8 border-t border-hairline flex items-center justify-between">
        <PrevLink href="/docs/nginx">Nginx & SSL</PrevLink>
        <NextLink href="/docs/invoicing">Invoicing</NextLink>
      </div>
    </div>
  )
}
