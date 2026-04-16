import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non otorize' }, { status: 401 })

  const existing = await prisma.favorite.findUnique({
    where: { userId_boatId: { userId: session.user.id, boatId: params.id } },
  })

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } })
    return NextResponse.json({ favorited: false })
  } else {
    await prisma.favorite.create({
      data: { userId: session.user.id, boatId: params.id },
    })
    return NextResponse.json({ favorited: true })
  }
}
