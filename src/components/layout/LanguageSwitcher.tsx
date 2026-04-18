'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'ht', label: 'Kreyòl', flag: '🇭🇹' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(LANGUAGES[0])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-ocean-300 hover:bg-ocean-50 transition-all text-sm font-medium text-gray-700"
      >
        <Globe className="w-4 h-4 text-ocean-500" />
        <span>{current.flag} {current.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-slide-up">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setCurrent(lang); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${current.code === lang.code ? 'bg-ocean-50 text-ocean-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
