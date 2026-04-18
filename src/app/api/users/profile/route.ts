import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non otorize' }, { status: 401 })

  const { name, phone, bio } = await req.json()

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone, bio },
  })

  return NextResponse.json({ success: true, user: updated })
}
