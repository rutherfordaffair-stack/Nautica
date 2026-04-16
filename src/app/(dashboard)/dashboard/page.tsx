import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DollarSign, Ship, Calendar, Star, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

async function getDashboardData(userId: string) {
  const [boats, bookingsAsRenter, bookingsAsOwner, reviews] = await Promise.all([
    prisma.boat.findMany({
      where: { ownerId: userId, isActive: true },
      include: { _count: { select: { bookings: true } } },
      take: 3,
    }),
    prisma.booking.findMany({
      where: { renterId: userId },
      include: { boat: { select: { title: true, images: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.booking.findMany({
      where: { boat: { ownerId: userId }, paymentStatus: 'PAID' },
      select: { totalPrice: true, serviceFee: true, status: true },
    }),
    prisma.review.findMany({
      where: { boat: { ownerId: userId } },
      select: { rating: true },
    }),
  ])

  const totalRevenue = bookingsAsOwner.reduce((sum, b) => sum + b.totalPrice, 0)
  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null
  const pendingBookings = bookingsAsOwner.filter(b => b.status === 'PENDING').length

  return { boats, bookingsAsRenter, totalRevenue, avgRating, pendingBookings, totalReviews: reviews.length }
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'An atant', color: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED: { label: 'Konfime', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Anile', color: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Konplete', color: 'bg-blue-100 text-blue-700' },
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const { boats, bookingsAsRenter, totalRevenue, avgRating, pendingBookings, totalReviews } =
    await getDashboardData(session!.user.id)

  const stats = [
    { label: 'Revni Total', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Bato Aktif', value: boats.length, icon: Ship, color: 'text-ocean-600', bg: 'bg-ocean-50' },
    { label: 'Rezèvasyon', value: bookingsAsRenter.length, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Nòt Mwayèn', value: avgRating ? avgRating.toFixed(1) : '—', icon: Star, color: 'text-sand-500', bg: 'bg-yellow-50' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900">
          Bonjou, {session!.user.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Jwenn yon rezime aktivite ou a jodi a</p>
      </div>

      {/* Pending alert */}
      {pendingBookings > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-orange-500" />
            <div>
              <div className="font-semibold text-orange-800">{pendingBookings} rezèvasyon an atant</div>
              <div className="text-sm text-orange-600">Rezèvasyon yo bezwen konfirmasyon ou</div>
            </div>
          </div>
          <Link href="/dashboard/bookings?role=owner" className="btn-primary text-sm py-2 bg-orange-500 hover:bg-orange-600">
            Wè Yo
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="font-display text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My boats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold">Bato Mwen Yo</h2>
            <Link href="/dashboard/my-boats" className="text-sm text-ocean-600 hover:underline flex items-center gap-1">
              Wè Tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {boats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Ship className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm mb-3">Ou pa gen bato ankò</p>
              <Link href="/dashboard/my-boats/new" className="btn-primary text-sm py-2">Ajoute Premye Bato</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {boats.map(boat => (
                <Link key={boat.id} href={`/dashboard/my-boats/${boat.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    {boat.images[0] && (
                      <Image src={boat.images[0]} alt={boat.title} width={56} height={56} className="object-cover w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800 truncate group-hover:text-ocean-700 transition-colors">{boat.title}</div>
                    <div className="text-xs text-gray-500">{boat._count.bookings} rezèvasyon • ${boat.pricePerDay}/jou</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
              <Link href="/dashboard/my-boats/new" className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-ocean-300 text-gray-500 hover:text-ocean-600 transition-all text-sm">
                + Ajoute Bato
              </Link>
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold">Dènye Rezèvasyon</h2>
            <Link href="/dashboard/bookings" className="text-sm text-ocean-600 hover:underline flex items-center gap-1">
              Wè Tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {bookingsAsRenter.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm mb-3">Ou pa gen rezèvasyon ankò</p>
              <Link href="/boats/search" className="btn-primary text-sm py-2">Eksplore Bato</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookingsAsRenter.map(booking => {
                const cfg = STATUS_CONFIG[booking.status]
                return (
                  <div key={booking.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                      {booking.boat.images[0] && (
                        <Image src={booking.boat.images[0]} alt="" width={56} height={56} className="object-cover w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-800 truncate">{booking.boat.title}</div>
                      <div className="text-xs text-gray-500">{format(new Date(booking.startDate), 'd MMM yyyy', { locale: fr })}</div>
                    </div>
                    <span className={`badge text-xs ${cfg.color}`}>{cfg.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
