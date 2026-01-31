import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BookingList } from '@/components/bookings/booking-list'


vi.mock('@/hooks/use-bookings', () => ({
  useAllBookings: vi.fn(() => [
    {
      id: 'bkg_test001',
      guestId: 'gst_001',
      guest: {
        id: 'gst_001',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 555 123 456',
        country: 'USA',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe',
        totalStays: 5,
        vipStatus: true,
      },
      roomNumber: '101',
      roomType: 'Deluxe',
      checkIn: new Date('2026-01-20'),
      checkOut: new Date('2026-01-25'),
      status: 'confirmed',
      paymentStatus: 'paid',
      totalAmount: 750,
      isOnline: true,
      createdAt: new Date('2026-01-15'),
      priceSummary: { roomAndOffer: 700, extras: 0, vat: 56, cityTax: 77, total: 833 },
    },
    {
      id: 'bkg_test002',
      guestId: 'gst_002',
      guest: {
        id: 'gst_002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+44 555 789 012',
        country: 'UK',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JaneSmith',
        totalStays: 2,
        vipStatus: false,
      },
      roomNumber: '202',
      roomType: 'Suite',
      checkIn: new Date('2026-01-22'),
      checkOut: new Date('2026-01-28'),
      status: 'pending',
      paymentStatus: 'pending',
      totalAmount: 1200,
      isOnline: false,
      createdAt: new Date('2026-01-18'),
      priceSummary: { roomAndOffer: 1100, extras: 50, vat: 92, cityTax: 126.5, total: 1368.5 },
    },
  ]),
  useBookingActions: vi.fn(() => ({
    addBooking: vi.fn(),
    updateBooking: vi.fn(),
    deleteBooking: vi.fn(),
  })),
}))

vi.mock('@/hooks/use-ui', () => ({
  useDialog: vi.fn(() => ({
    activeDialog: null,
    isOpen: vi.fn(() => false),
    open: vi.fn(),
    close: vi.fn(),
  })),
  useFilters: vi.fn(() => ({
    searchQuery: '',
    setSearchQuery: vi.fn(),
    dateRangeFilter: { from: null, to: null },
    statusFilter: [],
    paymentFilter: [],
    hasActiveFilters: false,
  })),
}))

describe('BookingList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders the booking list header', () => {
      render(<BookingList />)
      
      expect(screen.getByText('Bookings')).toBeInTheDocument()
      expect(screen.getByText('Manage all reservations and guest bookings')).toBeInTheDocument()
    })

    it('renders all table headers', () => {
      render(<BookingList />)
      
      expect(screen.getByText('Guest')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
      expect(screen.getByText('Check-In')).toBeInTheDocument()
      expect(screen.getByText('Check-Out')).toBeInTheDocument()
      expect(screen.getByText('Amount')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Payment')).toBeInTheDocument()
    })

    it('renders booking data correctly', () => {
      render(<BookingList />)
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    })

    it('renders action buttons', () => {
      render(<BookingList />)
      
      expect(screen.getByText('Export')).toBeInTheDocument()
      expect(screen.getByText('New Booking')).toBeInTheDocument()
    })
  })

  describe('Status Badges', () => {
    it('renders confirmed status badge', () => {
      render(<BookingList />)
      
      expect(screen.getByText('confirmed')).toBeInTheDocument()
    })

    it('renders pending status badge', () => {
      render(<BookingList />)
      
      const pendingBadges = screen.getAllByText('pending')
      expect(pendingBadges.length).toBeGreaterThan(0)
    })

    it('renders paid payment badge', () => {
      render(<BookingList />)
      
      expect(screen.getByText('paid')).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('renders booking detail links', () => {
      render(<BookingList />)
      
      const links = screen.getAllByRole('link')
      const bookingLinks = links.filter(link => 
        link.getAttribute('href')?.startsWith('/bookings/')
      )
      
      expect(bookingLinks.length).toBeGreaterThan(0)
    })

    it('links to correct booking detail page', () => {
      render(<BookingList />)
      
      const links = screen.getAllByRole('link')
      const johnLink = links.find(link => 
        link.getAttribute('href') === '/bookings/bkg_test001'
      )
      
      expect(johnLink).toBeInTheDocument()
    })
  })

  describe('Room Information', () => {
    it('displays room numbers', () => {
      render(<BookingList />)
      
      expect(screen.getByText('Room 101')).toBeInTheDocument()
      expect(screen.getByText('Room 202')).toBeInTheDocument()
    })
  })

  describe('Contact Information', () => {
    it('displays guest emails', () => {
      render(<BookingList />)
      
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    })

    it('displays guest phone numbers', () => {
      render(<BookingList />)
      
      expect(screen.getByText('+1 555 123 456')).toBeInTheDocument()
      expect(screen.getByText('+44 555 789 012')).toBeInTheDocument()
    })
  })
})
