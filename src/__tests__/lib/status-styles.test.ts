import { describe, it, expect } from 'vitest'
import { getStatusColor, getPaymentStatusColor } from '@/lib/status-styles'

describe('Status Styles', () => {
  describe('getStatusColor', () => {
    it('returns correct color for confirmed status', () => {
      const result = getStatusColor('confirmed')
      expect(result).toContain('emerald')
    })

    it('returns correct color for pending status', () => {
      const result = getStatusColor('pending')
      expect(result).toContain('amber')
    })

    it('returns correct color for cancelled status', () => {
      const result = getStatusColor('cancelled')
      expect(result).toContain('red')
    })

    it('returns correct color for checked-in status', () => {
      const result = getStatusColor('checked-in')
      expect(result).toContain('blue')
    })

    it('returns correct color for checked-out status', () => {
      const result = getStatusColor('checked-out')
      expect(result).toContain('slate')
    })

    it('returns default color for unknown status', () => {
      const result = getStatusColor('unknown')
      expect(result).toContain('slate')
    })
  })

  describe('getPaymentStatusColor', () => {
    it('returns correct color for paid status', () => {
      const result = getPaymentStatusColor('paid')
      expect(result).toContain('lime')
    })

    it('returns correct color for pending status', () => {
      const result = getPaymentStatusColor('pending')
      expect(result).toContain('amber')
    })

    it('returns correct color for refunded status', () => {
      const result = getPaymentStatusColor('refunded')
      expect(result).toContain('slate')
    })

    it('returns correct color for failed status', () => {
      const result = getPaymentStatusColor('failed')
      expect(result).toContain('red')
    })

    it('returns default color for unknown status', () => {
      const result = getPaymentStatusColor('unknown')
      expect(result).toContain('slate')
    })
  })
})
