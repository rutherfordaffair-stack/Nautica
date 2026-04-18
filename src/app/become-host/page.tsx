import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { DollarSign, Shield, Star, Clock, Camera, CheckCircle } from 'lucide-react'

export default function BecomeHostPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="ocean-gradient text-white py-24 text-center px-4">
        <h1 className="font-display text-5xl font-bold mb-6">Touche Lajan ak Bato Ou</h1>
        <p className="text-ocean-200 text-xl max-w-2xl mx-auto mb-10">
          Rejwenn plis pase 500 pwopriyetè ki déjà ap fè revni sou Nautica. Fasil, sekirize, epi pwofitab.
        </p>
        <Link href="/register" className="bg-white text-ocean-700 font-bold px-10 py-4 rounded-xl hover:bg-ocean-50 transition-all text-lg shadow-lg">
          Kòmanse Gratis Kounye a
        </Link>
      </section>

      {/* Stats */}
      <section className="bg-ocean-950 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[['$2,400', 'Revni mwayèn pa mwa'], ['88%', 'Ou resevwa di pri a'], ['48h', 'Pou kòmanse touche']].map(([val, label]) => (
            <div key={label}>
              <div className="font-display text-4xl font-bold text-sand-300">{val}</div>
              <div className="text-ocean-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <h2 className="font-display text-3xl font-bold text-center mb-14">3 Etap pou Kòmanse</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Camera, step: '01', title: 'Kreye Lis Ou', desc: 'Mete foto bato ou, fikse pri ou, epi defini disponibilite ou. Sa pran mwens pase 10 minit.' },
            { icon: CheckCircle, step: '02', title: 'Aksepte Demann', desc: 'Resevwa demann rezèvasyon, revize yo, epi aksepte sa ki konvèn ou.' },
            { icon: DollarSign, step: '03', title: 'Touche Lajan', desc: 'Apre chak lokasyon, ou resevwa 88% pri a. Peman fèt otomatikman.' },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-16 h-16 ocean-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                <Icon className="w-8 h-8 text-white" />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-sand-400 rounded-full text-white text-xs font-bold flex items-center justify-center">{step}</span>
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-14">Pou Kisa Chwazi Nautica?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: DollarSign, title: 'Frè Ba', desc: 'Sèlman 12% frè sèvis — youn nan pi ba nan endistri a.' },
              { icon: Shield, title: 'Pwoteksyon Konplè', desc: 'Bato ou pwoteje. Lwa yo verifye anvan yo ka lwe.' },
              { icon: Star, title: 'Visibilite Maksimòm', desc: 'Bato ou parèt nan rechèch pou plis pase 40 peyi.' },
              { icon: Clock, title: 'Jere Fasil', desc: 'Kalandriye, peman, ak kominikasyon — tout nan yon sèl kote.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
                <div className="w-12 h-12 ocean-gradient rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{title}</h3>
                  <p className="text-gray-600 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-4">
        <h2 className="font-display text-3xl font-bold mb-4">Prè pou Kòmanse?</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">Kreye yon kont gratis epi mete premye bato ou nan mwens pase 10 minit.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-primary text-lg px-10 py-4">Kòmanse Gratis</Link>
          <Link href="/how-it-works" className="btn-secondary text-lg px-10 py-4">Aprann Plis</Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
