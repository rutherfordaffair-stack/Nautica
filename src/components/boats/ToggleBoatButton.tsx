'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function ToggleBoatButton({ boatId, isActive }: { boatId: string; isActive: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggle = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/boats/${boatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      if (res.ok) {
        toast.success(isActive ? 'Bato dezaktive' : 'Bato aktive')
        router.refresh()
      }
    } catch {
      toast.error('Erè rive')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="p-2 text-gray-500 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors"
      title={isActive ? 'Dezaktive' : 'Aktive'}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isActive ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
    </button>
  )
}
