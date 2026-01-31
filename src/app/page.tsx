'use client'

import { StatsGrid } from '@/components/dashboard/stats-grid'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { RecentActivities } from '@/components/dashboard/recent-activities'
import { BookingsBreakdown } from '@/components/dashboard/bookings-breakdown'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <div className="flex items-baseline gap-2">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Hi, Sarah!
          </h2>
          <span className="text-2xl">👋</span>
        </div>
        <p className="mt-1 text-muted-foreground">
          Whole data about your business here.
        </p>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-3 gap-6">
        <RevenueChart />
        <BookingsBreakdown />
      </div>

      <RecentActivities />
    </div>
  )
}
