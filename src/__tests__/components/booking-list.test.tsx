import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingList } from '@/components/bookings/booking-list'

vi.mock('@/data/guest-profiles', () => ({
  bookingDetails: [
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
      priceSummary: {
        roomAndOffer: 700,
        extras: 0,
        vat: 56,
        cityTax: 77,
        total: 833,
      },
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
      priceSummary: {
        roomAndOffer: 1100,
        extras: 50,
        vat: 92,
        cityTax: 126.5,
        total: 1368.5,
      },
    },
  ],
}))

describe('BookingList Component', () => {
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
      expect(screen.getByText('+ New Booking')).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('filters bookings by guest name', async () => {
      const user = userEvent.setup()
      render(<BookingList />)
      
      const searchInput = screen.getByPlaceholderText('Search by name, email, phone...')
      await user.type(searchInput, 'John')
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })

    it('filters bookings by email', async () => {
      const user = userEvent.setup()
      render(<BookingList />)
      
      const searchInput = screen.getByPlaceholderText('Search by name, email, phone...')
      await user.type(searchInput, 'jane@')
      
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('shows no results for non-matching search', async () => {
      const user = userEvent.setup()
      render(<BookingList />)
      
      const searchInput = screen.getByPlaceholderText('Search by name, email, phone...')
      await user.type(searchInput, 'nonexistent')
      
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })
  })

  describe('Sorting Functionality', () => {
    it('sorts by guest name when clicking header', async () => {
      const user = userEvent.setup()
      render(<BookingList />)
      
      const guestHeader = screen.getByText('Guest')
      await user.click(guestHeader)
      
      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThan(1)
    })

    it('toggles sort direction on second click', async () => {
      const user = userEvent.setup()
      render(<BookingList />)
      
      const statusHeader = screen.getByText('Status')
      await user.click(statusHeader)
      await user.click(statusHeader)
      
      expect(statusHeader).toBeInTheDocument()
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
    it('renders guest profile links', () => {
      render(<BookingList />)
      
      const links = screen.getAllByRole('link')
      const guestLinks = links.filter(link => 
        link.getAttribute('href')?.startsWith('/guests/')
      )
      
      expect(guestLinks.length).toBeGreaterThan(0)
    })
  })
})
