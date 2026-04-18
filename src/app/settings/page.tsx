'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Lock, Bell, Loader2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [notifications, setNotifications] = useState({ email: true, bookings: true, promotions: false })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Nouvo modpas yo pa menm')
      return
    }
    if (passwords.newPassword.length < 8) {
      toast.error('Modpas dwe gen omwen 8 karaktè')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/users/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwords),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Modpas chanje ak siksè! ✅')
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      toast.error(err.message || 'Erè rive')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Paramèt</h1>

        {/* Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-ocean-50 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-ocean-600" />
            </div>
            <h2 className="font-display text-xl font-bold">Chanje Modpas</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="label">Vye Modpas</label>
              <div className="relative">
                <input
                  type={showOld ? 'text' : 'password'}
                  value={passwords.oldPassword}
                  onChange={e => setPasswords(p => ({ ...p, oldPassword: e.target.value }))}
                  className="input-field pr-12"
                  required
                />
                <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Nouvo Modpas</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={passwords.newPassword}
                  onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                  className="input-field pr-12"
                  minLength={8}
                  required
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Konfime Nouvo Modpas</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
                className="input-field"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Chanje Modpas'}
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-ocean-50 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-ocean-600" />
            </div>
            <h2 className="font-display text-xl font-bold">Notifikasyon</h2>
          </div>

          <div className="space-y-4">
            {[
              { key: 'email', label: 'Notifikasyon Email', desc: 'Resevwa notifikasyon pa email' },
              { key: 'bookings', label: 'Rezèvasyon', desc: 'Alèt pou nouvo rezèvasyon ak chanjman' },
              { key: 'promotions', label: 'Promosyon', desc: 'Nouvèl ak ofspesyal Nautica' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-800">{label}</div>
                  <div className="text-sm text-gray-500">{desc}</div>
                </div>
                <button
                  onClick={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notifications[key as keyof typeof notifications] ? 'bg-ocean-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow ${notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>

          <button onClick={() => toast.success('Notifikasyon sove!')} className="btn-primary w-full py-3 mt-6">
            Sove Preferans
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
