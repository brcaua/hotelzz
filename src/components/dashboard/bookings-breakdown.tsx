'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboardStats } from '@/hooks/use-dashboard'
import { formatNumber } from '@/lib/patterns'
import { Calendar, Sparkles } from 'lucide-react'

export function BookingsBreakdown() {
  const { data: stats, isLoading, error } = useDashboardStats()

  const totalBookings = (stats?.onlineBookings || 0) + (stats?.offlineBookings || 0)
  const onlinePercentage = totalBookings ? ((stats?.onlineBookings || 0) / totalBookings) * 100 : 0
  const offlinePercentage = totalBookings ? ((stats?.offlineBookings || 0) / totalBookings) * 100 : 0

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-44 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )
    }

    if (error) {
      return <div className="py-4 text-sm text-destructive">Error: {error.message}</div>
    }

    return (
      <div className="space-y-6">
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            {formatNumber(totalBookings)}
          </p>
          <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
        </div>

        <div className="relative h-3 overflow-hidden rounded-full bg-muted/50">
          <div className="absolute inset-0 flex gap-0.5">
            <div
              className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out"
              style={{ width: `${onlinePercentage}%` }}
            />
            <div
              className="rounded-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-700 ease-out"
              style={{ width: `${offlinePercentage}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              <span className="text-sm font-medium text-muted-foreground">Online Booking</span>
            </div>
            <p className="font-display text-xl font-semibold text-foreground tabular-nums">
              {formatNumber(stats?.onlineBookings || 0)}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-end gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/20" />
              <span className="text-sm font-medium text-muted-foreground">Offline Booking</span>
            </div>
            <p className="font-display text-xl font-semibold text-foreground tabular-nums">
              {formatNumber(stats?.offlineBookings || 0)}
            </p>
          </div>
        </div>

        <div className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/50 dark:to-teal-950/50 px-4 py-3 transition-all hover:border-primary/20 hover:shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground/80">
            Unlock in-depth analysis with premium
          </span>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-0 bg-card shadow-sm dark:shadow-none dark:border dark:border-border/50 animate-fade-up animation-delay-400">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-display text-base font-semibold tracking-tight">Bookings</CardTitle>
        <Select defaultValue="monthly">
          <SelectTrigger className="w-32 rounded-xl border-border/50 bg-muted/30 text-sm font-medium transition-colors hover:bg-muted/50">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50">
            <SelectItem value="weekly" className="rounded-lg">Weekly</SelectItem>
            <SelectItem value="monthly" className="rounded-lg">Monthly</SelectItem>
            <SelectItem value="yearly" className="rounded-lg">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  )
}
