import type { GuestProfile, BookingDetails, MembershipTier, Gender, RoomType } from '@/types'
import { guests } from './guests'
import { bookings } from './bookings'

const membershipTiers: MembershipTier[] = ['Bronze', 'Silver', 'Gold', 'Platinum']
const genders: Gender[] = ['Male', 'Female', 'Other']
const nationalities = [
  'American', 'British', 'German', 'French', 'Italian', 'Spanish', 'Portuguese',
  'Brazilian', 'Japanese', 'Australian', 'Canadian', 'Dutch', 'Swiss', 'Swedish'
]

const roomTypes: RoomType[] = ['Standard', 'Deluxe', 'Suite', 'Presidential']
const bedTypes = ['King Bed', 'Queen Bed', 'Twin Beds', 'Double Bed']
const requests = ['Late Check-Out', 'Early Check-In', 'Extra Pillows', 'Quiet Room', 'High Floor']
const amenities = [
  'Complimentary breakfast',
  'Free Wi-Fi',
  'Access to gym and pool',
  'Spa access',
  'Airport transfer',
  'Late checkout'
]
const transportations = ['Airport pickup arranged', 'Hotel shuttle', 'Self-arranged', 'Taxi service booked']

const roomImages = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop'
]

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generatePassportNumber(seed: number): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const prefix = letters[seed % 26]
  const numbers = 10000000 + (seed % 90000000)
  return `${prefix}${numbers}`
}

function seededDate(seed: number, start: Date, end: Date): Date {
  const range = end.getTime() - start.getTime()
  return new Date(start.getTime() + (seed % range))
}

export const guestProfiles: GuestProfile[] = guests.map((guest, index) => {
  const seed = hashCode(guest.id)
  const tierIndex = guest.vipStatus 
    ? (seed % 2) + 2 
    : seed % 4
  
  return {
    ...guest,
    dateOfBirth: seededDate(seed, new Date(1960, 0, 1), new Date(2000, 11, 31)),
    gender: genders[seed % genders.length],
    nationality: nationalities[seed % nationalities.length],
    passportNumber: generatePassportNumber(seed),
    loyaltyProgram: {
      membershipStatus: membershipTiers[tierIndex],
      pointsBalance: 1000 + (seed % 50000),
      tierLevel: guest.vipStatus ? 'Elite' : 'Standard'
    }
  }
})

export const bookingDetails: BookingDetails[] = bookings.map((booking, index) => {
  const seed = hashCode(booking.id)
  const roomType = roomTypes[seed % roomTypes.length]
  const basePrice = booking.totalAmount
  const hasExtras = seed % 10 > 7
  const extrasAmount = hasExtras ? (seed % 100) : 0
  const vatRate = 0.08
  const cityTaxRate = 0.11
  const subtotal = basePrice + extrasAmount
  const vat = Math.round(subtotal * vatRate * 100) / 100
  const cityTax = Math.round(subtotal * cityTaxRate * 100) / 100
  
  const amenityCount = (seed % 3) + 1
  const selectedAmenities = amenities.slice(0, amenityCount)

  return {
    ...booking,
    roomType,
    requests: requests[seed % requests.length],
    notes: 'Guest requested extra pillows and towels. Ensure room service is available upon arrival.',
    loyaltyProgram: membershipTiers[seed % membershipTiers.length] + ' Member',
    transportation: transportations[seed % transportations.length],
    specialAmenities: selectedAmenities,
    extras: extrasAmount > 0 ? 'Room service, Mini bar' : '-',
    priceSummary: {
      roomAndOffer: basePrice,
      extras: extrasAmount,
      vat,
      cityTax,
      total: Math.round((subtotal + vat + cityTax) * 100) / 100
    },
    room: {
      imageUrl: roomImages[seed % roomImages.length],
      size: [25, 30, 35, 45, 60][seed % 5],
      bedType: bedTypes[seed % bedTypes.length],
      maxGuests: (seed % 3) + 1
    },
    paymentNotes: booking.paymentStatus === 'paid' 
      ? 'Invoice sent to corporate account; payment confirmed by BIG Corporation'
      : 'Payment pending confirmation'
  }
})

export function getGuestProfileById(id: string): GuestProfile | undefined {
  return guestProfiles.find(profile => profile.id === id)
}

export function getBookingDetailsById(id: string): BookingDetails | undefined {
  return bookingDetails.find(booking => booking.id === id)
}

export function getBookingsByGuestId(guestId: string): BookingDetails[] {
  return bookingDetails.filter(booking => booking.guestId === guestId)
}

export function getLatestBookingForGuest(guestId: string): BookingDetails | undefined {
  const guestBookings = getBookingsByGuestId(guestId)
  if (guestBookings.length === 0) return undefined
  
  return guestBookings.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]
}
