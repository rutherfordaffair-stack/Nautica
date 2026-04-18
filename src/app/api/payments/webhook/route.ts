import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent
      const bookingId = intent.metadata.bookingId
      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
        })
        console.log(`✅ Peman konfime pou rezèvasyon ${bookingId}`)
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent
      const bookingId = intent.metadata.bookingId
      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { paymentStatus: 'FAILED' },
        })
      }
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const paymentIntentId = charge.payment_intent as string
      if (paymentIntentId) {
        await prisma.booking.updateMany({
          where: { paymentIntentId },
          data: { paymentStatus: 'REFUNDED', status: 'CANCELLED' },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
