import { describe, it, expect } from 'vitest'
import {
  guestProfiles,
  bookingDetails,
  getGuestProfileById,
  getBookingDetailsById,
  getBookingsByGuestId,
  getLatestBookingForGuest,
} from '@/data/guest-profiles'

describe('Guest Profiles Data', () => {
  describe('guestProfiles', () => {
    it('contains guest profile records', () => {
      expect(guestProfiles.length).toBeGreaterThan(0)
    })

    it('each profile has extended guest fields', () => {
      const profile = guestProfiles[0]
      
      expect(profile).toHaveProperty('id')
      expect(profile).toHaveProperty('name')
      expect(profile).toHaveProperty('email')
      expect(profile).toHaveProperty('dateOfBirth')
      expect(profile).toHaveProperty('gender')
      expect(profile).toHaveProperty('nationality')
      expect(profile).toHaveProperty('passportNumber')
      expect(profile).toHaveProperty('loyaltyProgram')
    })
  })

  describe('bookingDetails', () => {
    it('contains booking details records', () => {
      expect(bookingDetails.length).toBeGreaterThan(0)
    })

    it('each booking has extended fields', () => {
      const booking = bookingDetails[0]
      
      expect(booking).toHaveProperty('roomType')
      expect(booking).toHaveProperty('priceSummary')
      expect(booking).toHaveProperty('room')
      expect(booking.priceSummary).toHaveProperty('total')
      expect(booking.room).toHaveProperty('bedType')
    })
  })

  describe('getGuestProfileById', () => {
    it('returns profile when found', () => {
      const profile = guestProfiles[0]
      const result = getGuestProfileById(profile.id)
      
      expect(result).toBeDefined()
      expect(result?.id).toBe(profile.id)
    })

    it('returns undefined when not found', () => {
      const result = getGuestProfileById('nonexistent_id')
      expect(result).toBeUndefined()
    })
  })

  describe('getBookingDetailsById', () => {
    it('returns booking when found', () => {
      const booking = bookingDetails[0]
      const result = getBookingDetailsById(booking.id)
      
      expect(result).toBeDefined()
      expect(result?.id).toBe(booking.id)
    })

    it('returns undefined when not found', () => {
      const result = getBookingDetailsById('nonexistent_id')
      expect(result).toBeUndefined()
    })
  })

  describe('getBookingsByGuestId', () => {
    it('returns bookings for a guest', () => {
      const guestId = bookingDetails[0].guestId
      const result = getBookingsByGuestId(guestId)
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.every(b => b.guestId === guestId)).toBe(true)
    })

    it('returns empty array for guest with no bookings', () => {
      const result = getBookingsByGuestId('nonexistent_guest')
      expect(result).toEqual([])
    })
  })

  describe('getLatestBookingForGuest', () => {
    it('returns latest booking for guest with bookings', () => {
      const guestId = bookingDetails[0].guestId
      const result = getLatestBookingForGuest(guestId)
      
      if (result) {
        expect(result.guestId).toBe(guestId)
      }
    })

    it('returns undefined for guest with no bookings', () => {
      const result = getLatestBookingForGuest('nonexistent_guest')
      expect(result).toBeUndefined()
    })
  })
})
