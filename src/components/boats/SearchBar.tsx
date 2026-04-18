'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar, Clock, Users } from 'lucide-react'

const COUNTRIES = ['Haiti', 'Jamaïque', 'Cuba', 'République Dominicaine', 'Martinique', 'Guadeloupe', 'Bahamas', 'USA', 'Mexique', 'Brésil', 'France', 'Espagne', 'Italie', 'Grèce', 'Croatie', 'Portugal', 'Turquie', 'Maroc', 'Thaïlande', 'Maldives', 'Indonésie', 'Australie', 'Émirats Arabes Unis']

export function SearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [rentalType, setRentalType] = useState<'DAILY' | 'HOURLY'>('DAILY')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [hours, setHours] = useState('4')
  const [guests, setGuests] = useState('2')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    params.set('rentalType', rentalType)
    if (startDate) params.set('startDate', startDate)
    if (rentalType === 'DAILY' && endDate) params.set('endDate', endDate)
    if (rentalType === 'HOURLY') params.set('hours', hours)
    if (guests) params.set('guests', guests)
    router.push(`/boats/search?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-2 text-gray-800">
      {/* Rental type tabs */}
      <div className="flex gap-1 mb-3 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setRentalType('DAILY')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${rentalType === 'DAILY' ? 'bg-ocean-700 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <Calendar className="w-4 h-4" /> Pa Jou
        </button>
        <button
          onClick={() => setRentalType('HOURLY')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${rentalType === 'HOURLY' ? 'bg-ocean-700 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <Clock className="w-4 h-4" /> Pa Zè
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-500" />
          <input
            type="text"
            placeholder="Peyi oubyen Zon..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            list="countries"
            className="w-full pl-10 pr-4 py-3.5 border border-gray-100 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-transparent outline-none text-sm bg-gray-50 hover:bg-white transition-colors"
          />
          <datalist id="countries">
            {COUNTRIES.map(c => <option key={c} value={c} />)}
          </datalist>
        </div>

        {/* Date(s) */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-500" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full pl-10 pr-4 py-3.5 border border-gray-100 rounded-xl focus:ring-2 focus:ring-ocean-400 outline-none text-sm bg-gray-50 hover:bg-white transition-colors"
          />
        </div>

        {rentalType === 'DAILY' ? (
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-500" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3.5 border border-gray-100 rounded-xl focus:ring-2 focus:ring-ocean-400 outline-none text-sm bg-gray-50 hover:bg-white transition-colors"
            />
          </div>
        ) : (
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-500" />
            <select
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 border border-gray-100 rounded-xl focus:ring-2 focus:ring-ocean-400 outline-none text-sm bg-gray-50 hover:bg-white transition-colors appearance-none"
            >
              {[1,2,3,4,5,6,8,10,12].map(h => <option key={h} value={h}>{h} zè</option>)}
            </select>
          </div>
        )}

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="btn-primary flex items-center justify-center gap-2 rounded-xl py-3.5"
        >
          <Search className="w-4 h-4" />
          Chèche
        </button>
      </div>
    </div>
  )
}
