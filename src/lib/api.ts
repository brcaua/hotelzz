import {
  bookings,
  getBookingById,
  getBookingsByStatus,
  getRecentActivities
} from '@/data/bookings'
import {
  getBookingsSparkline,
  getCheckInsSparkline,
  getCheckOutsSparkline,
  getDashboardStats,
  getMonthlyRevenue,
  getRoomsSparkline,
  getWeeklyRevenue
} from '@/data/dashboard'
import { getGuestById, guests, searchGuests } from '@/data/guests'
import { getHotelById, hotels, searchHotels } from '@/data/hotels'
import type {
  Activity,
  ApiError,
  Booking,
  DashboardStats,
  Guest,
  Hotel,
  RevenueData
} from '@/types'
import { err, ok, Result, ResultAsync } from 'neverthrow'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const maybeFailure = (): ApiError | null => {
  if (Math.random() < 0.05) {
    return { code: 'SERVER_ERROR', message: 'Internal server error' }
  }
  return null
}

export async function fetchHotels(): Promise<Result<Hotel[], ApiError>> {
  await delay(300)
  const failure = maybeFailure()
  if (failure) return err(failure)
  return ok(hotels)
}

export async function fetchHotelById(id: string): Promise<Result<Hotel, ApiError>> {
  await delay(200)
  const failure = maybeFailure()
  if (failure) return err(failure)

  const hotel = getHotelById(id)
  if (!hotel) {
    return err({ code: 'NOT_FOUND', message: `Hotel with id ${id} not found` })
  }
  return ok(hotel)
}

export async function fetchHotelsSearch(query: string): Promise<Result<Hotel[], ApiError>> {
  await delay(200)
  const failure = maybeFailure()
  if (failure) return err(failure)

  if (!query || query.length < 2) {
    return err({ code: 'VALIDATION_ERROR', message: 'Search query must be at least 2 characters' })
  }
  return ok(searchHotels(query))
}

export async function fetchGuests(): Promise<Result<Guest[], ApiError>> {
  await delay(300)
  const failure = maybeFailure()
  if (failure) return err(failure)
  return ok(guests)
}

export async function fetchGuestById(id: string): Promise<Result<Guest, ApiError>> {
  await delay(200)
  const failure = maybeFailure()
  if (failure) return err(failure)

  const guest = getGuestById(id)
  if (!guest) {
    return err({ code: 'NOT_FOUND', message: `Guest with id ${id} not found` })
  }
  return ok(guest)
}

export async function fetchGuestsSearch(query: string): Promise<Result<Guest[], ApiError>> {
  await delay(200)
  const failure = maybeFailure()
  if (failure) return err(failure)

  if (!query || query.length < 2) {
    return err({ code: 'VALIDATION_ERROR', message: 'Search query must be at least 2 characters' })
  }
  return ok(searchGuests(query))
}

export async function fetchBookings(): Promise<Result<Booking[], ApiError>> {
  await delay(300)
  const failure = maybeFailure()
  if (failure) return err(failure)
  return ok(bookings)
}

export async function fetchBookingById(id: string): Promise<Result<Booking, ApiError>> {
  await delay(200)
  const failure = maybeFailure()
  if (failure) return err(failure)

  const booking = getBookingById(id)
  if (!booking) {
    return err({ code: 'NOT_FOUND', message: `Booking with id ${id} not found` })
  }
  return ok(booking)
}

export async function fetchBookingsByStatus(
  status: Booking['status']
): Promise<Result<Booking[], ApiError>> {
  await delay(200)
  const failure = maybeFailure()
  if (failure) return err(failure)
  return ok(getBookingsByStatus(status))
}

export async function fetchDashboardStats(): Promise<Result<DashboardStats, ApiError>> {
  await delay(250)
  const failure = maybeFailure()
  if (failure) return err(failure)
  return ok(getDashboardStats())
}

