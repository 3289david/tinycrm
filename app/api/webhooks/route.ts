import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const invoiceId = session.metadata?.invoice_id

    if (invoiceId && session.payment_status === 'paid') {
      await prisma.invoice.updateMany({
        where: { id: invoiceId, status: 'pending' },
        data: {
          status: 'paid',
          paidAt: new Date(),
          stripePaymentIntentId: session.payment_intent as string ?? null,
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}
