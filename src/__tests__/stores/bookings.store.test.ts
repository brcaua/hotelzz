import { describe, it, expect, beforeEach } from 'vitest'
import { useBookingsStore } from '@/stores/bookings.store'
import type { BookingDetails, Guest } from '@/types'

const mockGuest: Guest = {
  id: 'gst_001',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1 555 123 456',
  country: 'USA',
  avatarUrl: 'https://example.com/avatar.jpg',
  totalStays: 5,
  vipStatus: true,
}

const createMockBooking = (id: string): BookingDetails => ({
  id,
  hotelId: 'htl_001',
  guestId: 'gst_001',
  guest: mockGuest,
  roomNumber: '101',
  checkIn: new Date('2026-01-20'),
  checkOut: new Date('2026-01-25'),
  status: 'confirmed',
  paymentStatus: 'paid',
  totalAmount: 750,
  isOnline: true,
  createdAt: new Date(),
  roomType: 'Deluxe',
  requests: 'Late checkout',
  notes: 'Test notes',
  loyaltyProgram: 'Gold Member',
  transportation: 'Airport pickup',
  specialAmenities: ['WiFi', 'Breakfast'],
  extras: 'Mini bar',
  priceSummary: {
    roomAndOffer: 700,
    extras: 50,
    vat: 60,
    cityTax: 40,
    total: 850,
  },
  room: {
    imageUrl: 'https://example.com/room.jpg',
    size: 35,
    bedType: 'King',
    maxGuests: 2,
  },
  paymentNotes: 'Payment received',
})

describe('Bookings Store', () => {
  beforeEach(() => {
    useBookingsStore.getState().clearBookings()
  })

  describe('addBooking', () => {
    it('adds a booking to the store', () => {
      const booking = createMockBooking('bkg_001')
      useBookingsStore.getState().addBooking(booking)
      
      const bookings = useBookingsStore.getState().bookings
      expect(bookings).toHaveLength(1)
      expect(bookings[0].id).toBe('bkg_001')
    })

    it('adds new bookings at the beginning', () => {
      const booking1 = createMockBooking('bkg_001')
      const booking2 = createMockBooking('bkg_002')
      
      useBookingsStore.getState().addBooking(booking1)
      useBookingsStore.getState().addBooking(booking2)
      
      const bookings = useBookingsStore.getState().bookings
      expect(bookings[0].id).toBe('bkg_002')
      expect(bookings[1].id).toBe('bkg_001')
    })
  })

  describe('updateBooking', () => {
    it('updates an existing booking', () => {
      const booking = createMockBooking('bkg_001')
      useBookingsStore.getState().addBooking(booking)
      
      useBookingsStore.getState().updateBooking('bkg_001', { status: 'checked-in' })
      
      const bookings = useBookingsStore.getState().bookings
      expect(bookings[0].status).toBe('checked-in')
    })

    it('does not affect other bookings', () => {
      const booking1 = createMockBooking('bkg_001')
      const booking2 = createMockBooking('bkg_002')
      
      useBookingsStore.getState().addBooking(booking1)
      useBookingsStore.getState().addBooking(booking2)
      useBookingsStore.getState().updateBooking('bkg_001', { status: 'cancelled' })
      
      const bookings = useBookingsStore.getState().bookings
      const booking2Updated = bookings.find(b => b.id === 'bkg_002')
      expect(booking2Updated?.status).toBe('confirmed')
    })
  })

  describe('deleteBooking', () => {
    it('removes a booking from the store', () => {
      const booking = createMockBooking('bkg_001')
      useBookingsStore.getState().addBooking(booking)
      
      useBookingsStore.getState().deleteBooking('bkg_001')
      
      const bookings = useBookingsStore.getState().bookings
      expect(bookings).toHaveLength(0)
    })

    it('clears selectedBookingId if deleted booking was selected', () => {
      const booking = createMockBooking('bkg_001')
      useBookingsStore.getState().addBooking(booking)
      useBookingsStore.getState().selectBooking('bkg_001')
      
      useBookingsStore.getState().deleteBooking('bkg_001')
      
      const selectedId = useBookingsStore.getState().selectedBookingId
      expect(selectedId).toBeNull()
    })

    it('does not clear selectedBookingId if different booking deleted', () => {
      const booking1 = createMockBooking('bkg_001')
      const booking2 = createMockBooking('bkg_002')
      
      useBookingsStore.getState().addBooking(booking1)
      useBookingsStore.getState().addBooking(booking2)
      useBookingsStore.getState().selectBooking('bkg_001')
      useBookingsStore.getState().deleteBooking('bkg_002')
      
      const selectedId = useBookingsStore.getState().selectedBookingId
      expect(selectedId).toBe('bkg_001')
    })
  })

  describe('selectBooking', () => {
    it('sets the selected booking ID', () => {
      useBookingsStore.getState().selectBooking('bkg_001')
      
      const selectedId = useBookingsStore.getState().selectedBookingId
      expect(selectedId).toBe('bkg_001')
    })

    it('can set selected to null', () => {
      useBookingsStore.getState().selectBooking('bkg_001')
      useBookingsStore.getState().selectBooking(null)
      
      const selectedId = useBookingsStore.getState().selectedBookingId
      expect(selectedId).toBeNull()
    })
  })

  describe('clearBookings', () => {
    it('removes all bookings', () => {
      useBookingsStore.getState().addBooking(createMockBooking('bkg_001'))
      useBookingsStore.getState().addBooking(createMockBooking('bkg_002'))
      
      useBookingsStore.getState().clearBookings()
      
      const bookings = useBookingsStore.getState().bookings
      expect(bookings).toHaveLength(0)
    })

    it('resets selected booking ID', () => {
      useBookingsStore.getState().selectBooking('bkg_001')
      useBookingsStore.getState().clearBookings()
      
      const selectedId = useBookingsStore.getState().selectedBookingId
      expect(selectedId).toBeNull()
    })
  })
})
