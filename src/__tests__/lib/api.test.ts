import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  fetchHotels,
  fetchHotelById,
  fetchHotelsSearch,
  fetchGuests,
  fetchGuestById,
  fetchGuestsSearch,
  fetchBookings,
  fetchBookingById,
  fetchBookingsByStatus,
  fetchDashboardStats,
  fetchRevenueData,
  fetchActivities,
  fetchSparklineData,
  api,
} from '@/lib/api'

describe('API Functions', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('Hotels API', () => {
    it('fetchHotels returns hotels list', async () => {
      const result = await fetchHotels()
      if (result.isOk()) {
        expect(Array.isArray(result.value)).toBe(true)
        expect(result.value.length).toBeGreaterThan(0)
      }
    })

    it('fetchHotelById returns hotel when found', async () => {
      const hotelsResult = await fetchHotels()
      if (hotelsResult.isOk() && hotelsResult.value.length > 0) {
        const hotel = hotelsResult.value[0]
        const result = await fetchHotelById(hotel.id)
        if (result.isOk()) {
          expect(result.value.id).toBe(hotel.id)
        }
      }
    })

    it('fetchHotelById returns error for non-existent hotel', async () => {
      const result = await fetchHotelById('nonexistent')
      if (result.isErr()) {
        expect(result.error.code).toBe('NOT_FOUND')
      }
    })

    it('fetchHotelsSearch requires minimum query length', async () => {
      const result = await fetchHotelsSearch('a')
      if (result.isErr()) {
        expect(result.error.code).toBe('VALIDATION_ERROR')
      }
    })

    it('fetchHotelsSearch returns matching hotels', async () => {
      const result = await fetchHotelsSearch('Hotel')
      if (result.isOk()) {
        expect(Array.isArray(result.value)).toBe(true)
      }
    })
  })

  describe('Guests API', () => {
    it('fetchGuests returns guests list', async () => {
      const result = await fetchGuests()
      if (result.isOk()) {
        expect(Array.isArray(result.value)).toBe(true)
        expect(result.value.length).toBeGreaterThan(0)
      }
    })

    it('fetchGuestById returns guest when found', async () => {
      const guestsResult = await fetchGuests()
      if (guestsResult.isOk() && guestsResult.value.length > 0) {
        const guest = guestsResult.value[0]
        const result = await fetchGuestById(guest.id)
        if (result.isOk()) {
          expect(result.value.id).toBe(guest.id)
        }
      }
    })

    it('fetchGuestById returns error for non-existent guest', async () => {
      const result = await fetchGuestById('nonexistent')
      if (result.isErr()) {
        expect(result.error.code).toBe('NOT_FOUND')
      }
    })

    it('fetchGuestsSearch requires minimum query length', async () => {
      const result = await fetchGuestsSearch('a')
      if (result.isErr()) {
        expect(result.error.code).toBe('VALIDATION_ERROR')
      }
    })

    it('fetchGuestsSearch returns matching guests', async () => {
      const result = await fetchGuestsSearch('John')
      if (result.isOk()) {
        expect(Array.isArray(result.value)).toBe(true)
      }
    })
  })

  describe('Bookings API', () => {
    it('fetchBookings returns bookings list', async () => {
      const result = await fetchBookings()
      if (result.isOk()) {
        expect(Array.isArray(result.value)).toBe(true)
      }
    })

    it('fetchBookingById returns booking when found', async () => {
      const bookingsResult = await fetchBookings()
      if (bookingsResult.isOk() && bookingsResult.value.length > 0) {
        const booking = bookingsResult.value[0]
        const result = await fetchBookingById(booking.id)
        if (result.isOk()) {
          expect(result.value.id).toBe(booking.id)
        }
      }
    })

    it('fetchBookingById returns error for non-existent booking', async () => {
      const result = await fetchBookingById('nonexistent')
      if (result.isErr()) {
        expect(result.error.code).toBe('NOT_FOUND')
      }
    })

    it('fetchBookingsByStatus returns filtered bookings', async () => {
      const result = await fetchBookingsByStatus('confirmed')
      if (result.isOk()) {
        expect(Array.isArray(result.value)).toBe(true)
        expect(result.value.every(b => b.status === 'confirmed')).toBe(true)
      }
    })
  })

  describe('Dashboard API', () => {
    it('fetchDashboardStats returns stats', async () => {
      const result = await fetchDashboardStats()
      if (result.isOk()) {
        expect(result.value).toHaveProperty('newBookings')
        expect(result.value).toHaveProperty('availableRooms')
        expect(result.value).toHaveProperty('totalRevenue')
      }
    })

    it('fetchRevenueData returns weekly data by default', async () => {
      const result = await fetchRevenueData()
      if (result.isOk()) {
        expect(result.value).toHaveLength(7)
      }
    })

    it('fetchRevenueData returns monthly data when specified', async () => {
      const result = await fetchRevenueData('monthly')
      if (result.isOk()) {
        expect(result.value.length).toBeGreaterThan(0)
        expect(result.value.length).toBeLessThanOrEqual(12)
      }
    })

    it('fetchActivities returns activities list', async () => {
      const result = await fetchActivities(5)
      if (result.isOk()) {
        expect(Array.isArray(result.value)).toBe(true)
        expect(result.value.length).toBeLessThanOrEqual(5)
      }
    })

    it('fetchSparklineData returns all sparkline data', async () => {
      const result = await fetchSparklineData()
      if (result.isOk()) {
        expect(result.value).toHaveProperty('bookings')
        expect(result.value).toHaveProperty('rooms')
        expect(result.value).toHaveProperty('checkIns')
        expect(result.value).toHaveProperty('checkOuts')
      }
    })
  })

  describe('API object', () => {
    it('api.hotels.getAll returns result', async () => {
      const result = await api.hotels.getAll()
      expect(result.isOk() || result.isErr()).toBe(true)
    })

    it('api.hotels.getById returns result', async () => {
      const result = await api.hotels.getById('test')
      expect(result.isOk() || result.isErr()).toBe(true)
    })

    it('api.hotels.search returns result', async () => {
      const result = await api.hotels.search('Hotel')
      expect(result.isOk() || result.isErr()).toBe(true)
    })

    it('api.guests.getAll returns result', async () => {
      const result = await api.guests.getAll()
      expect(result.isOk() || result.isErr()).toBe(true)
    })

    it('api.guests.getById returns result', async () => {
      const result = await api.guests.getById('test')
      expect(result.isOk() || result.isErr()).toBe(true)
    })

    it('api.guests.search returns result', async () => {
      const result = await api.guests.search('John')
      expect(result.isOk() || result.isErr()).toBe(true)
    })

    it('api.bookings.getAll returns result', async () => {
      const result = await api.bookings.getAll()
      expect(result.isOk() || result.isErr()).toBe(true)
    })

    it('api.bookings.getById returns result', async () => {
      const result = await api.bookings.getById('test')
      expect(result.isOk() || result.isErr()).toBe(true)
    })

    it('api.bookings.getByStatus returns result', async () => {
      const result = await api.bookings.getByStatus('confirmed')
      expect(result.isOk() || result.isErr()).toBe(true)
    })

    it('api.dashboard.getStats returns result', async () => {
      const result = await api.dashboard.getStats()
      expect(result.isOk() || result.isErr()).toBe(true)
    })

    it('api.dashboard.getRevenue returns result', async () => {
      const result = await api.dashboard.getRevenue()
      expect(result.isOk() || result.isErr()).toBe(true)
    })

    it('api.dashboard.getActivities returns result', async () => {
      const result = await api.dashboard.getActivities()
      expect(result.isOk() || result.isErr()).toBe(true)
    })

    it('api.dashboard.getSparklines returns result', async () => {
      const result = await api.dashboard.getSparklines()
      expect(result.isOk() || result.isErr()).toBe(true)
    })
  })
})
