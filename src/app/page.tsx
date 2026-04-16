import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SearchBar } from '@/components/boats/SearchBar'
import { BoatCard } from '@/components/boats/BoatCard'
import { prisma } from '@/lib/prisma'
import { Anchor, Shield, Star, Clock, ArrowRight, Waves } from 'lucide-react'

async function getFeaturedBoats() {
  return prisma.boat.findMany({
    where: { isActive: true },
    include: {
      owner: { select: { id: true, name: true, image: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })
}

export default async function HomePage() {
  const boats = await getFeaturedBoats()

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 ocean-gradient opacity-95" />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1920&q=80"
            alt="Bato sou dlo"
            fill
            className="object-cover mix-blend-overlay opacity-30"
            priority
          />
        </div>

        {/* Animated waves at bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-20">
          <div className="flex animate-wave w-[200%]">
            <svg viewBox="0 0 1200 80" className="w-1/2 h-20" preserveAspectRatio="none">
              <path d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,80 L0,80 Z" fill="rgba(255,255,255,0.1)" />
            </svg>
            <svg viewBox="0 0 1200 80" className="w-1/2 h-20" preserveAspectRatio="none">
              <path d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,80 L0,80 Z" fill="rgba(255,255,255,0.1)" />
            </svg>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center text-white pt-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Waves className="w-4 h-4 text-sand-400" />
            <span className="text-sm font-medium">+500 bato disponib toupatou</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 animate-slide-up">
            Lwe Bato Pafè
            <br />
            <span className="text-sand-300">Ou a</span>
          </h1>
          <p className="text-lg md:text-xl text-ocean-200 max-w-2xl mx-auto mb-10 animate-fade-in">
            Dekouvri dlo a nan yon bato eksepsyonèl. Ou ka lwe pa jou oubyen pa zè, nenpòt kote nan mond lan.
          </p>

          {/* Search */}
          <div className="max-w-4xl mx-auto animate-slide-up">
            <SearchBar />
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14 animate-fade-in">
            {[
              { label: 'Bato Disponib', value: '500+' },
              { label: 'Peyi', value: '40+' },
              { label: 'Kliyan Satisfè', value: '12k+' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl font-bold text-sand-300">{value}</div>
                <div className="text-sm text-ocean-300 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">Kijan Nautica Mache?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Twa etap senp pou ou jwenn bato rèv ou a</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🔍', step: '01', title: 'Filtre & Cherche', desc: 'Filtre pa peyi, zon, kalite bato, ak pri. Jwenn egzakteman sa ou bezwen.' },
              { icon: '📅', step: '02', title: 'Rezève Fasil', desc: 'Chwazi dat ou yo, voye demann, epi peye san danje avèk Stripe.' },
              { icon: '⛵', step: '03', title: 'Monte Bato!', desc: 'Rankontre pwopriyetè a, monte bato, epi pwofite tan ou sou dlo a.' },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-md mb-6 group-hover:shadow-lg transition-shadow">
                  <span className="text-3xl">{icon}</span>
                  <span className="absolute -top-2 -right-2 w-7 h-7 ocean-gradient rounded-full text-white text-xs font-bold flex items-center justify-center">{step}</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured boats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">Bato Popilè Yo</h2>
              <p className="text-gray-600">Bato ki pi renmen pa kliyan nou yo</p>
            </div>
            <Link href="/boats/search" className="btn-secondary hidden md:flex items-center gap-2 text-sm">
              Wè Tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {boats.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Anchor className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Pa gen bato ankò. Mete premye a!</p>
              <Link href="/dashboard/my-boats/new" className="btn-primary mt-4 inline-block">Mete Bato Ou</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {boats.map((boat) => (
                <BoatCard key={boat.id} boat={boat as any} />
              ))}
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Link href="/boats/search" className="btn-secondary">Wè Tout Bato</Link>
          </div>
        </div>
      </section>

      {/* Why Nautica */}
      <section className="py-20 bg-ocean-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Poukisa Chwazi Nautica?</h2>
            <p className="text-ocean-300 max-w-xl mx-auto">Nou asire ou yon eksperyans san pwoblèm sou dlo</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Peman Sekirize', desc: 'Tout tranzaksyon pwoteje pa Stripe. Ranbousman garanti.' },
              { icon: Star, title: 'Bato Verifye', desc: 'Chak bato pase yon pwosesis verifikasyon pou sekirite ou.' },
              { icon: Clock, title: 'Sipò 24/7', desc: 'Ekip nou an disponib nenpòt ki lè pou ede ou.' },
              { icon: Anchor, title: 'Chwazi Kou Ou Vle', desc: 'Lwe pa zè oubyen pa jou. Fleksib pou tout bezwen ou.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-ocean-900 rounded-2xl p-6 hover:bg-ocean-800 transition-colors">
                <div className="w-12 h-12 bg-ocean-700 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-sand-300" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-ocean-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Become host */}
      <section className="py-20 bg-gradient-to-r from-sand-100 to-ocean-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Ou Gen Bato? Touche Lajan!</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Mete bato ou sou Nautica epi kòmanse touche. Plis pase 500 pwopriyetè déjà ap fè revni avèk nou.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/my-boats/new" className="btn-primary text-lg px-8 py-4">
              Mete Bato Mwen Gratis
            </Link>
            <Link href="/how-it-works" className="btn-secondary text-lg px-8 py-4">
              Aprann Plis
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
