'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Ship, Calendar, DollarSign, Star, User, Plus, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Rezime', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/my-boats', label: 'Bato Mwen Yo', icon: Ship },
  { href: '/dashboard/my-boats/new', label: 'Ajoute Bato', icon: Plus },
  { href: '/dashboard/bookings', label: 'Rezèvasyon', icon: Calendar },
  { href: '/dashboard/earnings', label: 'Revni', icon: DollarSign },
]

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null }
}

export function DashboardSidebar({ user }: Props) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* User info */}
      <div className="ocean-gradient p-5">
        <div className="flex items-center gap-3">
          {user.image ? (
            <Image src={user.image} alt="" width={44} height={44} className="rounded-full border-2 border-white/30" />
          ) : (
            <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <div className="text-white font-semibold text-sm">{user.name}</div>
            <div className="text-ocean-200 text-xs truncate max-w-[140px]">{user.email}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-3">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-ocean-700 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-ocean-700'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {href === '/dashboard/my-boats/new' && !active && (
                <span className="ml-auto text-xs bg-ocean-100 text-ocean-700 px-2 py-0.5 rounded-full font-semibold">Nouvo</span>
              )}
            </Link>
          )
        })}

        <div className="border-t border-gray-100 mt-3 pt-3">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-ocean-700 transition-all"
          >
            <User className="w-4 h-4" /> Pwofil Mwen
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-ocean-700 transition-all"
          >
            <Settings className="w-4 h-4" /> Paramèt
          </Link>
        </div>
      </nav>
    </div>
  )
}
