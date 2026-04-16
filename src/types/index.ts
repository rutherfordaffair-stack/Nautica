import { Boat, User, Booking, Review } from '@prisma/client'

export type BoatWithOwner = Boat & {
  owner: Pick<User, 'id' | 'name' | 'image'>
  reviews: Review[]
  _count?: { reviews: number; bookings: number }
}

export type BookingWithDetails = Booking & {
  boat: Boat & { owner: Pick<User, 'id' | 'name' | 'image'> }
  renter: Pick<User, 'id' | 'name' | 'image' | 'email'>
}

export type SearchFilters = {
  country?: string
  region?: string
  city?: string
  boatType?: string
  minPrice?: number
  maxPrice?: number
  capacity?: number
  startDate?: string
  endDate?: string
  rentalType?: 'HOURLY' | 'DAILY'
  hours?: number
}

export type DashboardStats = {
  totalRevenue: number
  totalBookings: number
  totalBoats: number
  avgRating: number
  pendingBookings: number
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
  }
}
