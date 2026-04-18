import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="ocean-gradient text-white py-16 text-center">
        <h1 className="font-display text-4xl font-bold mb-3">Politik Cookies</h1>
        <p className="text-ocean-200">Kijan nou itilize cookies sou Nautica</p>
      </section>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 space-y-8">
          {[
            { title: 'Kisa Cookies Ye?', content: 'Cookies se ti fichye tèks ki estoke sou òdinatè ou lè ou vizite yon sit. Yo ede sit la sonje preferans ou ak amelyore eksperyans ou.' },
            { title: 'Cookies nou Itilize', content: 'Cookies Nesesè: Pou fè sit la fonksyone (sesyon, otantifikasyon). Cookies Analitik: Pou konprann kijan moun itilize sit la. Cookies Preferans: Pou sonje lang ak lòt preferans ou.' },
            { title: 'Kijan pou Jere Cookies', content: 'Ou ka dezaktive cookies nan paramèt navigatè ou. Atansyon — sa ka afekte fonksyonalite sit la, tankou rès konekte.' },
            { title: 'Cookies Tyes', content: 'Nou itilize Stripe (peman), Cloudinary (foto), ak Google Analytics (estatistik). Chak sèvis sa yo gen pwòp politik cookies pa yo.' },
          ].map(({ title, content }) => (
            <div key={title}>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">{title}</h2>
              <p className="text-gray-600 leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
