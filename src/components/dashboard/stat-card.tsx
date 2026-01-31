'use client'

import { Card } from '@/components/ui/card'
import { Sparkline } from './sparkline'
import { cn } from '@/lib/utils'
import { match } from 'ts-pattern'
import {
  CalendarPlus,
  DoorOpen,
  LogIn,
  LogOut,
  LucideIcon
} from 'lucide-react'

type StatType = 'bookings' | 'rooms' | 'checkin' | 'checkout'

interface StatCardProps {
  type: StatType
  value: number
  sparklineData: number[]
  className?: string
  animationDelay?: number
}

function getStatConfig(type: StatType): {
  label: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  sparklineColor: string
  accentGradient: string
} {
  return match(type)
    .with('bookings', () => ({
      label: 'New Booking',
      icon: CalendarPlus,
      iconBg: 'bg-sky-50 dark:bg-sky-950',
      iconColor: 'text-sky-600 dark:text-sky-400',
      sparklineColor: '#0284c7',
      accentGradient: 'from-sky-500/5 to-transparent'
    }))
    .with('rooms', () => ({
      label: 'Available Room',
      icon: DoorOpen,
      iconBg: 'bg-amber-50 dark:bg-amber-950',
      iconColor: 'text-amber-600 dark:text-amber-400',
      sparklineColor: '#d97706',
      accentGradient: 'from-amber-500/5 to-transparent'
    }))
    .with('checkin', () => ({
      label: 'Check In',
      icon: LogIn,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      sparklineColor: '#059669',
      accentGradient: 'from-emerald-500/5 to-transparent'
    }))
    .with('checkout', () => ({
      label: 'Check Out',
      icon: LogOut,
      iconBg: 'bg-rose-50 dark:bg-rose-950',
      iconColor: 'text-rose-600 dark:text-rose-400',
      sparklineColor: '#e11d48',
      accentGradient: 'from-rose-500/5 to-transparent'
    }))
    .exhaustive()
}

export function StatCard({ type, value, sparklineData, className, animationDelay = 0 }: StatCardProps) {
  const config = getStatConfig(type)
  const Icon = config.icon

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border-0 bg-card p-5',
        'shadow-sm hover:shadow-md dark:shadow-none dark:border dark:border-border/50',
        'transition-all duration-300 ease-out',
        'animate-fade-up',
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300',
        'group-hover:opacity-100',
        config.accentGradient
      )} />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            'transition-transform duration-300 group-hover:scale-105',
            config.iconBg
          )}>
            <Icon className={cn('h-5 w-5', config.iconColor)} strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight text-foreground tabular-nums">
              {value.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-muted-foreground">{config.label}</p>
          </div>
        </div>
        <div className="transition-transform duration-300 group-hover:scale-105">
          <Sparkline data={sparklineData} color={config.sparklineColor} />
        </div>
      </div>
    </Card>
  )
}
