'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Anchor, ChevronDown, Plus, Ship, Heart, User, LogOut, LayoutDashboard } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 ocean-gradient rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Anchor className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-ocean-950">Nautica</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/boats/search" className="btn-ghost text-sm">Eksplore Bato</Link>
            <Link href="/how-it-works" className="btn-ghost text-sm">Kijan li mache?</Link>
            {session && (
              <Link href="/dashboard/my-boats/new" className="btn-ghost text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Mete Bato Ou
              </Link>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-ocean-300 hover:bg-ocean-50 transition-all"
                >
                  {session.user?.image ? (
                    <Image src={session.user.image} alt="" width={32} height={32} className="rounded-full" />
                  ) : (
                    <div className="w-8 h-8 ocean-gradient rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {session.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{session.user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-slide-up">
                    <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-ocean-50 text-sm text-gray-700 transition-colors" onClick={() => setProfileOpen(false)}>
                      <LayoutDashboard className="w-4 h-4 text-ocean-600" /> Tableau de bord
                    </Link>
                    <Link href="/dashboard/my-boats" className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-ocean-50 text-sm text-gray-700 transition-colors" onClick={() => setProfileOpen(false)}>
                      <Ship className="w-4 h-4 text-ocean-600" /> Bato Mwen Yo
                    </Link>
                    <Link href="/dashboard/bookings" className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-ocean-50 text-sm text-gray-700 transition-colors" onClick={() => setProfileOpen(false)}>
                      <Heart className="w-4 h-4 text-ocean-600" /> Rezèvasyon
                    </Link>
                    <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-ocean-50 text-sm text-gray-700 transition-colors" onClick={() => setProfileOpen(false)}>
                      <User className="w-4 h-4 text-ocean-600" /> Pwofil Mwen
                    </Link>
                    <hr className="my-1.5 border-gray-100" />
                    <button
                      onClick={() => { signOut({ callbackUrl: '/' }); setProfileOpen(false) }}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 w-full text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Dekonekte
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-ghost text-sm">Konekte</Link>
                <Link href="/register" className="btn-primary text-sm py-2">Enskri Gratis</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-up">
            <div className="flex flex-col gap-1">
              <Link href="/boats/search" className="btn-ghost text-sm py-3" onClick={() => setMenuOpen(false)}>Eksplore Bato</Link>
              <Link href="/how-it-works" className="btn-ghost text-sm py-3" onClick={() => setMenuOpen(false)}>Kijan li mache?</Link>
              {session ? (
                <>
                  <Link href="/dashboard" className="btn-ghost text-sm py-3" onClick={() => setMenuOpen(false)}>Tableau de bord</Link>
                  <Link href="/dashboard/my-boats/new" className="btn-ghost text-sm py-3" onClick={() => setMenuOpen(false)}>+ Mete Bato Ou</Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-ghost text-sm py-3 text-left text-red-600">Dekonekte</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost text-sm py-3" onClick={() => setMenuOpen(false)}>Konekte</Link>
                  <Link href="/register" className="btn-primary text-sm mt-2" onClick={() => setMenuOpen(false)}>Enskri Gratis</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
