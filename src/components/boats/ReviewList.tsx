import Image from 'next/image'
import { Star } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: Date
  author: { name: string | null; image: string | null }
}

export function ReviewList({ reviews, avgRating }: { reviews: Review[]; avgRating: number | null }) {
  if (reviews.length === 0) return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center text-gray-500">
      <Star className="w-10 h-10 mx-auto mb-2 opacity-30" />
      <p>Pa gen avis ankò. Rezève premye epi kite avis ou!</p>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-display text-xl font-bold">Avis</h2>
        {avgRating && (
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-sand-400 text-sand-400" />
            <span className="font-bold text-lg">{avgRating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">({reviews.length} avis)</span>
          </div>
        )}
      </div>

      {/* Rating distribution */}
      {avgRating && (
        <div className="mb-6 space-y-1.5">
          {[5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => Math.round(r.rating) === star).length
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-gray-600">{star}</span>
                <Star className="w-3 h-3 fill-sand-400 text-sand-400" />
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-sand-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-6 text-gray-500 text-xs">{count}</span>
              </div>
            )
          })}
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-t border-gray-100 pt-6 first:border-0 first:pt-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {review.author.image ? (
                  <Image src={review.author.image} alt="" width={40} height={40} className="rounded-full" />
                ) : (
                  <div className="w-10 h-10 ocean-gradient rounded-full flex items-center justify-center text-white font-bold">
                    {review.author.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm">{review.author.name || 'Anonim'}</div>
                  <div className="text-xs text-gray-400">{format(new Date(review.createdAt), 'MMMM yyyy', { locale: fr })}</div>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-sand-400 text-sand-400' : 'text-gray-200'}`} />
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
