import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DollarSign, TrendingUp, Calendar, Ship } from 'lucide-react'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function EarningsPage() {
  const session = await getServerSession(authOptions)

  const bookings = await prisma.booking.findMany({
    where: {
      boat: { ownerId: session!.user.id },
      paymentStatus: 'PAID',
    },
    include: { boat: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate earnings (owner gets 88%, platform takes 12%)
  const PLATFORM_FEE = 0.12
  const totalGross = bookings.reduce((s, b) => s + b.totalPrice, 0)
  const totalNet = totalGross * (1 - PLATFORM_FEE)
  const thisMonth = bookings.filter(b => {
    const d = new Date(b.createdAt)
    return d >= startOfMonth(new Date()) && d <= endOfMonth(new Date())
  })
  const thisMonthNet = thisMonth.reduce((s, b) => s + b.totalPrice * (1 - PLATFORM_FEE), 0)

  const lastMonth = bookings.filter(b => {
    const d = new Date(b.createdAt)
    const lm = subMonths(new Date(), 1)
    return d >= startOfMonth(lm) && d <= endOfMonth(lm)
  })
  const lastMonthNet = lastMonth.reduce((s, b) => s + b.totalPrice * (1 - PLATFORM_FEE), 0)

  const stats = [
    { label: 'Revni Total (Net)', value: `$${totalNet.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Mwa Sa a', value: `$${thisMonthNet.toFixed(2)}`, icon: TrendingUp, color: 'text-ocean-600', bg: 'bg-ocean-50' },
    { label: 'Mwa Pase', value: `$${lastMonthNet.toFixed(2)}`, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Rezèvasyon', value: bookings.length, icon: Ship, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Revni Mwen</h1>
        <p className="text-gray-500 mt-1">Vou resevwa 88% de chak lokasyon. Platfòm pran 12% kòm frè sèvis.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="font-display text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-display text-lg font-bold">Istorik Tranzaksyon</h2>
        </div>
        {bookings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Pa gen tranzaksyon ankò</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {bookings.map(booking => {
              const gross = booking.totalPrice
              const net = gross * (1 - PLATFORM_FEE)
              const fee = gross * PLATFORM_FEE
              return (
                <div key={booking.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-800 truncate">{booking.boat.title}</div>
                    <div className="text-xs text-gray-500">{format(new Date(booking.createdAt), 'd MMMM yyyy', { locale: fr })}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-green-600">+${net.toFixed(2)}</div>
                    <div className="text-xs text-gray-400">Frè: ${fee.toFixed(2)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
