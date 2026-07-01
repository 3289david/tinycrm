import { H1, H2, Body, Note, NextLink, PrevLink } from '../components'

export default function InvoicingPage() {
  return (
    <div>
      <H1>Invoicing</H1>
      <Body>
        TinyCRM lets you create invoices for your clients and collect payment via a shareable link.
        No client account required — your client just opens the link and pays by card.
      </Body>

      <H2>Creating an invoice</H2>
      <div className="divide-y divide-hairline border border-hairline rounded-lg overflow-hidden mb-8">
        {[
          ['Open a client', 'Go to Clients and open any client record.'],
          ['Scroll to Invoices', 'The Invoices section is below the client details and above the timeline.'],
          ['Click "New invoice"', 'A small form appears inline.'],
          ['Fill in the details', 'Enter the amount (in USD), a description, and optionally a due date.'],
          ['Click Create', 'The invoice is created with status Pending.'],
          ['Copy the payment link', 'Click "Copy link" next to the invoice. This is what you send to your client.'],
        ].map(([step, desc]) => (
          <div key={step} className="flex items-start gap-4 px-4 py-3.5 bg-canvas">
            <span className="text-sm font-normal text-ink shrink-0 w-36">{step}</span>
            <span className="text-sm text-ink-mute">{desc}</span>
          </div>
        ))}
      </div>

      <H2>What your client sees</H2>
      <Body>
        The payment link opens a clean payment page showing the invoice amount, description, your name or company, and a "Pay now" button.
        Clicking it opens a Stripe-hosted checkout page where the client enters their card details.
        After payment, they see a confirmation. No account or login required.
      </Body>
      <Note>
        The payment page is public — anyone with the link can view and pay the invoice. Do not share invoice links in public channels.
      </Note>

      <H2>Invoice statuses</H2>
      <div className="divide-y divide-hairline border border-hairline rounded-lg overflow-hidden mb-8">
        {[
          ['Pending', 'Invoice created and awaiting payment.'],
          ['Paid', 'Payment received. Stripe confirmed via webhook.'],
          ['Cancelled', 'You cancelled the invoice manually.'],
          ['Refunded', 'Payment was refunded via Stripe dashboard.'],
        ].map(([status, desc]) => (
          <div key={status} className="flex items-start gap-4 px-4 py-3 bg-canvas">
            <span className="text-sm font-normal text-ink shrink-0 w-24">{status}</span>
            <span className="text-sm text-ink-mute">{desc}</span>
          </div>
        ))}
      </div>

      <H2>Invoices list</H2>
      <Body>
        The <strong className="font-normal text-ink">Invoices</strong> page in the sidebar shows all your invoices across all clients,
        with outstanding and collected totals at the top.
      </Body>

      <H2>Cancelling an invoice</H2>
      <Body>
        Click <strong className="font-normal text-ink">Cancel</strong> next to a pending invoice to cancel it.
        Cancelled invoices cannot be paid. Create a new invoice if needed.
      </Body>

      <H2>Refunds</H2>
      <Body>
        Refunds are handled directly in the Stripe Dashboard. After issuing a refund there,
        manually update the invoice status if needed (currently not auto-synced).
      </Body>

      <div className="mt-10 pt-8 border-t border-hairline flex items-center justify-between">
        <PrevLink href="/docs/stripe">Stripe payments</PrevLink>
        <NextLink href="/docs/admin">Admin panel</NextLink>
      </div>
    </div>
  )
}
