'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Anchor, Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) { toast.error(result.error) }
      else { toast.success('Byenveni!'); router.push(callbackUrl); router.refresh() }
    } catch { toast.error('Yon erè rive') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 ocean-gradient rounded-xl flex items-center justify-center">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold">Nautica</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Konekte</h1>
        <p className="text-gray-500 mb-8">Pa gen kont? <Link href="/register" className="text-ocean-600 font-medium hover:underline">Enskri gratis</Link></p>
        <button onClick={() => signIn('google', { callbackUrl })} className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all mb-6">
          Kontinye ak Google
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field" />
          </div>
          <div>
            <label className="label">Modpas</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="input-field pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-4">
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Konekte'}
          </button>
        </form>
      </div>
    </div>
  )
}
