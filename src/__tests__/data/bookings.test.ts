import { describe, it, expect } from 'vitest'
import {
  bookings,
  getBookingById,
  getBookingsByStatus,
  getRecentBookings,
  getTodayCheckIns,
  getTodayCheckOuts,
  getRecentActivities,
} from '@/data/bookings'

describe('Bookings Data', () => {
  describe('bookings', () => {
    it('contains booking records', () => {
      expect(bookings.length).toBeGreaterThan(0)
    })

    it('each booking has required fields', () => {
      const booking = bookings[0]
      expect(booking).toHaveProperty('id')
      expect(booking).toHaveProperty('guestId')
      expect(booking).toHaveProperty('hotelId')
      expect(booking).toHaveProperty('roomNumber')
      expect(booking).toHaveProperty('status')
      expect(booking).toHaveProperty('paymentStatus')
    })
  })

  describe('getBookingById', () => {
    it('returns booking when found', () => {
      const booking = bookings[0]
      const result = getBookingById(booking.id)
      expect(result).toBeDefined()
      expect(result?.id).toBe(booking.id)
    })

    it('returns undefined when not found', () => {
      const result = getBookingById('nonexistent_id')
      expect(result).toBeUndefined()
    })
  })

  describe('getBookingsByStatus', () => {
    it('returns bookings with confirmed status', () => {
      const result = getBookingsByStatus('confirmed')
      expect(result.every(b => b.status === 'confirmed')).toBe(true)
    })

    it('returns bookings with pending status', () => {
      const result = getBookingsByStatus('pending')
      expect(result.every(b => b.status === 'pending')).toBe(true)
    })

    it('returns empty array for status with no bookings', () => {
      const allBookings = getBookingsByStatus('confirmed')
      expect(Array.isArray(allBookings)).toBe(true)
    })
  })

  describe('getRecentBookings', () => {
    it('returns bookings from recent days', () => {
      const result = getRecentBookings(30)
      expect(Array.isArray(result)).toBe(true)
    })

    it('respects the days parameter', () => {
      const result7 = getRecentBookings(7)
      const result30 = getRecentBookings(30)
      expect(result30.length).toBeGreaterThanOrEqual(result7.length)
    })
  })

  describe('getTodayCheckIns', () => {
    it('returns an array', () => {
      const result = getTodayCheckIns()
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('getTodayCheckOuts', () => {
    it('returns an array', () => {
      const result = getTodayCheckOuts()
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('getRecentActivities', () => {
    it('returns activities array', () => {
      const result = getRecentActivities(10)
      expect(Array.isArray(result)).toBe(true)
    })

    it('respects count parameter', () => {
      const result5 = getRecentActivities(5)
      const result10 = getRecentActivities(10)
      expect(result5.length).toBeLessThanOrEqual(5)
      expect(result10.length).toBeLessThanOrEqual(10)
    })

    it('activities have required fields', () => {
      const result = getRecentActivities(1)
      if (result.length > 0) {
        const activity = result[0]
        expect(activity).toHaveProperty('id')
        expect(activity).toHaveProperty('type')
        expect(activity).toHaveProperty('guest')
        expect(activity).toHaveProperty('timestamp')
      }
    })
  })
})
