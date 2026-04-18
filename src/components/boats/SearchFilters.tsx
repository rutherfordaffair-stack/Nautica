'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

const BOAT_TYPES = [
  { value: '', label: 'Tout Kalite' },
  { value: 'SAILBOAT', label: '⛵ Vwayè' },
  { value: 'MOTORBOAT', label: '🚤 Moto Bato' },
  { value: 'YACHT', label: '🛥️ Yacht' },
  { value: 'CATAMARAN', label: '⛵ Katamaran' },
  { value: 'SPEEDBOAT', label: '💨 Rapid' },
  { value: 'HOUSEBOAT', label: '🏠 Kay Bato' },
  { value: 'KAYAK', label: '🛶 Kayak' },
  { value: 'JETSKI', label: '🏄 Jetski' },
  { value: 'FISHING', label: '🎣 Pèch' },
]

const COUNTRIES = [
  // Karayib
  'Haiti', 'Jamaïque', 'Cuba', 'République Dominicaine', 'Porto Rico', 'Martinique', 'Guadeloupe', 'Bahamas', 'Barbade', 'Trinidad et Tobago', 'Sainte-Lucie', 'Antigua', 'Aruba', 'Curaçao',
  // Amerik
  'USA', 'Mexique', 'Brésil', 'Colombie', 'Venezuela', 'Argentine', 'Chili', 'Panama', 'Costa Rica', 'Belize', 'Canada',
  // Ewòp
  'France', 'Espagne', 'Italie', 'Grèce', 'Croatie', 'Portugal', 'Turquie', 'Monaco', 'Malte', 'Chypre', 'Monténégro', 'Albanie',
  // Afrik
  'Maroc', 'Tunisie', 'Égypte', 'Sénégal', 'Côte d\'Ivoire', 'Mozambique', 'Afrique du Sud',
  // Azi
  'Thaïlande', 'Maldives', 'Indonésie', 'Philippines', 'Vietnam', 'Malaisie', 'Sri Lanka', 'Inde', 'Japon',
  // Oseyani
  'Australie', 'Nouvelle-Zélande', 'Fidji', 'Tahiti',
  // Mwayen Oryan
  'Émirats Arabes Unis', 'Oman', 'Qatar',
]

interface Props {
  initialParams: Record<string, string | undefined>
}

export function SearchFilters({ initialParams }: Props) {
  const router = useRouter()
  const [country, setCountry] = useState(initialParams.country || '')
  const [region, setRegion] = useState(initialParams.region || '')
  const [boatType, setBoatType] = useState(initialParams.boatType || '')
  const [minPrice, setMinPrice] = useState(initialParams.minPrice || '')
  const [maxPrice, setMaxPrice] = useState(initialParams.maxPrice || '')
  const [capacity, setCapacity] = useState(initialParams.capacity || '')
  const [rentalType, setRentalType] = useState(initialParams.rentalType || '')

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (country) params.set('country', country)
    if (region) params.set('region', region)
    if (boatType) params.set('boatType', boatType)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (capacity) params.set('capacity', capacity)
    if (rentalType) params.set('rentalType', rentalType)
    router.push(`/boats/search?${params.toString()}`)
  }

  const resetFilters = () => {
    setCountry(''); setRegion(''); setBoatType('')
    setMinPrice(''); setMaxPrice(''); setCapacity(''); setRentalType('')
    router.push('/boats/search')
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-ocean-600" />
          <h3 className="font-semibold text-gray-900">Filtè</h3>
        </div>
        <button onClick={resetFilters} className="text-xs text-ocean-600 hover:text-ocean-800 flex items-center gap-1">
          <X className="w-3 h-3" /> Efase
        </button>
      </div>

      <div className="space-y-6">
        {/* Country */}
        <div>
          <label className="label">Peyi</label>
          <select value={country} onChange={e => setCountry(e.target.value)} className="input-field text-sm">
            <option value="">Tout Peyi</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="label">Rejyon / Vil</label>
          <input
            type="text"
            placeholder="Ex: Côte d'Azur, Miami..."
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="input-field text-sm"
          />
        </div>

        {/* Boat type */}
        <div>
          <label className="label">Kalite Bato</label>
          <div className="grid grid-cols-2 gap-1.5">
            {BOAT_TYPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setBoatType(value)}
                className={`text-xs py-2 px-2 rounded-lg border transition-all text-left truncate ${boatType === value ? 'bg-ocean-700 text-white border-ocean-700' : 'border-gray-200 text-gray-600 hover:border-ocean-300 hover:text-ocean-600'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Rental type */}
        <div>
          <label className="label">Tip Lokasyon</label>
          <div className="flex gap-2">
            {[{ value: '', label: 'Tout' }, { value: 'DAILY', label: 'Pa Jou' }, { value: 'HOURLY', label: 'Pa Zè' }].map(opt => (
              <button
                key={opt.value}
                onClick={() => setRentalType(opt.value)}
                className={`flex-1 text-xs py-2 rounded-lg border transition-all ${rentalType === opt.value ? 'bg-ocean-700 text-white border-ocean-700' : 'border-gray-200 text-gray-600 hover:border-ocean-300'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="label">Pri pa Jou ($)</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="input-field text-sm w-1/2"
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="input-field text-sm w-1/2"
            />
          </div>
        </div>

        {/* Capacity */}
        <div>
          <label className="label">Moun Minimum</label>
          <select value={capacity} onChange={e => setCapacity(e.target.value)} className="input-field text-sm">
            <option value="">Tout</option>
            {[2, 4, 6, 8, 10, 15, 20].map(n => <option key={n} value={n}>{n}+ moun</option>)}
          </select>
        </div>

        <button onClick={applyFilters} className="btn-primary w-full">
          Aplike Filtè
        </button>
      </div>
    </div>
  )
}
