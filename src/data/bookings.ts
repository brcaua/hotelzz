import type { Booking, BookingStatus, PaymentStatus, Activity } from '@/types'
import { hotels } from './hotels'
import { guests } from './guests'

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function generateBookingId(index: number): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let result = ''
  let seed = index + 1000
  for (let i = 0; i < 9; i++) {
    result += chars[Math.floor(seededRandom(seed + i) * chars.length)]
  }
  return `bkg_${result}`
}

function generateActivityId(index: number): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let result = ''
  let seed = index + 5000
  for (let i = 0; i < 9; i++) {
    result += chars[Math.floor(seededRandom(seed + i) * chars.length)]
  }
  return `act_${result}`
}

function seededDate(seed: number, start: Date, end: Date): Date {
  const range = end.getTime() - start.getTime()
  return new Date(start.getTime() + Math.floor(seededRandom(seed) * range))
}

function getSeededStatus(seed: number): BookingStatus {
  const statuses: BookingStatus[] = ['confirmed', 'pending', 'cancelled', 'checked-in', 'checked-out']
  const weights = [0.4, 0.15, 0.05, 0.25, 0.15]
  const random = seededRandom(seed)
  let sum = 0
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i]
    if (random < sum) return statuses[i]
  }
  return 'confirmed'
}

function getPaymentStatus(bookingStatus: BookingStatus, seed: number): PaymentStatus {
  const random = seededRandom(seed)
  if (bookingStatus === 'cancelled') return random > 0.7 ? 'refunded' : 'paid'
  if (bookingStatus === 'pending') return random > 0.3 ? 'pending' : 'paid'
  return 'paid'
}

const baseDate = new Date('2026-01-15T12:00:00Z')
const thirtyDaysAgo = new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000)
const thirtyDaysAhead = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000)

export const bookings: Booking[] = Array.from({ length: 200 }, (_, index) => {
  const seed1 = index * 11 + 1
  const seed2 = index * 13 + 2
  const seed3 = index * 17 + 3
  const seed4 = index * 19 + 4
  const seed5 = index * 23 + 5
  
  const hotel = hotels[Math.floor(seededRandom(seed1) * hotels.length)]
  const guest = guests[Math.floor(seededRandom(seed2) * guests.length)]
  const status = getSeededStatus(seed3)
  const checkIn = seededDate(seed4, thirtyDaysAgo, thirtyDaysAhead)
  const stayLength = Math.floor(seededRandom(seed5) * 7) + 1
  const checkOut = new Date(checkIn.getTime() + stayLength * 24 * 60 * 60 * 1000)
  const floor = Math.floor(seededRandom(index * 29) * 9) + 1
  const room = Math.floor(seededRandom(index * 31) * 50) + 1

  return {
    id: generateBookingId(index),
    hotelId: hotel.id,
    guestId: guest.id,
    guest,
    roomNumber: `${floor}${String(room).padStart(2, '0')}`,
    checkIn,
    checkOut,
    status,
    paymentStatus: getPaymentStatus(status, index * 37),
    totalAmount: hotel.pricePerNight * stayLength,
    isOnline: seededRandom(index * 41) > 0.3,
    createdAt: seededDate(index * 43, new Date(thirtyDaysAgo.getTime() - 15 * 24 * 60 * 60 * 1000), checkIn)
  }
})

const activityActions = [
  { action: 'requested for a coffee and water', type: 'request' as const },
  { action: 'booked a spa treatment', type: 'request' as const },
  { action: 'requested late checkout', type: 'request' as const },
  { action: 'Book and manage conference', type: 'booking' as const },
  { action: 'Provide information about local', type: 'request' as const },
  { action: 'Allow guests to view and settle', type: 'checkout' as const },
  { action: 'requested room cleaning', type: 'request' as const },
  { action: 'ordered room service', type: 'request' as const },
  { action: 'checked in successfully', type: 'checkin' as const },
  { action: 'completed payment', type: 'payment' as const },
  { action: 'requested airport transfer', type: 'request' as const },
  { action: 'booked restaurant reservation', type: 'booking' as const },
]

export const activities: Activity[] = Array.from({ length: 50 }, (_, index) => {
  const seed1 = index * 47 + 1
  const seed2 = index * 53 + 2
  
  const guest = guests[Math.floor(seededRandom(seed1) * guests.length)]
  const activityType = activityActions[Math.floor(seededRandom(seed2) * activityActions.length)]
  const minutesAgo = Math.floor(seededRandom(index * 59) * 120) + 5
  const roomNum = 1000 + Math.floor(seededRandom(index * 61) * 9000)

  return {
    id: generateActivityId(index),
    guestId: guest.id,
    guest,
    roomNumber: `#${roomNum}`,
    action: activityType.action,
    timestamp: new Date(baseDate.getTime() - minutesAgo * 60 * 1000),
    type: activityType.type
  }
}).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

export function getBookingById(id: string): Booking | undefined {
  return bookings.find(booking => booking.id === id)
}

export function getBookingsByStatus(status: BookingStatus): Booking[] {
  return bookings.filter(booking => booking.status === status)
}

export function getTodayCheckIns(): Booking[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

  return bookings.filter(booking =>
    booking.checkIn >= today &&
    booking.checkIn < tomorrow &&
    (booking.status === 'confirmed' || booking.status === 'checked-in')
  )
}

export function getTodayCheckOuts(): Booking[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

  return bookings.filter(booking =>
    booking.checkOut >= today &&
    booking.checkOut < tomorrow &&
    (booking.status === 'checked-in' || booking.status === 'checked-out')
  )
}

export function getRecentBookings(days: number = 7): Booking[] {
  const now = new Date()
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  return bookings.filter(booking => booking.createdAt >= cutoff)
}

export function getRecentActivities(count: number = 10): Activity[] {
  return activities.slice(0, count)
}
