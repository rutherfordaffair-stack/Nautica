import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non otorize' }, { status: 401 })

  const { status } = await req.json()
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { boat: true },
  })

  if (!booking) return NextResponse.json({ error: 'Rezèvasyon pa jwenn' }, { status: 404 })

  // Owner can confirm/cancel, renter can only cancel
  const isOwner = booking.boat.ownerId === session.user.id
  const isRenter = booking.renterId === session.user.id

  if (!isOwner && !isRenter) {
    return NextResponse.json({ error: 'Aksè refize' }, { status: 403 })
  }

  if (status === 'CONFIRMED' && !isOwner) {
    return NextResponse.json({ error: 'Se pwopriyetè sèlman ki ka konfime' }, { status: 403 })
  }

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: { status },
  })

  // TODO: Send notification email here

  return NextResponse.json(updated)
}
