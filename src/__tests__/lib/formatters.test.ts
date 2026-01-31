import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatDateLong,
  formatCurrencyUSD,
  formatCurrencyEUR,
  formatPhoneNumber,
  formatTime,
  formatBookingId,
} from '@/lib/formatters'

describe('Formatters', () => {
  describe('formatDate', () => {
    it('formats date in short format', () => {
      const date = new Date('2026-01-20')
      const result = formatDate(date)
      expect(result).toContain('Jan')
      expect(result).toContain('20')
      expect(result).toContain('2026')
    })

    it('handles different months', () => {
      const date = new Date('2026-12-25')
      const result = formatDate(date)
      expect(result).toContain('Dec')
      expect(result).toContain('25')
    })
  })

  describe('formatDateLong', () => {
    it('formats date with weekday', () => {
      const date = new Date('2026-01-20')
      const result = formatDateLong(date)
      expect(result).toContain('2026')
      expect(result).toContain('January')
    })
  })

  describe('formatCurrencyUSD', () => {
    it('formats number as USD currency', () => {
      const result = formatCurrencyUSD(1234.56)
      expect(result).toContain('$')
      expect(result).toContain('1,234.56')
    })

    it('handles zero', () => {
      const result = formatCurrencyUSD(0)
      expect(result).toContain('$')
      expect(result).toContain('0.00')
    })

    it('handles large numbers', () => {
      const result = formatCurrencyUSD(1000000)
      expect(result).toContain('$')
      expect(result).toContain('1,000,000')
    })
  })

  describe('formatCurrencyEUR', () => {
    it('formats number as EUR currency', () => {
      const result = formatCurrencyEUR(1234.56)
      expect(result).toContain('€')
      expect(result).toContain('1,234.56')
    })
  })

  describe('formatPhoneNumber', () => {
    it('formats 10 digit phone number', () => {
      const result = formatPhoneNumber('1234567890')
      expect(result).toBe('(123) 456-7890')
    })

    it('returns original if not 10 digits', () => {
      const result = formatPhoneNumber('+1 555 123 456')
      expect(result).toBe('+1 555 123 456')
    })
  })

  describe('formatTime', () => {
    it('formats time in 12-hour format', () => {
      const date = new Date('2026-01-20T14:30:00')
      const result = formatTime(date)
      expect(result).toContain('2:30')
      expect(result).toContain('PM')
    })

    it('handles AM times', () => {
      const date = new Date('2026-01-20T09:15:00')
      const result = formatTime(date)
      expect(result).toContain('9:15')
      expect(result).toContain('AM')
    })
  })

  describe('formatBookingId', () => {
    it('formats booking ID with LG prefix', () => {
      const result = formatBookingId('bkg_abc123def')
      expect(result).toBe('LG-ABC123')
    })

    it('handles short IDs', () => {
      const result = formatBookingId('bkg_ab')
      expect(result).toBe('LG-AB')
    })

    it('handles IDs without prefix', () => {
      const result = formatBookingId('abc123456789')
      expect(result).toBe('LG-ABC123')
    })
  })
})
