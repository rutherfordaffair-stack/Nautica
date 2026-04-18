import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="ocean-gradient text-white py-16 text-center">
        <h1 className="font-display text-4xl font-bold mb-3">Règleman Konfidansyalite</h1>
        <p className="text-ocean-200">Dènye mizajou: Janvye 2024</p>
      </section>
      <div className="max-w-4xl mx-auto px-4 py-16 prose prose-gray max-w-none">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 space-y-8">
          {[
            { title: '1. Enfòmasyon nou kolekte', content: 'Nou kolekte enfòmasyon ou bay nou dirèkteman, tankou non ou, email, ak enfòmasyon peman lè ou kreye yon kont oubyen fè yon rezèvasyon. Nou kolekte tou done itilizasyon otomatikman lè ou itilize sèvis nou.' },
            { title: '2. Kijan nou itilize enfòmasyon ou', content: 'Nou itilize enfòmasyon ou pou trete rezèvasyon, pwosese peman, voye notifikasyon, amelyore sèvis nou, epi respekte obligasyon legal nou yo.' },
            { title: '3. Pataj enfòmasyon', content: 'Nou pa janm vann enfòmasyon pèsonèl ou. Nou ka pataje enfòmasyon yo ak pwopriyetè bato pou fasilite rezèvasyon, ak Stripe pou trete peman, ak Cloudinary pou estoke foto.' },
            { title: '4. Sekirite done', content: 'Nou itilize chifleman SSL pou pwoteje done ou pandan tranzaksyon. Modpas yo estoke an fòm hash — pa gen yon moun ki ka li yo.' },
            { title: '5. Dwa ou', content: 'Ou gen dwa pou aksede, korije, oubyen efase done pèsonèl ou nenpòt ki lè. Kontakte nou nan privacy@nautica.com pou fè yon demann.' },
            { title: '6. Cookies', content: 'Nou itilize cookies pou amelyore eksperyans ou. Ou ka dezaktive cookies nan navigatè ou, men sa ka afekte fonksyonalite sit la.' },
          ].map(({ title, content }) => (
            <div key={title}>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">{title}</h2>
              <p className="text-gray-600 leading-relaxed">{content}</p>
            </div>
          ))}
          <div className="bg-ocean-50 rounded-xl p-5 border border-ocean-200">
            <p className="text-ocean-700 text-sm">Pou kesyon sou enfòmasyon prive ou, kontakte nou: <strong>privacy@nautica.com</strong></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
