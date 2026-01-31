'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAllBookings, useBookingActions } from '@/hooks/use-bookings'
import { useDialog, useFilters } from '@/hooks/use-ui'
import { formatCurrencyUSD, formatDate } from '@/lib/formatters'
import { getPaymentStatusColor, getStatusColor } from '@/lib/status-styles'
import { createBookingDetails, type BookingFormData } from '@/services/booking.service'
import type { BookingDetails } from '@/types'
import {
  Calendar,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'

const NewBookingDialog = dynamic(
  () => import('./new-booking-dialog').then(mod => ({ default: mod.NewBookingDialog })),
  { 
    loading: () => null,
    ssr: false 
  }
)

function filterBookings(bookings: BookingDetails[], query: string): BookingDetails[] {
  if (!query) return bookings
  const lowerQuery = query.toLowerCase()
  return bookings.filter(booking => 
    booking.guest.name.toLowerCase().includes(lowerQuery) ||
    booking.guest.email.toLowerCase().includes(lowerQuery) ||
    booking.guest.phone.toLowerCase().includes(lowerQuery) ||
    booking.status.toLowerCase().includes(lowerQuery) ||
    booking.roomNumber.toLowerCase().includes(lowerQuery)
  )
}

function sortBookingsByDate(bookings: BookingDetails[]): BookingDetails[] {
  return [...bookings].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function BookingList() {
  const allBookings = useAllBookings()
  const { addBooking } = useBookingActions()
  const { isOpen, open: openDialog, close: closeDialog } = useDialog()
  const { searchQuery, setSearchQuery } = useFilters()

  const isNewBookingOpen = isOpen('newBooking')

  const handleBookingCreated = useCallback((formData: BookingFormData) => {
    const result = createBookingDetails(formData)
    
    result.match(
      (booking) => {
        addBooking(booking)
        toast.success('Booking created successfully')
      },
      (error) => {
        toast.error(error.message)
      }
    )
  }, [addBooking])

  const displayedBookings = useMemo(() => {
    const filtered = filterBookings(allBookings, searchQuery)
    const sorted = sortBookingsByDate(filtered)
    return sorted.slice(0, 20)
  }, [allBookings, searchQuery])

  return (
    <div className="space-y-6">
      <BookingListHeader onNewBooking={() => openDialog('newBooking')} />

      <Card className="animate-fade-up animation-delay-100">
        <CardHeader className="flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-lg">All Bookings</CardTitle>
          <BookingFilters 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />
        </CardHeader>
        <CardContent className="p-0">
          <BookingTable bookings={displayedBookings} />
        </CardContent>
      </Card>

      <NewBookingDialog
        open={isNewBookingOpen}
        onOpenChange={(open) => open ? openDialog('newBooking') : closeDialog()}
        onBookingCreated={handleBookingCreated}
      />
    </div>
  )
}

function BookingListHeader({ onNewBooking }: { onNewBooking: () => void }) {
  return (
    <div className="flex items-center justify-between animate-fade-up">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">Manage all reservations and guest bookings</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="size-4" />
          Export
        </Button>
        <Button size="sm" onClick={onNewBooking}>
          <Plus className="size-4" />
          New Booking
        </Button>
      </div>
    </div>
  )
}

function BookingFilters({ 
  searchQuery, 
  onSearchChange 
}: { 
  searchQuery: string
  onSearchChange: (value: string) => void 
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, phone..."
          className="w-72 pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="outline" size="sm" className="gap-2">
        <Calendar className="size-4" />
        Date Range
      </Button>
      <Button variant="outline" size="sm" className="gap-2">
        <Filter className="size-4" />
        Filters
      </Button>
    </div>
  )
}

function BookingTable({ bookings }: { bookings: BookingDetails[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="p-4 text-left font-medium text-muted-foreground">Guest</th>
            <th className="p-4 text-left font-medium text-muted-foreground">Contact</th>
            <th className="p-4 text-left font-medium text-muted-foreground">Check-In</th>
            <th className="p-4 text-left font-medium text-muted-foreground">Check-Out</th>
            <th className="p-4 text-left font-medium text-muted-foreground">Amount</th>
            <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
            <th className="p-4 text-left font-medium text-muted-foreground">Payment</th>
            <th className="p-4 text-left font-medium text-muted-foreground"></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BookingRow({ booking }: { booking: BookingDetails }) {
  return (
    <tr className="border-b last:border-0 hover:bg-muted/20 transition-colors cursor-pointer">
      <td className="p-4">
        <Link href={`/bookings/${booking.id}`} className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={booking.guest.avatarUrl} alt={booking.guest.name} />
            <AvatarFallback>
              {booking.guest.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground hover:text-primary transition-colors">
              {booking.guest.name}
            </p>
            <p className="text-muted-foreground text-xs">
              Room {booking.roomNumber}
            </p>
          </div>
        </Link>
      </td>
      <td className="p-4">
        <p className="text-foreground">{booking.guest.email}</p>
        <p className="text-muted-foreground text-xs">{booking.guest.phone}</p>
      </td>
      <td className="p-4 font-medium">{formatDate(booking.checkIn)}</td>
      <td className="p-4 font-medium">{formatDate(booking.checkOut)}</td>
      <td className="p-4 font-semibold">{formatCurrencyUSD(booking.priceSummary.total)}</td>
      <td className="p-4">
        <Badge className={`${getStatusColor(booking.status)} border capitalize`}>
          {booking.status.replace('-', ' ')}
        </Badge>
      </td>
      <td className="p-4">
        <Badge className={`${getPaymentStatusColor(booking.paymentStatus)} border capitalize`}>
          {booking.paymentStatus}
        </Badge>
      </td>
      <td className="p-4">
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="size-4" />
        </Button>
      </td>
    </tr>
  )
}
