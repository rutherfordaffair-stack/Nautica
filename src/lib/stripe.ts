import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const SERVICE_FEE_PERCENT = 0.12 // 12% frè sèvis

export function calculateFees(basePrice: number) {
  const serviceFee = basePrice * SERVICE_FEE_PERCENT
  const total = basePrice + serviceFee
  return { basePrice, serviceFee, total }
}
