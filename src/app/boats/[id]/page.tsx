import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BookingWidget } from '@/components/booking/BookingWidget'
import { ReviewList } from '@/components/boats/ReviewList'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MapPin, Star, Users, Anchor, Shield, CheckCircle, Calendar } from 'lucide-react'

const BOAT_TYPE_LABELS: Record<string, string> = {
  SAILBOAT: 'Vwayè', MOTORBOAT: 'Moto Bato', YACHT: 'Yacht',
  CATAMARAN: 'Katamaran', SPEEDBOAT: 'Bato Rapid', HOUSEBOAT: 'Kay Bato',
  KAYAK: 'Kayak', JETSKI: 'Jetski', PONTOON: 'Ponton', FISHING: 'Bato Pèch',
}

const CANCELLATION_LABELS: Record<string, string> = {
  FLEXIBLE: '✅ Fleksib — Ranbousman total 24h anvan',
  MODERATE: '⚡ Modere — Ranbousman 50% 5 jou anvan',
  STRICT: '🔒 Strict — Pa gen ranbousman',
}

async function getBoat(id: string) {
  return prisma.boat.findUnique({
    where: { id, isActive: true },
    include: {
      owner: { select: { id: true, name: true, image: true, createdAt: true, _count: { select: { boats: true } } } },
      reviews: {
        include: { author: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      },
      bookings: {
        where: { status: { in: ['CONFIRMED', 'PENDING'] } },
        select: { startDate: true, endDate: true },
      },
    },
  })
}

export default async function BoatDetailPage({ params }: { params: { id: string } }) {
  const [boat, session] = await Promise.all([
    getBoat(params.id),
    getServerSession(authOptions),
  ])

  if (!boat) notFound()

  const avgRating = boat.reviews.length > 0
    ? boat.reviews.reduce((a, r) => a + r.rating, 0) / boat.reviews.length
    : null

  const images = boat.images.length > 0
    ? boat.images
    : ['https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=900&q=80']

  const bookedDates = boat.bookings.map(b => ({ start: b.startDate, end: b.endDate }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2 relative">
            <Image src={images[0]} alt={boat.title} fill className="object-cover hover:brightness-95 transition-all cursor-pointer" />
          </div>
          {images.slice(1, 5).map((img, i) => (
            <div key={i} className="relative">
              <Image src={img} alt={`${boat.title} ${i + 2}`} fill className="object-cover hover:brightness-95 transition-all cursor-pointer" />
            </div>
          ))}
          {images.length < 5 && Array.from({ length: 5 - images.length }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-200 flex items-center justify-center">
              <Anchor className="w-8 h-8 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge bg-ocean-100 text-ocean-700">{BOAT_TYPE_LABELS[boat.type]}</span>
                {boat.isVerified && <span className="badge bg-green-100 text-green-700">✓ Verifye</span>}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">{boat.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-ocean-500" />{boat.city}, {boat.region}, {boat.country}</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-ocean-500" />{boat.capacity} moun</span>
                {avgRating && (
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-sand-400 text-sand-400" />
                    <strong>{avgRating.toFixed(1)}</strong>
                    <span className="text-gray-400">({boat.reviews.length} avis)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-display text-xl font-bold mb-4">Deskripsyon</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{boat.description}</p>
            </div>

            {/* Boat specs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-display text-xl font-bold mb-4">Karakteristik Bato</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Longè', value: `${boat.length} pye` },
                  { label: 'Kapasité', value: `${boat.capacity} moun` },
                  { label: 'Kalite', value: BOAT_TYPE_LABELS[boat.type] },
                  boat.make && { label: 'Mak', value: boat.make },
                  boat.model && { label: 'Modèl', value: boat.model },
                  boat.year && { label: 'Ane', value: boat.year.toString() },
                ].filter(Boolean).map((spec: any) => (
                  <div key={spec.label} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">{spec.label}</div>
                    <div className="font-semibold text-gray-800">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            {boat.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-display text-xl font-bold mb-4">Ekipman & Sèvis</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {boat.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rules & Cancellation */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-display text-xl font-bold mb-4">Règ & Anilasyon</h2>
              {boat.rules && <p className="text-gray-600 text-sm mb-4 leading-relaxed">{boat.rules}</p>}
              <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <Shield className="w-5 h-5 text-ocean-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-sm text-gray-800 mb-1">Politik Anilasyon</div>
                  <div className="text-sm text-gray-600">{CANCELLATION_LABELS[boat.cancellationPolicy]}</div>
                </div>
              </div>
            </div>

            {/* Owner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-display text-xl font-bold mb-4">Pwopriyetè</h2>
              <div className="flex items-center gap-4">
                {boat.owner.image ? (
                  <Image src={boat.owner.image} alt={boat.owner.name || ''} width={64} height={64} className="rounded-full" />
                ) : (
                  <div className="w-16 h-16 ocean-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {boat.owner.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-lg">{boat.owner.name}</div>
                  <div className="text-sm text-gray-500">{boat.owner._count.boats} bato • Manm depi {new Date(boat.owner.createdAt).getFullYear()}</div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <ReviewList reviews={boat.reviews as any} avgRating={avgRating} />
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingWidget
                boat={boat as any}
                bookedDates={bookedDates}
                userId={session?.user?.id}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
