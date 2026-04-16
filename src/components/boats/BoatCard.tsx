'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star, MapPin, Users, Clock } from 'lucide-react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { BoatWithOwner } from '@/types'

const BOAT_TYPE_LABELS: Record<string, string> = {
  SAILBOAT: 'Vwayè', MOTORBOAT: 'Moto Bato', YACHT: 'Yacht',
  CATAMARAN: 'Katamaran', SPEEDBOAT: 'Rapid', HOUSEBOAT: 'Kay Bato',
  KAYAK: 'Kayak', JETSKI: 'Jetski', PONTOON: 'Ponton', FISHING: 'Pèch',
}

export function BoatCard({ boat, isFavorited = false }: { boat: BoatWithOwner; isFavorited?: boolean }) {
  const { data: session } = useSession()
  const [favorited, setFavorited] = useState(isFavorited)
  const [isLoading, setIsLoading] = useState(false)

  const avgRating = boat.reviews.length > 0
    ? boat.reviews.reduce((a, r) => a + r.rating, 0) / boat.reviews.length
    : null

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!session) { toast.error('Konekte pou w ka mete nan favoris'); return }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/boats/${boat.id}/favorite`, { method: 'POST' })
      if (res.ok) {
        setFavorited(!favorited)
        toast.success(favorited ? 'Retire nan favoris' : 'Ajoute nan favoris ❤️')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const mainImage = boat.images[0] || 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=600&q=80'

  return (
    <Link href={`/boats/${boat.id}`} className="card group block">
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={mainImage}
          alt={boat.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay badges */}
        <div className="absolute top-3 left-3">
          <span className="badge bg-white/90 text-ocean-700 shadow-sm text-xs">
            {BOAT_TYPE_LABELS[boat.type] || boat.type}
          </span>
        </div>

        {boat.isVerified && (
          <div className="absolute top-3 left-[calc(100%_-_80px)]">
            <span className="badge bg-ocean-600 text-white text-xs">✓ Verifye</span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          disabled={isLoading}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95"
        >
          <Heart className={`w-4 h-4 transition-colors ${favorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>

      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-1.5">
          <MapPin className="w-3 h-3" />
          <span>{boat.city}, {boat.country}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-ocean-700 transition-colors">
          {boat.title}
        </h3>

        {/* Details */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {boat.capacity} moun</span>
          {boat.pricePerHour && (
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Lwe pa zè</span>
          )}
        </div>

        {/* Price + Rating */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-ocean-700 text-base">${boat.pricePerDay}</span>
            <span className="text-gray-400 text-xs"> / jou</span>
            {boat.pricePerHour && (
              <div className="text-xs text-gray-500">${boat.pricePerHour}/zè</div>
            )}
          </div>
          {avgRating && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-sand-400 text-sand-400" />
              <span className="text-sm font-semibold text-gray-700">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({boat.reviews.length})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
