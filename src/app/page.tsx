'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const StatsGrid = dynamic(
  () => import('@/components/dashboard/stats-grid').then(mod => ({ default: mod.StatsGrid })),
  { loading: () => <StatsGridSkeleton />, ssr: false }
)

const RevenueChart = dynamic(
  () => import('@/components/dashboard/revenue-chart').then(mod => ({ default: mod.RevenueChart })),
  { loading: () => <ChartSkeleton />, ssr: false }
)

const BookingsBreakdown = dynamic(
  () => import('@/components/dashboard/bookings-breakdown').then(mod => ({ default: mod.BookingsBreakdown })),
  { loading: () => <BreakdownSkeleton />, ssr: false }
)

const RecentActivities = dynamic(
  () => import('@/components/dashboard/recent-activities').then(mod => ({ default: mod.RecentActivities })),
  { loading: () => <ActivitiesSkeleton />, ssr: false }
)

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-6 animate-fade-up animation-delay-100">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <Card className="col-span-2 animate-fade-up animation-delay-200">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  )
}

function BreakdownSkeleton() {
  return (
    <Card className="animate-fade-up animation-delay-300">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-40 w-40 rounded-full mx-auto" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivitiesSkeleton() {
  return (
    <Card className="animate-fade-up animation-delay-400">
      <CardHeader>
        <Skeleton className="h-6 w-36" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

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

      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsGrid />
      </Suspense>

      <div className="grid grid-cols-3 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<BreakdownSkeleton />}>
          <BookingsBreakdown />
        </Suspense>
      </div>

      <Suspense fallback={<ActivitiesSkeleton />}>
        <RecentActivities />
      </Suspense>
    </div>
  )
}
