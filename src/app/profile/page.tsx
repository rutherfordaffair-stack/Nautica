'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { User, Camera, Loader2, Phone, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', bio: '' })

  useEffect(() => {
    if (!session) { router.push('/login'); return }
    setForm({
      name: session.user?.name || '',
      phone: '',
      bio: '',
    })
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Erè')
      await update({ name: form.name })
      toast.success('Pwofil mete ajou! ✅')
    } catch {
      toast.error('Erè rive')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Pwofil Mwen</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="relative">
              {session?.user?.image ? (
                <Image src={session.user.image} alt="" width={80} height={80} className="rounded-full" />
              ) : (
                <div className="w-20 h-20 ocean-gradient rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-ocean-700 rounded-full flex items-center justify-center text-white shadow-md hover:bg-ocean-800 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <div className="font-semibold text-lg text-gray-900">{session?.user?.name}</div>
              <div className="text-gray-500 text-sm">{session?.user?.email}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Non Konplè</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input-field"
                placeholder="Non ou"
              />
            </div>
            <div>
              <label className="label">Telefòn</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="input-field pl-10"
                  placeholder="+509 XXXX XXXX"
                />
              </div>
            </div>
            <div>
              <label className="label">Bio</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={4}
                  className="input-field pl-10 resize-none"
                  placeholder="Di nou kichòy sou ou..."
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Sove Chanjman'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}
