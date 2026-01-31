'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import {
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  StarIcon,
  Wallet
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Booking', href: '/bookings', icon: CalendarCheck },
  { name: 'Reviews', href: '/reviews', icon: StarIcon },
  { name: 'Cashflow', href: '/cashflow', icon: Wallet },
  { name: 'Message', href: '/messages', icon: MessageSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border/50 bg-white">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
          <span className="font-display text-lg font-bold text-white">H</span>
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
        </div>
        <span className="font-display text-xl font-semibold tracking-tight text-foreground">
          Hotelzz
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium',
                'transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-emerald-300" />
              )}
              <item.icon
                className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  isActive ? 'text-white' : 'text-muted-foreground/70 group-hover:text-foreground',
                  'group-hover:scale-105'
                )}
                strokeWidth={1.75}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border/50 p-4">
        <button className="group flex w-full items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-muted/50">
          <Avatar className="h-10 w-10 ring-2 ring-border/50 transition-all group-hover:ring-primary/20">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
            <AvatarFallback className="bg-primary/10 font-medium text-primary">DR</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-foreground">Dianne Russell</p>
            <p className="text-xs font-medium text-muted-foreground">Admin</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-hover:rotate-180" />
        </button>

        <button className="mt-2 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground/70 transition-colors hover:bg-destructive/5 hover:text-destructive">
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
