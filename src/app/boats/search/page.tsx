import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BoatCard } from '@/components/boats/BoatCard'
import { SearchFilters } from '@/components/boats/SearchFilters'
import { prisma } from '@/lib/prisma'
import { Anchor } from 'lucide-react'

interface SearchPageProps {
  searchParams: {
    location?: string
    country?: string
    region?: string
    boatType?: string
    minPrice?: string
    maxPrice?: string
    capacity?: string
    startDate?: string
    endDate?: string
    rentalType?: string
    hours?: string
  }
}

async function searchBoats(params: SearchPageProps['searchParams']) {
  const where: any = { isActive: true }

  if (params.location) {
    where.OR = [
      { country: { contains: params.location, mode: 'insensitive' } },
      { region: { contains: params.location, mode: 'insensitive' } },
      { city: { contains: params.location, mode: 'insensitive' } },
      { marina: { contains: params.location, mode: 'insensitive' } },
    ]
  }
  if (params.country) where.country = { contains: params.country, mode: 'insensitive' }
  if (params.region) where.region = { contains: params.region, mode: 'insensitive' }
  if (params.boatType) where.type = params.boatType
  if (params.minPrice) where.pricePerDay = { ...where.pricePerDay, gte: parseFloat(params.minPrice) }
  if (params.maxPrice) where.pricePerDay = { ...where.pricePerDay, lte: parseFloat(params.maxPrice) }
  if (params.capacity) where.capacity = { gte: parseInt(params.capacity) }
  if (params.rentalType === 'HOURLY') where.pricePerHour = { not: null }

  return prisma.boat.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true, image: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const boats = await searchBoats(searchParams)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <SearchFilters initialParams={searchParams} />
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl font-bold text-gray-900">
                {boats.length} bato jwenn
                {searchParams.location && <span className="text-ocean-600"> nan "{searchParams.location}"</span>}
              </h1>
            </div>

            {boats.length === 0 ? (
              <div className="text-center py-20">
                <Anchor className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Pa gen bato ki koresponn</h3>
                <p className="text-gray-500">Eseye chanje filtè yo oubyen cherche nan yon lòt zon</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {boats.map((boat) => (
                  <BoatCard key={boat.id} boat={boat as any} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
