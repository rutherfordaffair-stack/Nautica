import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non otorize' }, { status: 401 })

  const { bookingId } = await req.json()

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId, renterId: session.user.id },
    include: { boat: { select: { title: true } } },
  })

  if (!booking) return NextResponse.json({ error: 'Rezèvasyon pa jwenn' }, { status: 404 })
  if (booking.paymentStatus === 'PAID') return NextResponse.json({ error: 'Déjà peye' }, { status: 400 })

  const totalCents = Math.round((booking.totalPrice + booking.serviceFee) * 100)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCents,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    metadata: {
      bookingId: booking.id,
      boatTitle: booking.boat.title,
      userId: session.user.id,
    },
    description: `Nautica - Lokasyon: ${booking.boat.title}`,
  })

  await prisma.booking.update({
    where: { id: bookingId },
    data: { paymentIntentId: paymentIntent.id },
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
