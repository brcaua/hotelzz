import { describe, it, expect } from 'vitest'
import {
  getBookingStatusConfig,
  getPaymentStatusConfig,
  getRoomStatusConfig,
  getErrorMessage,
  getActivityConfig,
  formatTimeAgo,
  formatCurrency,
  formatNumber,
} from '@/lib/patterns'

describe('Patterns', () => {
  describe('getBookingStatusConfig', () => {
    it('returns correct config for confirmed', () => {
      const config = getBookingStatusConfig('confirmed')
      expect(config.label).toBe('Confirmed')
      expect(config.variant).toBe('success')
      expect(config.color).toContain('emerald')
    })

    it('returns correct config for pending', () => {
      const config = getBookingStatusConfig('pending')
      expect(config.label).toBe('Pending')
      expect(config.variant).toBe('warning')
      expect(config.color).toContain('amber')
    })

    it('returns correct config for cancelled', () => {
      const config = getBookingStatusConfig('cancelled')
      expect(config.label).toBe('Cancelled')
      expect(config.variant).toBe('destructive')
      expect(config.color).toContain('red')
    })

    it('returns correct config for checked-in', () => {
      const config = getBookingStatusConfig('checked-in')
      expect(config.label).toBe('Checked In')
      expect(config.variant).toBe('default')
      expect(config.color).toContain('blue')
    })

    it('returns correct config for checked-out', () => {
      const config = getBookingStatusConfig('checked-out')
      expect(config.label).toBe('Checked Out')
      expect(config.variant).toBe('secondary')
      expect(config.color).toContain('slate')
    })
  })

  describe('getPaymentStatusConfig', () => {
    it('returns correct config for paid', () => {
      const config = getPaymentStatusConfig('paid')
      expect(config.label).toBe('Paid')
      expect(config.color).toContain('emerald')
    })

    it('returns correct config for pending', () => {
      const config = getPaymentStatusConfig('pending')
      expect(config.label).toBe('Pending')
      expect(config.color).toContain('amber')
    })

    it('returns correct config for refunded', () => {
      const config = getPaymentStatusConfig('refunded')
      expect(config.label).toBe('Refunded')
      expect(config.color).toContain('purple')
    })

    it('returns correct config for failed', () => {
      const config = getPaymentStatusConfig('failed')
      expect(config.label).toBe('Failed')
      expect(config.color).toContain('red')
    })
  })

  describe('getRoomStatusConfig', () => {
    it('returns correct config for available', () => {
      const config = getRoomStatusConfig('available')
      expect(config.label).toBe('Available')
      expect(config.color).toContain('emerald')
    })

    it('returns correct config for occupied', () => {
      const config = getRoomStatusConfig('occupied')
      expect(config.label).toBe('Occupied')
      expect(config.color).toContain('blue')
    })

    it('returns correct config for maintenance', () => {
      const config = getRoomStatusConfig('maintenance')
      expect(config.label).toBe('Maintenance')
      expect(config.color).toContain('amber')
    })

    it('returns correct config for reserved', () => {
      const config = getRoomStatusConfig('reserved')
      expect(config.label).toBe('Reserved')
      expect(config.color).toContain('purple')
    })
  })

  describe('getErrorMessage', () => {
    it('returns correct message for NOT_FOUND', () => {
      const message = getErrorMessage({ code: 'NOT_FOUND', message: 'Item not found' })
      expect(message).toBe('Item not found')
    })

    it('returns default message for NOT_FOUND without message', () => {
      const message = getErrorMessage({ code: 'NOT_FOUND', message: '' })
      expect(message).toBe('Resource not found')
    })

    it('returns correct message for UNAUTHORIZED', () => {
      const message = getErrorMessage({ code: 'UNAUTHORIZED', message: '' })
      expect(message).toContain('not authorized')
    })

    it('returns correct message for SERVER_ERROR', () => {
      const message = getErrorMessage({ code: 'SERVER_ERROR', message: '' })
      expect(message).toContain('unexpected error')
    })

    it('returns correct message for VALIDATION_ERROR', () => {
      const message = getErrorMessage({ code: 'VALIDATION_ERROR', message: 'Invalid email' })
      expect(message).toBe('Invalid email')
    })

    it('returns correct message for NETWORK_ERROR', () => {
      const message = getErrorMessage({ code: 'NETWORK_ERROR', message: '' })
      expect(message).toContain('Network error')
    })
  })

  describe('getActivityConfig', () => {
    it('returns correct config for request', () => {
      const config = getActivityConfig('request')
      expect(config.icon).toBe('message-square')
      expect(config.color).toContain('blue')
    })

    it('returns correct config for booking', () => {
      const config = getActivityConfig('booking')
      expect(config.icon).toBe('calendar-plus')
      expect(config.color).toContain('emerald')
    })

    it('returns correct config for checkout', () => {
      const config = getActivityConfig('checkout')
      expect(config.icon).toBe('log-out')
      expect(config.color).toContain('amber')
    })

    it('returns correct config for checkin', () => {
      const config = getActivityConfig('checkin')
      expect(config.icon).toBe('log-in')
      expect(config.color).toContain('purple')
    })

    it('returns correct config for payment', () => {
      const config = getActivityConfig('payment')
      expect(config.icon).toBe('credit-card')
      expect(config.color).toContain('emerald')
    })
  })

  describe('formatTimeAgo', () => {
    it('returns "Just now" for very recent times', () => {
      const now = new Date()
      const result = formatTimeAgo(now)
      expect(result).toBe('Just now')
    })

    it('returns minutes for recent times', () => {
      const date = new Date(Date.now() - 30 * 60 * 1000)
      const result = formatTimeAgo(date)
      expect(result).toContain('mins')
    })

    it('returns hours for times within a day', () => {
      const date = new Date(Date.now() - 5 * 60 * 60 * 1000)
      const result = formatTimeAgo(date)
      expect(result).toContain('hours')
    })

    it('returns days for times within a week', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      const result = formatTimeAgo(date)
      expect(result).toContain('days')
    })
  })

  describe('formatCurrency', () => {
    it('formats number as EUR by default', () => {
      const result = formatCurrency(1234.56)
      expect(result).toContain('€')
    })

    it('formats with specified currency', () => {
      const result = formatCurrency(1234.56, 'USD')
      expect(result).toContain('$')
    })
  })

  describe('formatNumber', () => {
    it('formats millions with M suffix', () => {
      const result = formatNumber(1500000)
      expect(result).toBe('1.5M')
    })

    it('formats thousands with K suffix', () => {
      const result = formatNumber(1500)
      expect(result).toBe('1.5K')
    })

    it('formats small numbers normally', () => {
      const result = formatNumber(500)
      expect(result).toBe('500')
    })
  })
})
