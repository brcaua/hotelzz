'use client'

import { useQuery } from '@tanstack/react-query'
import {
  fetchDashboardStats,
  fetchRevenueData,
  fetchActivities,
  fetchSparklineData
} from '@/lib/api'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const result = await fetchDashboardStats()
      if (result.isErr()) {
        throw new Error(result.error.message)
      }
      return result.value
    }
  })
}

export function useRevenueData(period: 'weekly' | 'monthly' = 'weekly') {
  return useQuery({
    queryKey: ['dashboard', 'revenue', period],
    queryFn: async () => {
      const result = await fetchRevenueData(period)
      if (result.isErr()) {
        throw new Error(result.error.message)
      }
      return result.value
    }
  })
}

export function useActivities(count: number = 10) {
  return useQuery({
    queryKey: ['dashboard', 'activities', count],
    queryFn: async () => {
      const result = await fetchActivities(count)
      if (result.isErr()) {
        throw new Error(result.error.message)
      }
      return result.value
    }
  })
}

export function useSparklineData() {
  return useQuery({
    queryKey: ['dashboard', 'sparklines'],
    queryFn: async () => {
      const result = await fetchSparklineData()
      if (result.isErr()) {
        throw new Error(result.error.message)
      }
      return result.value
    }
  })
}
