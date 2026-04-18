'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

const FAQS = [
  { q: 'Kijan mwen ka lwe yon bato?', a: 'Chèche bato nan peyi oubyen vil ou vle, chwazi dat yo, epi voye yon demann. Pwopriyetè a pral konfime epi ou ka peye.' },
  { q: 'Eske mwen bezwen yon lisans pou kondui bato?', a: 'Sa depann sou peyi ak kalite bato. Pwopriyetè a ap endike si yon lisans nesesè nan lis bato a. Toujou verifye règ lokal yo.' },
  { q: 'Kisa ki pase si pwopriyetè a anile?', a: 'Si pwopriyetè a anile, ou resevwa yon ranbousman konplè (100%) enkli frè sèvis la.' },
  { q: 'Kijan peman an mache?', a: 'Ou peye ak kat kredi oubyen debi via Stripe. Lajan an pa ale bò pwopriyetè a jiskaske rezèvasyon an konfime.' },
  { q: 'Eske gen asirans?', a: 'Nou rekòmande ou verifye asirans pèsonèl ou. Nou ap ajoute opsyon asirans siplemantè byento.' },
  { q: 'Kijan mwen ka mete pwòp bato mwen sou Nautica?', a: 'Kreye yon kont, ale nan Dashboard, klike "Mete Bato", ranpli fòm lan ak foto ak pri. Gratis pou mete!' },
  { q: 'Ki pousan Nautica pran?', a: 'Nautica pran 12% kòm frè sèvis sou chak tranzaksyon. Pwopriyetè a resevwa 88% pri lokasyon an.' },
  { q: 'Eske mwen ka anile yon rezèvasyon?', a: 'Wi, men politik ranbousman an depann sou tip anilasyon pwopriyetè a chwazi (Fleksib, Modere, oubyen Strict). Gade paj Règleman Anilasyon nou.' },
  { q: 'Ki peyi Nautica disponib?', a: 'Nautica disponib nan plis pase 40 peyi nan Karayib, Ewòp, Amerik, Azi, ak Afrik.' },
  { q: 'Kijan mwen ka kontakte sipò?', a: 'Ale nan paj "Kontakte Nou" oubyen voye yon email nan support@nautica.com. Nou reponn nan 24 zè.' },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="ocean-gradient text-white py-16 text-center">
        <h1 className="font-display text-4xl font-bold mb-3">Kesyon Souvan (FAQ)</h1>
        <p className="text-ocean-200 text-lg">Jwenn repons a kesyon ou yo</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800 pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-ocean-500 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-ocean-50 rounded-2xl p-8 border border-ocean-200">
          <h3 className="font-display text-xl font-bold text-ocean-800 mb-2">Pa jwenn repons ou a?</h3>
          <p className="text-ocean-600 mb-5">Kontakte nou dirèkteman — nou pral ede ou!</p>
          <Link href="/contact" className="btn-primary">Kontakte Nou</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
