import { describe, it, expect } from 'vitest'
import {
  calculateNights,
  calculatePrice,
  findGuest,
  findHotel,
  createBookingDetails,
  type BookingFormData,
} from '@/services/booking.service'
import { guests } from '@/data/guests'
import { hotels } from '@/data/hotels'
import type { Hotel } from '@/types'

describe('Booking Service', () => {
  describe('calculateNights', () => {
    it('calculates nights between two dates correctly', () => {
      const checkIn = new Date('2026-01-20')
      const checkOut = new Date('2026-01-25')
      expect(calculateNights(checkIn, checkOut)).toBe(5)
    })

    it('returns 1 for same day checkout', () => {
      const checkIn = new Date('2026-01-20')
      const checkOut = new Date('2026-01-21')
      expect(calculateNights(checkIn, checkOut)).toBe(1)
    })

    it('handles month boundaries', () => {
      const checkIn = new Date('2026-01-30')
      const checkOut = new Date('2026-02-05')
      expect(calculateNights(checkIn, checkOut)).toBe(6)
    })
  })

  describe('calculatePrice', () => {
    const mockHotel: Hotel = {
      id: 'htl_test',
      name: 'Test Hotel',
      location: 'Test City',
      country: 'Test Country',
      rating: 4.5,
      totalRooms: 100,
      availableRooms: 50,
      occupancyRate: 50,
      pricePerNight: 100,
      amenities: ['WiFi'],
      imageUrl: 'https://example.com/image.jpg',
    }

    it('calculates Standard room price correctly', () => {
      const result = calculatePrice(mockHotel, 'Standard', 3)
      expect(result.nights).toBe(3)
      expect(result.roomPrice).toBe(300)
      expect(result.vat).toBe(24)
      expect(result.cityTax).toBe(33)
      expect(result.total).toBe(357)
    })

    it('calculates Deluxe room price with 1.5x multiplier', () => {
      const result = calculatePrice(mockHotel, 'Deluxe', 2)
      expect(result.roomPrice).toBe(300)
      expect(result.total).toBe(357)
    })

    it('calculates Suite room price with 2.5x multiplier', () => {
      const result = calculatePrice(mockHotel, 'Suite', 2)
      expect(result.roomPrice).toBe(500)
      expect(result.total).toBe(595)
    })

    it('calculates Presidential room price with 4x multiplier', () => {
      const result = calculatePrice(mockHotel, 'Presidential', 1)
      expect(result.roomPrice).toBe(400)
      expect(result.total).toBe(476)
    })

    it('rounds prices to 2 decimal places', () => {
      const oddPriceHotel = { ...mockHotel, pricePerNight: 99.99 }
      const result = calculatePrice(oddPriceHotel, 'Standard', 1)
      expect(result.roomPrice.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2)
    })
  })

  describe('findGuest', () => {
    it('returns Ok with guest when found', () => {
      const firstGuest = guests[0]
      const result = findGuest(firstGuest.id)
      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.id).toBe(firstGuest.id)
      }
    })

    it('returns Err when guest not found', () => {
      const result = findGuest('nonexistent_id')
      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.code).toBe('GUEST_NOT_FOUND')
      }
    })
  })

  describe('findHotel', () => {
    it('returns Ok with hotel when found', () => {
      const firstHotel = hotels[0]
      const result = findHotel(firstHotel.id)
      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
        expect(result.value.id).toBe(firstHotel.id)
      }
    })

    it('returns Err when hotel not found', () => {
      const result = findHotel('nonexistent_hotel')
      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.code).toBe('HOTEL_NOT_FOUND')
      }
    })
  })

  describe('createBookingDetails', () => {
    it('returns Err when checkIn is null', () => {
      const formData: BookingFormData = {
        id: 'bkg_test',
        guestId: 'gst_001',
        hotelId: 'htl_001',
        roomNumber: '101',
        roomType: 'Deluxe',
        checkIn: null,
        checkOut: new Date('2026-01-25'),
        guests: 2,
        requests: [],
        notes: '',
        paymentStatus: 'pending',
      }
      
      const result = createBookingDetails(formData)
      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.code).toBe('INVALID_DATES')
      }
    })

    it('returns Err when checkOut is null', () => {
      const formData: BookingFormData = {
        id: 'bkg_test',
        guestId: 'gst_001',
        hotelId: 'htl_001',
        roomNumber: '101',
        roomType: 'Deluxe',
        checkIn: new Date('2026-01-20'),
        checkOut: null,
        guests: 2,
        requests: [],
        notes: '',
        paymentStatus: 'pending',
      }
      
      const result = createBookingDetails(formData)
      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.code).toBe('INVALID_DATES')
      }
    })

    it('returns Err when guest not found', () => {
      const formData: BookingFormData = {
        id: 'bkg_test',
        guestId: 'nonexistent_guest',
        hotelId: 'htl_001',
        roomNumber: '101',
        roomType: 'Deluxe',
        checkIn: new Date('2026-01-20'),
        checkOut: new Date('2026-01-25'),
        guests: 2,
        requests: [],
        notes: '',
        paymentStatus: 'pending',
      }
      
      const result = createBookingDetails(formData)
      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.code).toBe('GUEST_NOT_FOUND')
      }
    })

    it('returns Err when hotel not found', () => {
      const firstGuest = guests[0]
      
      const formData: BookingFormData = {
        id: 'bkg_test',
        guestId: firstGuest.id,
        hotelId: 'nonexistent_hotel',
        roomNumber: '101',
        roomType: 'Deluxe',
        checkIn: new Date('2026-01-20'),
        checkOut: new Date('2026-01-25'),
        guests: 2,
        requests: [],
        notes: '',
        paymentStatus: 'pending',
      }
      
      const result = createBookingDetails(formData)
      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
        expect(result.error.code).toBe('HOTEL_NOT_FOUND')
      }
    })
  })
})
