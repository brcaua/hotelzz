import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import {
  useAllBookings,
  useBookingById,
  useBookingsByGuestId,
  useBookingActions,
  useBookingsCount,
  useNewBookingsCount,
} from '@/hooks/use-bookings'
import { useBookingsStore } from '@/stores'
import { bookingDetails } from '@/data/guest-profiles'
import type { BookingDetails, Guest } from '@/types'

const mockGuest: Guest = {
  id: 'gst_test',
  name: 'Test Guest',
  email: 'test@example.com',
  phone: '+1 555 000 000',
  country: 'USA',
  avatarUrl: 'https://example.com/avatar.jpg',
  totalStays: 1,
  vipStatus: false,
}

const createMockBooking = (id: string, guestId: string = 'gst_test'): BookingDetails => ({
  id,
  hotelId: 'htl_001',
  guestId,
  guest: { ...mockGuest, id: guestId },
  roomNumber: '101',
  checkIn: new Date('2026-01-20'),
  checkOut: new Date('2026-01-25'),
  status: 'confirmed',
  paymentStatus: 'paid',
  totalAmount: 750,
  isOnline: true,
  createdAt: new Date(),
  roomType: 'Deluxe',
  requests: 'None',
  notes: 'Test',
  loyaltyProgram: 'Standard',
  transportation: 'Self',
  specialAmenities: ['WiFi'],
  extras: '-',
  priceSummary: { roomAndOffer: 700, extras: 0, vat: 56, cityTax: 44, total: 800 },
  room: { imageUrl: '', size: 30, bedType: 'King', maxGuests: 2 },
  paymentNotes: 'Paid',
})

describe('use-bookings hooks', () => {
  beforeEach(() => {
    useBookingsStore.getState().clearBookings()
  })

  describe('useAllBookings', () => {
    it('returns combined bookings from store and data', () => {
      const { result } = renderHook(() => useAllBookings())
      expect(result.current.length).toBe(bookingDetails.length)
    })

    it('includes new bookings from store', () => {
      const newBooking = createMockBooking('bkg_new_001')
      useBookingsStore.getState().addBooking(newBooking)

      const { result } = renderHook(() => useAllBookings())
      expect(result.current.length).toBe(bookingDetails.length + 1)
      expect(result.current[0].id).toBe('bkg_new_001')
    })
  })

  describe('useBookingById', () => {
    it('finds booking by id from store', () => {
      const newBooking = createMockBooking('bkg_find_001')
      useBookingsStore.getState().addBooking(newBooking)

      const { result } = renderHook(() => useBookingById('bkg_find_001'))
      expect(result.current).toBeDefined()
      expect(result.current?.id).toBe('bkg_find_001')
    })

    it('finds booking by id from static data', () => {
      const existingBooking = bookingDetails[0]
      const { result } = renderHook(() => useBookingById(existingBooking.id))
      expect(result.current).toBeDefined()
      expect(result.current?.id).toBe(existingBooking.id)
    })

    it('returns undefined for non-existent booking', () => {
      const { result } = renderHook(() => useBookingById('nonexistent'))
      expect(result.current).toBeUndefined()
    })
  })

  describe('useBookingsByGuestId', () => {
    it('returns bookings for specific guest', () => {
      const booking1 = createMockBooking('bkg_g1', 'gst_specific')
      const booking2 = createMockBooking('bkg_g2', 'gst_specific')
      const booking3 = createMockBooking('bkg_g3', 'gst_other')
      
      useBookingsStore.getState().addBooking(booking1)
      useBookingsStore.getState().addBooking(booking2)
      useBookingsStore.getState().addBooking(booking3)

      const { result } = renderHook(() => useBookingsByGuestId('gst_specific'))
      const storeBookings = result.current.filter(b => b.guestId === 'gst_specific')
      expect(storeBookings.length).toBe(2)
    })
  })

  describe('useBookingActions', () => {
    it('returns action functions', () => {
      const { result } = renderHook(() => useBookingActions())
      
      expect(typeof result.current.addBooking).toBe('function')
      expect(typeof result.current.updateBooking).toBe('function')
      expect(typeof result.current.deleteBooking).toBe('function')
      expect(typeof result.current.selectBooking).toBe('function')
      expect(typeof result.current.clearBookings).toBe('function')
    })
  })

  describe('useBookingsCount', () => {
    it('returns total count of all bookings', () => {
      const { result } = renderHook(() => useBookingsCount())
      expect(result.current).toBe(bookingDetails.length)
    })

    it('includes new bookings in count', () => {
      useBookingsStore.getState().addBooking(createMockBooking('bkg_count_1'))
      
      const { result } = renderHook(() => useBookingsCount())
      expect(result.current).toBe(bookingDetails.length + 1)
    })
  })

  describe('useNewBookingsCount', () => {
    it('returns count of new bookings only', () => {
      const { result: result1 } = renderHook(() => useNewBookingsCount())
      expect(result1.current).toBe(0)

      useBookingsStore.getState().addBooking(createMockBooking('bkg_new_1'))
      useBookingsStore.getState().addBooking(createMockBooking('bkg_new_2'))

      const { result: result2 } = renderHook(() => useNewBookingsCount())
      expect(result2.current).toBe(2)
    })
  })
})
