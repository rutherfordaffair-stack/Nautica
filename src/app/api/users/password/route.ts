import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non otorize' }, { status: 401 })

  const { oldPassword, newPassword } = await req.json()

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.password) return NextResponse.json({ error: 'Ou konekte ak Google — ou pa ka chanje modpas' }, { status: 400 })

  const isValid = await bcrypt.compare(oldPassword, user.password)
  if (!isValid) return NextResponse.json({ error: 'Vye modpas la pa kòrèkt' }, { status: 400 })

  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { id: session.user.id }, data: { password: hashed } })

  return NextResponse.json({ success: true })
}
