'use client'

import { useDashboardStats, useSparklineData } from '@/hooks/use-dashboard'
import { StatCard } from './stat-card'
import { match } from 'ts-pattern'

export function StatsGrid() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: sparklines, isLoading: sparklinesLoading } = useSparklineData()

  const isLoading = statsLoading || sparklinesLoading

  return match({ isLoading, stats, sparklines })
    .with({ isLoading: true }, () => (
      <div className="grid grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[88px] animate-pulse rounded-xl bg-white/60"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    ))
    .otherwise(() => (
      <div className="grid grid-cols-4 gap-5">
        <StatCard
          type="bookings"
          value={stats?.newBookings || 0}
          sparklineData={sparklines?.bookings || []}
          animationDelay={0}
        />
        <StatCard
          type="rooms"
          value={stats?.availableRooms || 0}
          sparklineData={sparklines?.rooms || []}
          animationDelay={75}
        />
        <StatCard
          type="checkin"
          value={stats?.checkIns || 0}
          sparklineData={sparklines?.checkIns || []}
          animationDelay={150}
        />
        <StatCard
          type="checkout"
          value={stats?.checkOuts || 0}
          sparklineData={sparklines?.checkOuts || []}
          animationDelay={225}
        />
      </div>
    ))
}
