import Link from 'next/link'
import { Anchor, Instagram, Facebook, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-ocean-950 text-white">
      {/* Wave decoration */}
      <div className="overflow-hidden h-12 bg-gray-50">
        <svg viewBox="0 0 1200 50" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0 C300,50 900,0 1200,50 L1200,50 L0,50 Z" fill="#0c4a6e" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-ocean-600 rounded-xl flex items-center justify-center">
                <Anchor className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold">Nautica</span>
            </div>
            <p className="text-ocean-300 text-sm leading-relaxed">
              Platfòm nimewo 1 pou lwe bato. Jwenn bato pafè ou a nenpòt kote nan mond lan.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-ocean-800 hover:bg-ocean-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-ocean-100">Eksplore</h4>
            <ul className="space-y-3">
              {[['Eksplore Bato', '/boats/search'], ['Kijan li Mache', '/how-it-works'], ['Mete Bato Ou', '/dashboard/my-boats/new'], ['Devni Pwopriyetè', '/become-host']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-ocean-400 hover:text-white text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-ocean-100">Sipò</h4>
            <ul className="space-y-3">
              {[['Kesyon Souvan', '/faq'], ['Kontakte Nou', '/contact'], ['Sekirite', '/safety'], ['Règleman Anilasyon', '/cancellation']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-ocean-400 hover:text-white text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-ocean-100">Legal</h4>
            <ul className="space-y-3">
              {[['Règleman Konfidansyalite', '/privacy'], ['Kondisyon Itilizasyon', '/terms'], ['Cookies', '/cookies']].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-ocean-400 hover:text-white text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ocean-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ocean-400 text-sm">© 2026 Nautica. Tout dwa rezève.</p>
          <p className="text-ocean-400 text-sm">Fè ak ❤️ pou navigatè yo</p>
        </div>
      </div>
    </footer>
  )
}
