'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, CreditCard, Star, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Props {
  bookingId: string
  status: string
  paymentStatus: string
  isOwner: boolean
  boatId: string
}

export function BookingActions({ bookingId, status, paymentStatus, isOwner, boatId }: Props) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const updateStatus = async (newStatus: string) => {
    setLoading(newStatus)
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Erè')
      toast.success(newStatus === 'CONFIRMED' ? 'Rezèvasyon konfime! ✅' : 'Rezèvasyon anile')
      router.refresh()
    } catch {
      toast.error('Erè rive')
    } finally {
      setLoading(null)
    }
  }

  if (status === 'CANCELLED' || status === 'COMPLETED') return null

  return (
    <div className="flex flex-wrap gap-2">
      {/* Owner actions */}
      {isOwner && status === 'PENDING' && (
        <>
          <button
            onClick={() => updateStatus('CONFIRMED')}
            disabled={!!loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            {loading === 'CONFIRMED' ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
            Konfime
          </button>
          <button
            onClick={() => updateStatus('CANCELLED')}
            disabled={!!loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-semibold transition-colors"
          >
            {loading === 'CANCELLED' ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
            Refize
          </button>
        </>
      )}

      {isOwner && status === 'CONFIRMED' && (
        <button
          onClick={() => updateStatus('COMPLETED')}
          disabled={!!loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          {loading === 'COMPLETED' ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
          Mete Konplete
        </button>
      )}

      {/* Renter actions */}
      {!isOwner && status === 'PENDING' && paymentStatus !== 'PAID' && (
        <Link
          href={`/bookings/${bookingId}/checkout`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-ocean-700 hover:bg-ocean-800 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          <CreditCard className="w-3 h-3" /> Peye Kounye
        </Link>
      )}

      {!isOwner && (status === 'PENDING' || status === 'CONFIRMED') && (
        <button
          onClick={() => updateStatus('CANCELLED')}
          disabled={!!loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-semibold transition-colors"
        >
          {loading === 'CANCELLED' ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
          Anile
        </button>
      )}

      {!isOwner && status === 'COMPLETED' && (
        <Link
          href={`/boats/${boatId}#reviews`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-sand-100 hover:bg-sand-200 text-sand-700 rounded-lg text-xs font-semibold transition-colors"
        >
          <Star className="w-3 h-3" /> Kite Avis
        </Link>
      )}
    </div>
  )
}
