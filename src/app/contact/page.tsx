'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Mail, Phone, MessageCircle, Loader2, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    toast.success('Mesaj ou voye! Nou pral reponn ou nan 24 zè. ✅')
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="ocean-gradient text-white py-16 text-center">
        <h1 className="font-display text-4xl font-bold mb-3">Kontakte Nou</h1>
        <p className="text-ocean-200 text-lg">Nou la pou ede ou — reponn nan 24 zè</p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-gray-900">Jwenn Nou</h2>

            {[
              { icon: Mail, title: 'Email', value: 'support@nautica.com', desc: 'Reponn nan 24 zè' },
              { icon: Phone, title: 'Telefòn', value: '+1 (555) 000-0000', desc: 'Lendi-Vandredi, 9am-6pm' },
              { icon: MessageCircle, title: 'Chat an Dirèk', value: 'Disponib sou sit la', desc: 'Reponn an kèk minit' },
              { icon: MapPin, title: 'Biwo', value: 'Santo Domingo, RD', desc: 'Karayib & Mondyal' },
            ].map(({ icon: Icon, title, value, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-ocean-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-ocean-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{title}</div>
                  <div className="text-ocean-600 text-sm">{value}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="font-display text-xl font-bold mb-6">Voye yon Mesaj</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Non ou</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="input-field" placeholder="Jean Pierre" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="input-field" placeholder="ou@example.com" />
                </div>
              </div>
              <div>
                <label className="label">Sijè</label>
                <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required className="input-field">
                  <option value="">Chwazi sijè...</option>
                  <option>Pwoblèm ak Rezèvasyon</option>
                  <option>Pwoblèm ak Peman</option>
                  <option>Mete Bato sou Platfòm</option>
                  <option>Pwoblèm Teknik</option>
                  <option>Lòt</option>
                </select>
              </div>
              <div>
                <label className="label">Mesaj</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} className="input-field resize-none" placeholder="Eksplike pwoblèm ou oubyen kesyon ou..." />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-4">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Voye Mesaj'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
