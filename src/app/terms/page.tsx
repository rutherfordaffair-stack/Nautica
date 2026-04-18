import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="ocean-gradient text-white py-16 text-center">
        <h1 className="font-display text-4xl font-bold mb-3">Kondisyon Itilizasyon</h1>
        <p className="text-ocean-200">Dènye mizajou: Janvye 2024</p>
      </section>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 space-y-8">
          {[
            { title: '1. Akseptasyon Kondisyon', content: 'Lè ou itilize Nautica, ou aksepte kondisyon itilizasyon sa yo. Si ou pa aksepte, tanpri pa itilize sèvis nou.' },
            { title: '2. Kont Itilizatè', content: 'Ou responsab pou kenbe sekirite kont ou. Pa pataje modpas ou. Ou dwe gen omwen 18 an pou kreye yon kont.' },
            { title: '3. Règ pou Pwopriyetè', content: 'Pwopriyetè yo dwe bay enfòmasyon egzak sou bato yo, respekte rezervasyon konfime, epi asire sekirite bato a.' },
            { title: '4. Règ pou Lwa', content: 'Lwa yo dwe respekte bato, swiv règ pwopriyetè a, epi gen lisans nesesè pou kondui si nesesè.' },
            { title: '5. Peman ak Frè', content: 'Nautica pran 12% frè sèvis sou chak tranzaksyon. Frè sa yo pa gen ranbousman. Pwopriyetè yo resevwa 88% pri lokasyon an.' },
            { title: '6. Responsabilite', content: 'Nautica sèvi kòm entèmedyè ant lwa ak pwopriyetè. Nou pa responsab pou aksidan, pèt, oubyen domaj ki rive pandan lokasyon.' },
            { title: '7. Modifikasyon', content: 'Nou ka modifye kondisyon sa yo nenpòt ki lè. Nou pral avèti ou pa email pou chanjman enpòtan.' },
          ].map(({ title, content }) => (
            <div key={title}>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">{title}</h2>
              <p className="text-gray-600 leading-relaxed">{content}</p>
            </div>
          ))}
          <div className="bg-ocean-50 rounded-xl p-5 border border-ocean-200">
            <p className="text-ocean-700 text-sm">Pou kesyon sou kondisyon yo, kontakte nou: <strong>legal@nautica.com</strong></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
