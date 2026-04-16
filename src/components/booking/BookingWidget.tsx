'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { differenceInDays, addDays, format, isWithinInterval, parseISO } from 'date-fns'
import { Star, Shield, Clock, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { calculateFees } from '@/lib/stripe'

interface Props {
  boat: {
    id: string
    pricePerDay: number
    pricePerHour?: number | null
    minDays?: number | null
    minHours?: number | null
    capacity: number
    title: string
  }
  bookedDates: { start: Date; end: Date }[]
  userId?: string
}

export function BookingWidget({ boat, bookedDates, userId }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [rentalType, setRentalType] = useState<'DAILY' | 'HOURLY'>('DAILY')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [hours, setHours] = useState(4)
  const [guests, setGuests] = useState(1)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const isDateBooked = (dateStr: string) => {
    const date = parseISO(dateStr)
    return bookedDates.some(({ start, end }) =>
      isWithinInterval(date, { start: new Date(start), end: new Date(end) })
    )
  }

  const numDays = useMemo(() => {
    if (!startDate || !endDate || rentalType !== 'DAILY') return 0
    return Math.max(0, differenceInDays(parseISO(endDate), parseISO(startDate)))
  }, [startDate, endDate, rentalType])

  const basePrice = useMemo(() => {
    if (rentalType === 'DAILY') return boat.pricePerDay * numDays
    return (boat.pricePerHour || 0) * hours
  }, [rentalType, numDays, hours, boat.pricePerDay, boat.pricePerHour])

  const { serviceFee, total } = useMemo(() => calculateFees(basePrice), [basePrice])

  const canBook = rentalType === 'DAILY'
    ? startDate && endDate && numDays > 0
    : startDate && hours > 0

  const handleBook = async () => {
    if (!session) {
      toast.error('Konekte pou w ka rezève')
      router.push('/login')
      return
    }
    if (!canBook) {
      toast.error('Chwazi dat ou yo')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boatId: boat.id,
          startDate,
          endDate: rentalType === 'DAILY' ? endDate : startDate,
          hours: rentalType === 'HOURLY' ? hours : undefined,
          rentalType,
          guests,
          message,
          totalPrice: basePrice,
          serviceFee,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erè')
      // Redirect to checkout
      router.push(`/bookings/${data.bookingId}/checkout`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Price header */}
      <div className="ocean-gradient p-6 text-white">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display text-3xl font-bold">${boat.pricePerDay}</span>
          <span className="text-ocean-200">/ jou</span>
        </div>
        {boat.pricePerHour && (
          <div className="text-ocean-200 text-sm">${boat.pricePerHour} / zè disponib tou</div>
        )}
        <div className="flex items-center gap-1.5 mt-2">
          <Shield className="w-4 h-4 text-sand-300" />
          <span className="text-sm text-ocean-100">Peman pwoteje pa Stripe</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Rental type */}
        {boat.pricePerHour && (
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setRentalType('DAILY')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${rentalType === 'DAILY' ? 'bg-ocean-700 text-white shadow-md' : 'text-gray-600'}`}
            >
              <Calendar className="w-4 h-4" /> Pa Jou
            </button>
            <button
              onClick={() => setRentalType('HOURLY')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${rentalType === 'HOURLY' ? 'bg-ocean-700 text-white shadow-md' : 'text-gray-600'}`}
            >
              <Clock className="w-4 h-4" /> Pa Zè
            </button>
          </div>
        )}

        {/* Dates */}
        <div>
          <label className="label">Dat Kòmansman</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            min={today}
            className="input-field"
          />
        </div>

        {rentalType === 'DAILY' ? (
          <div>
            <label className="label">Dat Retounen</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              min={startDate || today}
              className="input-field"
            />
          </div>
        ) : (
          <div>
            <label className="label">Kantite Zè</label>
            <select value={hours} onChange={e => setHours(Number(e.target.value))} className="input-field">
              {[1,2,3,4,5,6,8,10,12].map(h => (
                <option key={h} value={h}>{h} {h === 1 ? 'zè' : 'zè'}</option>
              ))}
            </select>
          </div>
        )}

        {/* Guests */}
        <div>
          <label className="label">Nombre Pasaje</label>
          <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="input-field">
            {Array.from({ length: boat.capacity }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'moun' : 'moun'}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="label">Mesaj pou Pwopriyetè (opsyonèl)</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            placeholder="Eksplike rezon ou lwe a, eksperyans ou..."
            className="input-field resize-none"
          />
        </div>

        {/* Price breakdown */}
        {basePrice > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                ${rentalType === 'DAILY' ? boat.pricePerDay : boat.pricePerHour} ×{' '}
                {rentalType === 'DAILY' ? `${numDays} jou` : `${hours} zè`}
              </span>
              <span>${basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Frè sèvis (12%)</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleBook}
          disabled={!canBook || loading}
          className="btn-primary w-full py-4 text-base"
        >
          {loading ? 'Ap trete...' : 'Rezève Kounye a'}
        </button>

        <p className="text-center text-xs text-gray-400">
          Ou pap debite jiskaske pwopriyetè a konfime
        </p>
      </div>
    </div>
  )
}
