'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Anchor, Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Modpas yo pa menm')
      return
    }
    if (form.password.length < 8) {
      toast.error('Modpas dwe gen omwen 8 karaktè')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      toast.success('Kont kreye! Byenveni sou Nautica 🎉')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Erè rive')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 ocean-gradient items-center justify-center relative overflow-hidden">
        <div className="text-white text-center z-10 px-12">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Anchor className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-4xl font-bold mb-4">Rejwenn Nautica</h2>
          <p className="text-ocean-200 text-lg leading-relaxed">
            Kreye kont ou gratis epi kòmanse eksplore oubyen lwe bato ou jodi a.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[['🚤', 'Lwe Bato'], ['💰', 'Touche Lajan'], ['⭐', 'Avis Reyèl']].map(([icon, label]) => (
              <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs text-ocean-200">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full" fill="rgba(255,255,255,0.1)">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 ocean-gradient rounded-xl flex items-center justify-center">
              <Anchor className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold">Nautica</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Kreye Kont</h1>
          <p className="text-gray-500 mb-8">Déjà gen kont? <Link href="/login" className="text-ocean-600 font-medium hover:underline">Konekte</Link></p>

          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Enskri ak Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">oubyen</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Non Konplè</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="Janine Dupont" required className="input-field" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="ou@exemple.com" required className="input-field" />
            </div>
            <div>
              <label className="label">Modpas</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min 8 karaktè"
                  required
                  minLength={8}
                  className="input-field pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Konfime Modpas</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="Repete modpas ou"
                required
                className="input-field"
              />
            </div>

            <p className="text-xs text-gray-500">
              Lè ou enskri, ou aksepte <Link href="/terms" className="text-ocean-600 hover:underline">Kondisyon Itilizasyon</Link> ak <Link href="/privacy" className="text-ocean-600 hover:underline">Politik Konfidansyalite</Link> nou an.
            </p>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Kreye Kont Gratis'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
