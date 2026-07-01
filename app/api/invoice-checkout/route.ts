import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { invoiceId } = await request.json()

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID required.' }, { status: 400 })
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        user: { select: { name: true, company: true, email: true } },
        client: { select: { name: true } },
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 })
    }

    if (invoice.status !== 'pending') {
      return NextResponse.json({ error: `Invoice is ${invoice.status}.` }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const from = invoice.user.company ?? invoice.user.name ?? invoice.user.email ?? 'TinyCRM'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: invoice.currency,
            unit_amount: invoice.amountCents,
            product_data: {
              name: invoice.description,
              description: `Invoice from ${from} for ${invoice.client.name}`,
            },
          },
        },
      ],
      success_url: `${appUrl}/pay/${invoiceId}/success`,
      cancel_url: `${appUrl}/pay/${invoiceId}`,
      metadata: { invoice_id: invoiceId },
    })

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create checkout session.' }, { status: 500 })
  }
}
