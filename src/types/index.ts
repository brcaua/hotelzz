export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'checked-in' | 'checked-out'
export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved'
export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed'
export type RoomType = 'Standard' | 'Deluxe' | 'Suite' | 'Presidential'
export type MembershipTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
export type Gender = 'Male' | 'Female' | 'Other'

export interface Hotel {
  id: string
  name: string
  location: string
  country: string
  rating: number
  totalRooms: number
  availableRooms: number
  occupancyRate: number
  pricePerNight: number
  amenities: string[]
  imageUrl: string
}

export interface Guest {
  id: string
  name: string
  email: string
  phone: string
  country: string
  avatarUrl: string
  totalStays: number
  vipStatus: boolean
}

export interface GuestProfile extends Guest {
  dateOfBirth: Date
  gender: Gender
  nationality: string
  passportNumber: string
  loyaltyProgram: {
    membershipStatus: MembershipTier
    pointsBalance: number
    tierLevel: string
  }
}

export interface RoomInfo {
  imageUrl: string
  size: number
  bedType: string
  maxGuests: number
}

export interface BookingDetails extends Booking {
  roomType: RoomType
  requests: string
  notes: string
  loyaltyProgram: string
  transportation: string
  specialAmenities: string[]
  extras: string
  priceSummary: {
    roomAndOffer: number
    extras: number
    vat: number
    cityTax: number
    total: number
  }
  room: RoomInfo
  paymentNotes: string
}

export interface Booking {
  id: string
  hotelId: string
  guestId: string
  guest: Guest
  roomNumber: string
  checkIn: Date
  checkOut: Date
  status: BookingStatus
  paymentStatus: PaymentStatus
  totalAmount: number
  isOnline: boolean
  createdAt: Date
}

export interface Activity {
  id: string
  guestId: string
  guest: Guest
  roomNumber: string
  action: string
  timestamp: Date
  type: 'request' | 'booking' | 'checkout' | 'checkin' | 'payment'
}

export interface DashboardStats {
  newBookings: number
  availableRooms: number
  checkIns: number
  checkOuts: number
  totalRevenue: number
  revenueChange: number
  totalBookings: number
  onlineBookings: number
  offlineBookings: number
}

export interface RevenueData {
  day: string
  revenue: number
  date: Date
}

export type ApiError = {
  code: 'NOT_FOUND' | 'UNAUTHORIZED' | 'SERVER_ERROR' | 'VALIDATION_ERROR' | 'NETWORK_ERROR'
  message: string
}

export type LoadingState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: ApiError }
  | { status: 'success'; data: T }
