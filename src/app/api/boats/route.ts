import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const boatSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  type: z.enum(['SAILBOAT','MOTORBOAT','YACHT','CATAMARAN','SPEEDBOAT','HOUSEBOAT','KAYAK','JETSKI','PONTOON','FISHING']),
  capacity: z.number().int().min(1),
  length: z.number().positive(),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  pricePerDay: z.number().positive(),
  pricePerHour: z.number().positive().optional(),
  minDays: z.number().int().min(1).optional(),
  minHours: z.number().int().min(1).optional(),
  images: z.array(z.string()).min(1, 'Omwen yon foto obligatwa'),
  amenities: z.array(z.string()).default([]),
  rules: z.string().optional(),
  cancellationPolicy: z.enum(['FLEXIBLE','MODERATE','STRICT']).default('FLEXIBLE'),
  country: z.string().min(2),
  region: z.string().min(2),
  city: z.string().min(2),
  marina: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const where: any = { isActive: true }
  
  const country = searchParams.get('country')
  const region = searchParams.get('region')
  const type = searchParams.get('type')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const capacity = searchParams.get('capacity')

  if (country) where.country = { contains: country, mode: 'insensitive' }
  if (region) where.region = { contains: region, mode: 'insensitive' }
  if (type) where.type = type
  if (minPrice || maxPrice) {
    where.pricePerDay = {}
    if (minPrice) where.pricePerDay.gte = parseFloat(minPrice)
    if (maxPrice) where.pricePerDay.lte = parseFloat(maxPrice)
  }
  if (capacity) where.capacity = { gte: parseInt(capacity) }

  const boats = await prisma.boat.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true, image: true } },
      reviews: { select: { rating: true } },
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(boats)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non otorize' }, { status: 401 })

  try {
    const body = await req.json()
    const data = boatSchema.parse(body)

    const boat = await prisma.boat.create({
      data: { ...data, ownerId: session.user.id },
    })

    return NextResponse.json(boat, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Erè sèvè' }, { status: 500 })
  }
}
