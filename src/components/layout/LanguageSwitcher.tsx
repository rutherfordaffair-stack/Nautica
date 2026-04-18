'use client'

import { useEffect } from 'react'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return
    ;(window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'ht',
          includedLanguages: 'ht,fr,en,es,pt,ar,zh-CN,de,it,ru',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      )
    }
    const script = document.createElement('script')
    script.id = 'google-translate-script'
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="flex items-center gap-1.5">
      <Globe className="w-4 h-4 text-ocean-500 shrink-0" />
      <div id="google_translate_element" className="text-sm" />
      <style>{`
        .goog-te-gadget { font-family: inherit !important; font-size: 13px !important; }
        .goog-te-gadget-simple { border: 1.5px solid #e2e8f0 !important; border-radius: 10px !important; padding: 4px 10px !important; background: white !important; cursor: pointer !important; }
        .goog-te-gadget-simple:hover { border-color: #0369a1 !important; background: #f0f9ff !important; }
        .goog-te-gadget-simple img { display: none !important; }
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
        .skiptranslate { display: none !important; }
      `}</style>
    </div>
  )
}
