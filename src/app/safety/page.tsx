import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Shield, AlertTriangle, Phone, CheckCircle, Anchor } from 'lucide-react'

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="ocean-gradient text-white py-16 text-center">
        <h1 className="font-display text-4xl font-bold mb-3">Sekirite sou Nautica</h1>
        <p className="text-ocean-200 text-lg">Sekirite ou se premye priyorite nou</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
        {/* Safety tips for renters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-7 h-7 text-ocean-600" />
            <h2 className="font-display text-2xl font-bold">Konsèy pou Lwa Bato</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Toujou mete gilet de sauvetage anvan ou monte bato',
              'Verifye kondisyon meteyolojik anvan vwayaj',
              'Avèti yon moun kote ou prale ak kilè ou ap retounen',
              'Pa janm bwè alkòl pandan w ap kondui bato',
              'Konnen kote ekipman ijans yo ye sou bato a',
              'Respekte kapasite maksimòm bato a',
              'Toujou gen yon telefòn chaje pou ijans',
              'Suiv règ navegasyon lokal yo',
            ].map(tip => (
              <div key={tip} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency */}
        <div className="bg-red-50 rounded-2xl border border-red-200 p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" />
            <h2 className="font-display text-2xl font-bold text-red-800">Ijans sou Dlo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { country: '🇺🇸 USA', number: 'Coast Guard: 911 / VHF Channel 16' },
              { country: '🇫🇷 France', number: 'CROSS: 196 / VHF Channel 16' },
              { country: '🇭🇹 Haiti', number: 'Urgence: 114' },
              { country: '🌍 Mondyal', number: 'VHF Channel 16 (Detress)' },
            ].map(({ country, number }) => (
              <div key={country} className="bg-white rounded-xl p-4">
                <div className="font-semibold text-gray-800">{country}</div>
                <div className="text-red-600 text-sm mt-1">{number}</div>
              </div>
            ))}
          </div>
          <p className="text-red-700 text-sm font-medium">⚠️ Si ou nan danje, rele ijans lokal ou imedyatman anvan ou kontakte Nautica.</p>
        </div>

        {/* Platform safety */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Anchor className="w-7 h-7 text-ocean-600" />
            <h2 className="font-display text-2xl font-bold">Kijan Nautica Pwoteje Ou</h2>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Verifikasyon Bato', desc: 'Chak bato pase yon pwosesis verifikasyon anvan li parèt sou platfòm nan.' },
              { title: 'Peman Sekirize', desc: 'Tout tranzaksyon pwoteje pa Stripe — youn nan sistèm peman ki pi sekirize.' },
              { title: 'Asirans Opsyonèl', desc: 'Nou ofri opsyon asirans pou pwoteje ou pandan lokasyon an.' },
              { title: 'Sipò 24/7', desc: 'Ekip nou an disponib nenpòt ki lè si ou bezwen èd.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-ocean-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-800">{title}</div>
                  <div className="text-gray-600 text-sm mt-1">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
