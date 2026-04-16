'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Anchor, Shield, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

function CheckoutForm({ bookingId }: { bookingId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/bookings/${bookingId}/success`,
        },
      })
      if (error) toast.error(error.message || 'Peman echwe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
        <Shield className="w-4 h-4 text-green-500" />
        <span>Peman pwoteje pa Stripe — 256-bit SSL encryption</span>
      </div>
      <button type="submit" disabled={loading || !stripe} className="btn-primary w-full py-4 text-base">
        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Konfime Peman'}
      </button>
    </form>
  )
}

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [clientSecret, setClientSecret] = useState('')
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        // Get booking details
        const bookingRes = await fetch(`/api/bookings/${params.id}`)
        const bookingData = await bookingRes.json()
        setBooking(bookingData)

        // Create payment intent
        const intentRes = await fetch('/api/payments/intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: params.id }),
        })
        const { clientSecret } = await intentRes.json()
        setClientSecret(clientSecret)
      } catch {
        toast.error('Erè nan chajman')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-ocean-600" />
    </div>
  )

  const total = booking ? booking.totalPrice + booking.serviceFee : 0

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 ocean-gradient rounded-xl flex items-center justify-center">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold">Nautica</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="font-display text-2xl font-bold mb-4">Finalize Rezèvasyon Ou</h1>

          {booking && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
              <div className="font-semibold text-gray-800">{booking.boat?.title}</div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Pri Lokasyon</span>
                <span>${booking.totalPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Frè Sèvis</span>
                <span>${booking.serviceFee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#0369a1', borderRadius: '12px' } } }}>
              <CheckoutForm bookingId={params.id} />
            </Elements>
          )}
        </div>

        <div className="text-center space-y-2">
          {['Peman pwoteje', 'Anilasyon selon politik', 'Sipò 24/7'].map(item => (
            <div key={item} className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
