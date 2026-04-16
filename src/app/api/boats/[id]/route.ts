import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const boat = await prisma.boat.findUnique({
    where: { id: params.id },
    include: {
      owner: { select: { id: true, name: true, image: true, createdAt: true } },
      reviews: { include: { author: { select: { name: true, image: true } } }, orderBy: { createdAt: 'desc' } },
      bookings: { where: { status: { in: ['CONFIRMED', 'PENDING'] } }, select: { startDate: true, endDate: true } },
    },
  })
  if (!boat) return NextResponse.json({ error: 'Bato pa jwenn' }, { status: 404 })
  return NextResponse.json(boat)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non otorize' }, { status: 401 })

  const boat = await prisma.boat.findUnique({ where: { id: params.id } })
  if (!boat || boat.ownerId !== session.user.id) {
    return NextResponse.json({ error: 'Aksè refize' }, { status: 403 })
  }

  const body = await req.json()
  const updated = await prisma.boat.update({ where: { id: params.id }, data: body })
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non otorize' }, { status: 401 })

  const boat = await prisma.boat.findUnique({ where: { id: params.id } })
  if (!boat || boat.ownerId !== session.user.id) {
    return NextResponse.json({ error: 'Aksè refize' }, { status: 403 })
  }

  await prisma.boat.update({ where: { id: params.id }, data: { isActive: false } })
  return NextResponse.json({ success: true })
}