export async function fetchRevenueData(
  period: 'weekly' | 'monthly' = 'weekly'
): Promise<Result<RevenueData[], ApiError>> {
  await delay(200)
  const failure = maybeFailure()
  if (failure) return err(failure)
  return ok(period === 'weekly' ? getWeeklyRevenue() : getMonthlyRevenue())
}

export async function fetchActivities(count: number = 10): Promise<Result<Activity[], ApiError>> {
  await delay(200)
  const failure = maybeFailure()
  if (failure) return err(failure)
  return ok(getRecentActivities(count))
}

export interface SparklineData {
  bookings: number[]
  rooms: number[]
  checkIns: number[]
  checkOuts: number[]
}

export async function fetchSparklineData(): Promise<Result<SparklineData, ApiError>> {
  await delay(150)
  const failure = maybeFailure()
  if (failure) return err(failure)

  return ok({
    bookings: getBookingsSparkline(),
    rooms: getRoomsSparkline(),
    checkIns: getCheckInsSparkline(),
    checkOuts: getCheckOutsSparkline()
  })
}

export const api = {
  hotels: {
    getAll: () => ResultAsync.fromPromise(fetchHotels(), () => ({
      code: 'NETWORK_ERROR' as const,
      message: 'Network request failed'
    })).andThen(r => r),

    getById: (id: string) => ResultAsync.fromPromise(fetchHotelById(id), () => ({
      code: 'NETWORK_ERROR' as const,
      message: 'Network request failed'
    })).andThen(r => r),

    search: (query: string) => ResultAsync.fromPromise(fetchHotelsSearch(query), () => ({
      code: 'NETWORK_ERROR' as const,
      message: 'Network request failed'
    })).andThen(r => r),
  },

  guests: {
    getAll: () => ResultAsync.fromPromise(fetchGuests(), () => ({
      code: 'NETWORK_ERROR' as const,
      message: 'Network request failed'
    })).andThen(r => r),

    getById: (id: string) => ResultAsync.fromPromise(fetchGuestById(id), () => ({
      code: 'NETWORK_ERROR' as const,
      message: 'Network request failed'
    })).andThen(r => r),

    search: (query: string) => ResultAsync.fromPromise(fetchGuestsSearch(query), () => ({
      code: 'NETWORK_ERROR' as const,
      message: 'Network request failed'
    })).andThen(r => r),
  },

  bookings: {
    getAll: () => ResultAsync.fromPromise(fetchBookings(), () => ({
      code: 'NETWORK_ERROR' as const,
      message: 'Network request failed'
    })).andThen(r => r),

    getById: (id: string) => ResultAsync.fromPromise(fetchBookingById(id), () => ({
      code: 'NETWORK_ERROR' as const,
      message: 'Network request failed'
    })).andThen(r => r),

    getByStatus: (status: Booking['status']) => ResultAsync.fromPromise(
      fetchBookingsByStatus(status),
      () => ({ code: 'NETWORK_ERROR' as const, message: 'Network request failed' })
    ).andThen(r => r),
  },

  dashboard: {
    getStats: () => ResultAsync.fromPromise(fetchDashboardStats(), () => ({
      code: 'NETWORK_ERROR' as const,
      message: 'Network request failed'
    })).andThen(r => r),

    getRevenue: (period: 'weekly' | 'monthly' = 'weekly') => ResultAsync.fromPromise(
      fetchRevenueData(period),
      () => ({ code: 'NETWORK_ERROR' as const, message: 'Network request failed' })
    ).andThen(r => r),

    getActivities: (count?: number) => ResultAsync.fromPromise(fetchActivities(count), () => ({
      code: 'NETWORK_ERROR' as const,
      message: 'Network request failed'
    })).andThen(r => r),

    getSparklines: () => ResultAsync.fromPromise(fetchSparklineData(), () => ({
      code: 'NETWORK_ERROR' as const,
      message: 'Network request failed'
    })).andThen(r => r),
  }
}
