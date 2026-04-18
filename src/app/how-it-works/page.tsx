import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { Search, Calendar, Ship, Star, Shield, DollarSign, Camera, CheckCircle } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="ocean-gradient text-white py-20 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Kijan Nautica Mache?</h1>
        <p className="text-ocean-200 text-lg max-w-xl mx-auto">Senp, rapid, epi sekirize — pou lwa ak pwopriyetè bato</p>
      </section>

      {/* For renters */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <h2 className="font-display text-3xl font-bold text-center mb-4">Pou Moun ki Vle Lwe 🚤</h2>
        <p className="text-center text-gray-500 mb-14">3 etap senp pou ou jwenn bato ou vle a</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Search, step: '01', title: 'Chèche & Filtre', desc: 'Chèche bato pa peyi, rejyon, kalite, pri, ak kapasite. Nou gen plis pase 500 bato nan 40 peyi.', color: 'bg-blue-50 text-blue-600' },
            { icon: Calendar, step: '02', title: 'Rezève & Peye', desc: 'Chwazi dat ou yo, voye yon demann, epi peye san danje ak Stripe. Pa gen lajan ki soti jiskaske pwopriyetè a konfime.', color: 'bg-green-50 text-green-600' },
            { icon: Ship, step: '03', title: 'Monte & Pwofite!', desc: 'Rankontre pwopriyetè a, monte bato, epi pwofite eksperyans ou sou dlo a. Kite yon avis apre!', color: 'bg-orange-50 text-orange-600' },
          ].map(({ icon: Icon, step, title, desc, color }) => (
            <div key={step} className="text-center">
              <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 relative`}>
                <Icon className="w-8 h-8" />
                <span className="absolute -top-2 -right-2 w-6 h-6 ocean-gradient rounded-full text-white text-xs font-bold flex items-center justify-center">{step}</span>
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/boats/search" className="btn-primary text-lg px-10 py-4">Kòmanse Chèche Bato</Link>
        </div>
      </section>

      <hr className="max-w-5xl mx-auto border-gray-100" />

      {/* For owners */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <h2 className="font-display text-3xl font-bold text-center mb-4">Pou Pwopriyetè Bato 💰</h2>
        <p className="text-center text-gray-500 mb-14">Touche lajan ak bato ou a — fasil ak san risk</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Camera, step: '01', title: 'Kreye Lis Ou', desc: 'Mete foto, pri, disponibilite, ak règ bato ou. Sa pran 10 minit sèlman.', color: 'bg-purple-50 text-purple-600' },
            { icon: CheckCircle, step: '02', title: 'Resevwa Demann', desc: 'Ou resevwa notifikasyon lè yon moun vle lwe. Ou ka aksepte oubyen refize.', color: 'bg-teal-50 text-teal-600' },
            { icon: DollarSign, step: '03', title: 'Touche Lajan', desc: 'Apre lokasyon an, ou resevwa 88% pri a dirèkteman nan kont ou. Nautica pran 12% kòm frè sèvis.', color: 'bg-green-50 text-green-600' },
          ].map(({ icon: Icon, step, title, desc, color }) => (
            <div key={step} className="text-center">
              <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 relative`}>
                <Icon className="w-8 h-8" />
                <span className="absolute -top-2 -right-2 w-6 h-6 ocean-gradient rounded-full text-white text-xs font-bold flex items-center justify-center">{step}</span>
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/dashboard/my-boats/new" className="btn-primary text-lg px-10 py-4">Mete Bato Mwen</Link>
        </div>
      </section>

      {/* Trust signals */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-2xl font-bold text-center mb-10">Nou Pwoteje Ou</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Peman Sekirize', desc: 'Tout peman pase pa Stripe — youn nan sistèm peman ki pi sekirize nan mond lan.' },
              { icon: Star, title: 'Avis Verifikasyon', desc: 'Tout avis soti nan moun ki vrèman te lwe bato a — pa gen fo avis.' },
              { icon: CheckCircle, title: 'Bato Verifye', desc: 'Ekip Nautica verifye tout bato ki sou platfòm nan anvan yo parèt.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <Icon className="w-10 h-10 text-ocean-600 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
