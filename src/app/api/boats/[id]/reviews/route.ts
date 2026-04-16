import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reviewSchema = z.object({
  boatId: z.string(),
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Kòmantè twò kout'),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non otorize' }, { status: 401 })

  try {
    const body = await req.json()
    const data = reviewSchema.parse(body)

    // Verify booking belongs to user and is completed
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId, renterId: session.user.id },
    })
    if (!booking) return NextResponse.json({ error: 'Rezèvasyon pa jwenn' }, { status: 404 })
    if (booking.status !== 'COMPLETED') return NextResponse.json({ error: 'Rezèvasyon pa konplete ankò' }, { status: 400 })

    const existing = await prisma.review.findUnique({ where: { bookingId: data.bookingId } })
    if (existing) return NextResponse.json({ error: 'Ou déjà kite yon avis pou rezèvasyon sa' }, { status: 400 })

    const review = await prisma.review.create({
      data: { ...data, authorId: session.user.id },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erè sèvè' }, { status: 500 })
  }
}
