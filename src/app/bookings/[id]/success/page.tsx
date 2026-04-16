import Link from 'next/link'
import { CheckCircle, Anchor, Calendar, ArrowRight } from 'lucide-react'

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-3">Rezèvasyon Konfime! 🎉</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Peman ou fèt ak siksè. Pwopriyetè a pral kontakte ou byento ak detay yo.
        </p>

        <div className="bg-ocean-50 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-2 text-ocean-700 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            <span>Verifye email ou pou konfirmasyon an</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/dashboard/bookings" className="btn-primary flex items-center justify-center gap-2">
            Wè Rezèvasyon Mwen <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/boats/search" className="btn-ghost">
            Eksplore Lòt Bato
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Anchor className="w-4 h-4" />
          <span>Nautica — Bon Vwayaj!</span>
        </div>
      </div>
    </div>
  )
}
