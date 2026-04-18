import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="ocean-gradient text-white py-16 text-center">
        <h1 className="font-display text-4xl font-bold mb-3">Règleman Anilasyon</h1>
        <p className="text-ocean-200 text-lg">Konprann politik anilasyon nou an</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        {[
          {
            icon: CheckCircle,
            color: 'text-green-500',
            bg: 'bg-green-50 border-green-200',
            title: '✅ Fleksib',
            desc: 'Ranbousman konplè (100%) si ou anile 24 zè anvan dat kòmansman an. Si ou anile apre sa, pa gen ranbousman.',
            details: ['Ranbousman 100% — plis pase 24h anvan', 'Ranbousman 0% — mwens pase 24h anvan', 'Frè sèvis (12%) — pa gen ranbousman'],
          },
          {
            icon: AlertCircle,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50 border-yellow-200',
            title: '⚡ Modere',
            desc: 'Ranbousman konplè si ou anile 5 jou anvan. 50% ranbousman si ou anile ant 1-5 jou anvan.',
            details: ['Ranbousman 100% — plis pase 5 jou anvan', 'Ranbousman 50% — 1 a 5 jou anvan', 'Ranbousman 0% — mwens pase 24h anvan'],
          },
          {
            icon: XCircle,
            color: 'text-red-500',
            bg: 'bg-red-50 border-red-200',
            title: '🔒 Strict',
            desc: 'Pa gen ranbousman apre konfirmasyon rezèvasyon an, eksepte si gen yon ijans sètifye.',
            details: ['Ranbousman 100% — nan 24h apre rezèvasyon (si 7+ jou anvan)', 'Ranbousman 50% — plis pase 7 jou anvan', 'Ranbousman 0% — mwens pase 7 jou anvan'],
          },
        ].map(({ icon: Icon, color, bg, title, desc, details }) => (
          <div key={title} className={`bg-white rounded-2xl shadow-sm border p-8 ${bg}`}>
            <div className="flex items-start gap-4">
              <Icon className={`w-8 h-8 ${color} shrink-0 mt-1`} />
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold mb-3">{title}</h2>
                <p className="text-gray-600 mb-5">{desc}</p>
                <ul className="space-y-2">
                  {details.map(d => (
                    <li key={d} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-ocean-50 rounded-2xl p-6 border border-ocean-200">
          <h3 className="font-semibold text-ocean-800 mb-2">📌 Nòt Enpòtan</h3>
          <ul className="space-y-2 text-sm text-ocean-700">
            <li>• Frè sèvis Nautica (12%) pa gen ranbousman nan okenn ka</li>
            <li>• Ranbousman yo fèt nan 5-10 jou travay sou kat kredi ou</li>
            <li>• Nan ka ijans natirèl (tanpèt, ouragann), nou ofri ranbousman konplè</li>
            <li>• Pou plis enfòmasyon, kontakte nou: support@nautica.com</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  )
}
