import { describe, it, expect } from 'vitest'
import {
  getDashboardStats,
  getWeeklyRevenue,
  getMonthlyRevenue,
  getBookingsSparkline,
  getRoomsSparkline,
  getCheckInsSparkline,
  getCheckOutsSparkline,
} from '@/data/dashboard'

describe('Dashboard Data', () => {
  describe('getDashboardStats', () => {
    it('returns dashboard statistics', () => {
      const stats = getDashboardStats()
      
      expect(stats).toHaveProperty('newBookings')
      expect(stats).toHaveProperty('availableRooms')
      expect(stats).toHaveProperty('checkIns')
      expect(stats).toHaveProperty('checkOuts')
      expect(stats).toHaveProperty('totalRevenue')
      expect(stats).toHaveProperty('revenueChange')
      expect(stats).toHaveProperty('totalBookings')
      expect(stats).toHaveProperty('onlineBookings')
      expect(stats).toHaveProperty('offlineBookings')
    })

    it('returns numeric values', () => {
      const stats = getDashboardStats()
      
      expect(typeof stats.newBookings).toBe('number')
      expect(typeof stats.availableRooms).toBe('number')
      expect(typeof stats.totalRevenue).toBe('number')
    })
  })

  describe('getWeeklyRevenue', () => {
    it('returns 7 days of revenue data', () => {
      const revenue = getWeeklyRevenue()
      expect(revenue).toHaveLength(7)
    })

    it('each entry has required fields', () => {
      const revenue = getWeeklyRevenue()
      const entry = revenue[0]
      
      expect(entry).toHaveProperty('day')
      expect(entry).toHaveProperty('revenue')
      expect(entry).toHaveProperty('date')
    })

    it('revenue values are positive', () => {
      const revenue = getWeeklyRevenue()
      expect(revenue.every(r => r.revenue >= 0)).toBe(true)
    })
  })

  describe('getMonthlyRevenue', () => {
    it('returns monthly revenue data', () => {
      const revenue = getMonthlyRevenue()
      expect(revenue.length).toBeGreaterThan(0)
      expect(revenue.length).toBeLessThanOrEqual(12)
    })

    it('each entry has required fields', () => {
      const revenue = getMonthlyRevenue()
      const entry = revenue[0]
      
      expect(entry).toHaveProperty('day')
      expect(entry).toHaveProperty('revenue')
      expect(entry).toHaveProperty('date')
    })
  })

  describe('Sparkline Data', () => {
    it('getBookingsSparkline returns 7 data points', () => {
      const data = getBookingsSparkline()
      expect(data).toHaveLength(7)
      expect(data.every(d => typeof d === 'number')).toBe(true)
    })

    it('getRoomsSparkline returns 7 data points', () => {
      const data = getRoomsSparkline()
      expect(data).toHaveLength(7)
      expect(data.every(d => typeof d === 'number')).toBe(true)
    })

    it('getCheckInsSparkline returns 7 data points', () => {
      const data = getCheckInsSparkline()
      expect(data).toHaveLength(7)
      expect(data.every(d => typeof d === 'number')).toBe(true)
    })

    it('getCheckOutsSparkline returns 7 data points', () => {
      const data = getCheckOutsSparkline()
      expect(data).toHaveLength(7)
      expect(data.every(d => typeof d === 'number')).toBe(true)
    })
  })
})
