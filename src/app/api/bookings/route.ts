import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bookingSchema = z.object({
  boatId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  hours: z.number().optional(),
  rentalType: z.enum(['DAILY', 'HOURLY']),
  guests: z.number().int().min(1),
  message: z.string().optional(),
  totalPrice: z.number().positive(),
  serviceFee: z.number().nonnegative(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Konekte anvan' }, { status: 401 })

  try {
    const body = await req.json()
    const data = bookingSchema.parse(body)

    // Check boat exists
    const boat = await prisma.boat.findUnique({ where: { id: data.boatId, isActive: true } })
    if (!boat) return NextResponse.json({ error: 'Bato pa disponib' }, { status: 404 })
    if (boat.ownerId === session.user.id) return NextResponse.json({ error: 'Ou pa ka lwe pwòp bato ou' }, { status: 400 })

    // Check availability
    const conflict = await prisma.booking.findFirst({
      where: {
        boatId: data.boatId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          { startDate: { lte: new Date(data.endDate) }, endDate: { gte: new Date(data.startDate) } },
        ],
      },
    })
    if (conflict) return NextResponse.json({ error: 'Bato pa disponib nan dat sa yo' }, { status: 409 })

    const booking = await prisma.booking.create({
      data: {
        boatId: data.boatId,
        renterId: session.user.id,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        hours: data.hours,
        rentalType: data.rentalType,
        guests: data.guests,
        totalPrice: data.totalPrice,
        serviceFee: data.serviceFee,
        message: data.message,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ bookingId: booking.id }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Erè sèvè' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non otorize' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role') // 'renter' | 'owner'

  let bookings
  if (role === 'owner') {
    bookings = await prisma.booking.findMany({
      where: { boat: { ownerId: session.user.id } },
      include: {
        boat: true,
        renter: { select: { name: true, email: true, image: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  } else {
    bookings = await prisma.booking.findMany({
      where: { renterId: session.user.id },
      include: {
        boat: { include: { owner: { select: { name: true, image: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  return NextResponse.json(bookings)
}
