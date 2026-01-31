import { guests } from '@/data/guests'
import { hotels } from '@/data/hotels'
import type { BookingDetails, Guest, Hotel, PaymentStatus, RoomType } from '@/types'
import { err, ok, Result } from 'neverthrow'

export interface BookingFormData {
  id: string
  guestId: string
  hotelId: string
  roomNumber: string
  roomType: RoomType
  checkIn: Date | null
  checkOut: Date | null
  guests: number
  requests: string[]
  notes: string
  paymentStatus: PaymentStatus
}

export interface PriceCalculation {
  roomPrice: number
  vat: number
  cityTax: number
  total: number
  nights: number
}

export type BookingError = 
  | { code: 'GUEST_NOT_FOUND'; message: string }
  | { code: 'HOTEL_NOT_FOUND'; message: string }
  | { code: 'INVALID_DATES'; message: string }

const ROOM_MULTIPLIERS: Record<RoomType, number> = {
  Standard: 1,
  Deluxe: 1.5,
  Suite: 2.5,
  Presidential: 4
}

const VAT_RATE = 0.08
const CITY_TAX_RATE = 0.11

export function calculateNights(checkIn: Date, checkOut: Date): number {
  return Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  )
}

export function calculatePrice(
  hotel: Hotel,
  roomType: RoomType,
  nights: number
): PriceCalculation {
  const basePrice = hotel.pricePerNight * nights
  const roomPrice = basePrice * ROOM_MULTIPLIERS[roomType]
  const vat = roomPrice * VAT_RATE
  const cityTax = roomPrice * CITY_TAX_RATE
  const total = roomPrice + vat + cityTax

  return {
    roomPrice: Math.round(roomPrice * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    cityTax: Math.round(cityTax * 100) / 100,
    total: Math.round(total * 100) / 100,
    nights
  }
}

export function findGuest(guestId: string): Result<Guest, BookingError> {
  const guest = guests.find(g => g.id === guestId)
  if (!guest) {
    return err({ code: 'GUEST_NOT_FOUND', message: `Guest with id ${guestId} not found` })
  }
  return ok(guest)
}

export function findHotel(hotelId: string): Result<Hotel, BookingError> {
  const hotel = hotels.find(h => h.id === hotelId)
  if (!hotel) {
    return err({ code: 'HOTEL_NOT_FOUND', message: `Hotel with id ${hotelId} not found` })
  }
  return ok(hotel)
}

export function createBookingDetails(
  formData: BookingFormData
): Result<BookingDetails, BookingError> {
  if (!formData.checkIn || !formData.checkOut) {
    return err({ code: 'INVALID_DATES', message: 'Check-in and check-out dates are required' })
  }

  const guestResult = findGuest(formData.guestId)
  if (guestResult.isErr()) return err(guestResult.error)

  const hotelResult = findHotel(formData.hotelId)
  if (hotelResult.isErr()) return err(hotelResult.error)

  const guest = guestResult.value
  const hotel = hotelResult.value
  const nights = calculateNights(formData.checkIn, formData.checkOut)
  const pricing = calculatePrice(hotel, formData.roomType, nights)

  const booking: BookingDetails = {
    id: formData.id,
    hotelId: formData.hotelId,
    guestId: formData.guestId,
    guest,
    roomNumber: formData.roomNumber,
    checkIn: formData.checkIn,
    checkOut: formData.checkOut,
    status: 'confirmed',
    paymentStatus: formData.paymentStatus,
    totalAmount: pricing.total,
    isOnline: true,
    createdAt: new Date(),
    roomType: formData.roomType,
    requests: formData.requests.join(', ') || 'None',
    notes: formData.notes || 'No special notes',
    loyaltyProgram: 'Standard Member',
    transportation: 'Self-arranged',
    specialAmenities: ['Free Wi-Fi'],
    extras: '-',
    priceSummary: {
      roomAndOffer: pricing.roomPrice,
      extras: 0,
      vat: pricing.vat,
      cityTax: pricing.cityTax,
      total: pricing.total
    },
    room: {
      imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
      size: 35,
      bedType: 'King Bed',
      maxGuests: formData.guests
    },
    paymentNotes: formData.paymentStatus === 'paid' 
      ? 'Payment received' 
      : 'Awaiting payment'
  }

  return ok(booking)
}
