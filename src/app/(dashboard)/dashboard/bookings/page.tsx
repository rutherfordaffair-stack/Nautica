import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { BookingActions } from '@/components/booking/BookingActions'
import { Calendar, Users, Clock } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING:   { label: 'An Atant', color: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED: { label: 'Konfime',  color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Anile',    color: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Konplete', color: 'bg-blue-100 text-blue-700' },
}

const PAYMENT_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING:  { label: 'Pa peye', color: 'text-yellow-600' },
  PAID:     { label: 'Peye ✓',  color: 'text-green-600' },
  REFUNDED: { label: 'Ranbouse', color: 'text-gray-600' },
  FAILED:   { label: 'Echwe',   color: 'text-red-600' },
}

export default async function BookingsPage({ searchParams }: { searchParams: { role?: string } }) {
  const session = await getServerSession(authOptions)
  const isOwnerView = searchParams.role === 'owner'

  let bookings
  if (isOwnerView) {
    bookings = await prisma.booking.findMany({
      where: { boat: { ownerId: session!.user.id } },
      include: {
        boat: { select: { id: true, title: true, images: true } },
        renter: { select: { name: true, email: true, image: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  } else {
    bookings = await prisma.booking.findMany({
      where: { renterId: session!.user.id },
      include: {
        boat: {
          select: { id: true, title: true, images: true, owner: { select: { name: true, image: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Rezèvasyon</h1>
        <div className="flex gap-2 mt-3">
          <a
            href="/dashboard/bookings"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!isOwnerView ? 'bg-ocean-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-ocean-300'}`}
          >
            Mwen Lwe
          </a>
          <a
            href="/dashboard/bookings?role=owner"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isOwnerView ? 'bg-ocean-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-ocean-300'}`}
          >
            Bato Mwen Yo
          </a>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="font-display text-xl font-bold text-gray-700 mb-2">Pa gen rezèvasyon</h3>
          <p className="text-gray-500">Rezèvasyon ou yo pral parèt la</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => {
            const statusCfg = STATUS_CONFIG[booking.status]
            const paymentCfg = PAYMENT_CONFIG[booking.paymentStatus]
            const total = booking.totalPrice + booking.serviceFee
            const image = booking.boat.images[0]

            return (
              <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    {image && <Image src={image} alt="" width={80} height={64} className="object-cover w-full h-full" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.boat.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(new Date(booking.startDate), 'd MMM', { locale: fr })} —{' '}
                            {format(new Date(booking.endDate), 'd MMM yyyy', { locale: fr })}
                          </span>
                          {booking.hours && (
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{booking.hours}h</span>
                          )}
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{booking.guests} moun</span>
                        </div>

                        {isOwnerView && booking.renter && (
                          <div className="flex items-center gap-2 mt-2">
                            {booking.renter.image ? (
                              <Image src={booking.renter.image} alt="" width={20} height={20} className="rounded-full" />
                            ) : (
                              <div className="w-5 h-5 ocean-gradient rounded-full flex items-center justify-center text-white text-xs">{booking.renter.name?.[0]}</div>
                            )}
                            <span className="text-sm text-gray-600">{booking.renter.name} — {booking.renter.email}</span>
                          </div>
                        )}

                        {booking.message && (
                          <p className="text-sm text-gray-500 italic mt-2 bg-gray-50 rounded-lg px-3 py-2">"{booking.message}"</p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-bold text-lg text-gray-900">${total.toFixed(2)}</div>
                        <div className={`text-xs font-medium ${paymentCfg.color}`}>{paymentCfg.label}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                      <span className={`badge ${statusCfg.color}`}>{statusCfg.label}</span>
                      <BookingActions
                        bookingId={booking.id}
                        status={booking.status}
                        paymentStatus={booking.paymentStatus}
                        isOwner={isOwnerView}
                        boatId={booking.boat.id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
