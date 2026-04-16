import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Ship, Edit, Eye, ToggleLeft, ToggleRight, Star } from 'lucide-react'
import { ToggleBoatButton } from '@/components/boats/ToggleBoatButton'

export default async function MyBoatsPage() {
  const session = await getServerSession(authOptions)

  const boats = await prisma.boat.findMany({
    where: { ownerId: session!.user.id },
    include: {
      reviews: { select: { rating: true } },
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Bato Mwen Yo</h1>
          <p className="text-gray-500 mt-1">{boats.length} bato total</p>
        </div>
        <Link href="/dashboard/my-boats/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajoute Bato
        </Link>
      </div>

      {boats.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
          <Ship className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="font-display text-xl font-bold text-gray-700 mb-2">Pa gen bato ankò</h3>
          <p className="text-gray-500 mb-6">Mete premye bato ou a epi kòmanse touche lajan!</p>
          <Link href="/dashboard/my-boats/new" className="btn-primary">
            Mete Premye Bato Mwen
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {boats.map(boat => {
            const avgRating = boat.reviews.length > 0
              ? boat.reviews.reduce((s, r) => s + r.rating, 0) / boat.reviews.length
              : null

            return (
              <div key={boat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-5">
                <div className="w-24 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  {boat.images[0] ? (
                    <Image src={boat.images[0]} alt={boat.title} width={96} height={80} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Ship className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">{boat.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{boat.city}, {boat.country}</p>
                    </div>
                    <span className={`badge shrink-0 ${boat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {boat.isActive ? 'Aktif' : 'Inaktif'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-ocean-700">${boat.pricePerDay}/jou</span>
                    {boat.pricePerHour && <span>${boat.pricePerHour}/zè</span>}
                    <span>{boat._count.bookings} rezèvasyon</span>
                    {avgRating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-sand-400 text-sand-400" />
                        {avgRating.toFixed(1)} ({boat.reviews.length})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/boats/${boat.id}`} className="p-2 text-gray-500 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors" title="Wè">
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link href={`/dashboard/my-boats/${boat.id}/edit`} className="p-2 text-gray-500 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors" title="Modifye">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <ToggleBoatButton boatId={boat.id} isActive={boat.isActive} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
