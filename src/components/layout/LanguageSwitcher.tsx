'use client'

import { useEffect, useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'

const LANGS = [
  { code: 'ht', label: 'Kreyòl', flag: '🇭🇹' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
]

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(LANGS[0])

  useEffect(() => {
    if (document.getElementById('google-translate-script')) return
    ;(window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: 'ht', includedLanguages: 'ht,fr,en,es,pt,de,it,ar,zh-CN', autoDisplay: false },
        'google_translate_element'
      )
    }
    const script = document.createElement('script')
    script.id = 'google-translate-script'
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)
  }, [])

  const translateTo = (langCode: string) => {
    const tryTranslate = (attempts: number) => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (select) {
        select.value = langCode
        select.dispatchEvent(new Event('change'))
      } else if (attempts > 0) {
        setTimeout(() => tryTranslate(attempts - 1), 500)
      }
    }
    tryTranslate(10)
  }

  const handleSelect = (lang: typeof LANGS[0]) => {
    setCurrent(lang)
    setOpen(false)
    translateTo(lang.code)
  }

  return (
    <div className="relative">
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden" />

      {/* Custom button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-ocean-300 hover:bg-ocean-50 transition-all text-sm font-medium text-gray-700"
      >
        <Globe className="w-4 h-4 text-ocean-500" />
        <span>{current.flag} {current.label}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-slide-up">
          {LANGS.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${current.code === lang.code ? 'bg-ocean-50 text-ocean-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}

      <style>{`
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
        .skiptranslate { display: none !important; }
      `}</style>
    </div>
  )
}
