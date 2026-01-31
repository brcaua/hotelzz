'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { bookingDetails, getBookingsByGuestId, getGuestProfileById } from '@/data/guest-profiles'
import { formatBookingId, formatDate, formatTime } from '@/lib/formatters'
import { formatCurrency } from '@/lib/patterns'
import { getPaymentStatusColor, getStatusColor } from '@/lib/status-styles'
import {
  ArrowLeft,
  Bed,
  Check,
  Clock,
  CreditCard,
  Edit,
  Mail,
  MapPin,
  Maximize2,
  MoreHorizontal,
  Phone,
  Printer,
  Users,
  X
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use } from 'react'
import { match } from 'ts-pattern'

function getStatusConfig(status: string) {
  return match(status)
    .with('confirmed', () => ({
      label: 'Confirmed',
      color: getStatusColor('confirmed'),
      icon: Check
    }))
    .with('pending', () => ({
      label: 'Pending',
      color: getStatusColor('pending'),
      icon: Clock
    }))
    .with('cancelled', () => ({
      label: 'Cancelled',
      color: getStatusColor('cancelled'),
      icon: X
    }))
    .with('checked-in', () => ({
      label: 'Checked In',
      color: getStatusColor('checked-in'),
      icon: Check
    }))
    .with('checked-out', () => ({
      label: 'Checked Out',
      color: getStatusColor('checked-out'),
      icon: Check
    }))
    .otherwise(() => ({
      label: status,
      color: getStatusColor(''),
      icon: Check
    }))
}

function getMembershipColor(status: string) {
  return match(status)
    .with('Platinum Member', () => 'bg-gradient-to-r from-slate-700 to-slate-500 text-white')
    .with('Gold Member', () => 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white')
    .with('Silver Member', () => 'bg-gradient-to-r from-slate-400 to-slate-300 text-slate-800')
    .otherwise(() => 'bg-gradient-to-r from-amber-700 to-amber-600 text-white')
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  
  const booking = bookingDetails.find(b => b.id === id)
  
  if (!booking) {
    notFound()
  }

  const guest = getGuestProfileById(booking.guestId)
  const guestBookings = getBookingsByGuestId(booking.guestId).filter(b => b.id !== booking.id).slice(0, 5)
  const statusConfig = getStatusConfig(booking.status)
  const StatusIcon = statusConfig.icon

  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 
    (1000 * 60 * 60 * 24)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div className="flex items-center gap-4">
          <Link href="/bookings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Booking {formatBookingId(booking.id)}
            </h1>
            <p className="text-sm text-muted-foreground">
              <Link href="/bookings" className="text-primary hover:underline">Bookings</Link>
              {' / '}
              <span>Booking Details</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {guest && (
          <Card className="col-span-3 animate-fade-up animation-delay-100">
            <CardHeader className="flex-row items-start justify-between pb-0">
              <CardTitle className="text-lg">Guest</CardTitle>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 ring-2 ring-primary/10">
                  <AvatarImage src={guest.avatarUrl} alt={guest.name} />
                  <AvatarFallback className="text-lg">
                    {guest.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-display text-xl font-semibold text-primary">{guest.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {guest.totalStays} previous stays
                  </p>
                  {guest.vipStatus && (
                    <Badge className="mt-1 bg-amber-100 text-amber-700">VIP Guest</Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex size-8 items-center justify-center rounded-full bg-emerald-50">
                    <Phone className="size-4 text-primary" />
                  </div>
                  <span>{guest.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex size-8 items-center justify-center rounded-full bg-emerald-50">
                    <Mail className="size-4 text-primary" />
                  </div>
                  <span className="truncate">{guest.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex size-8 items-center justify-center rounded-full bg-emerald-50">
                    <MapPin className="size-4 text-primary" />
                  </div>
                  <span>{guest.country}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-3 font-semibold text-foreground">Personal Info</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{formatDate(guest.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium">{guest.gender}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nationality</p>
                    <p className="font-medium">{guest.nationality}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Passport</p>
                    <p className="font-medium">{guest.passportNumber}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-3 font-semibold text-foreground">Loyalty</h4>
                <Badge className={getMembershipColor(booking.loyaltyProgram)}>
                  {booking.loyaltyProgram}
                </Badge>
                <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                  <div>
                    <p className="text-muted-foreground">Points</p>
                    <p className="font-semibold">{guest.loyaltyProgram.pointsBalance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tier</p>
                    <p className="font-medium">{guest.loyaltyProgram.tierLevel}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="col-span-5 animate-fade-up animation-delay-200">
          <CardHeader className="flex-row items-start justify-between pb-0">
            <CardTitle className="text-lg">Booking Details</CardTitle>
            <Badge className={`${statusConfig.color} border`}>
              <StatusIcon className="mr-1 size-3" />
              {statusConfig.label}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <h3 className="font-display text-2xl font-bold">
                {formatBookingId(booking.id)}
              </h3>
              <p className="text-sm text-muted-foreground">
                Booked on {formatDate(booking.createdAt)} at {formatTime(booking.createdAt)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Room Type</p>
                <p className="font-semibold">{booking.roomType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Room Number</p>
                <p className="font-semibold">{booking.roomNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Guests</p>
                <p className="font-semibold">{booking.room.maxGuests} Adults</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm bg-muted/30 rounded-lg p-4">
              <div>
                <p className="text-muted-foreground">Check In</p>
                <p className="font-semibold">{formatDate(booking.checkIn)}</p>
                <p className="text-muted-foreground">{formatTime(booking.checkIn)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Check Out</p>
                <p className="font-semibold">{formatDate(booking.checkOut)}</p>
                <p className="text-muted-foreground">{formatTime(booking.checkOut)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-semibold">{nights} nights</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Special Requests</p>
                <p className="font-medium">{booking.requests}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transportation</p>
                <p className="font-medium">{booking.transportation}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {booking.specialAmenities.map((amenity, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    <Check className="size-3" />
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <p className="text-muted-foreground">Notes</p>
              <p className="mt-1">{booking.notes}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1">Edit Booking</Button>
              <Button variant="outline" className="flex-1 text-destructive hover:text-destructive">
                Cancel Booking
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4 animate-fade-up animation-delay-300">
          <CardHeader className="flex-row items-start justify-between pb-0">
            <CardTitle className="text-lg">Room & Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={booking.room.imageUrl}
                alt="Room"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Maximize2 className="size-4 text-muted-foreground" />
                <span>{booking.room.size} m²</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="size-4 text-muted-foreground" />
                <span>{booking.room.bedType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                <span>{booking.room.maxGuests} guests</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Price Summary</h4>
                <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                  {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room ({nights} nights)</span>
                  <span>{formatCurrency(booking.priceSummary.roomAndOffer)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Extras</span>
                  <span>{formatCurrency(booking.priceSummary.extras)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT (8%)</span>
                  <span>{formatCurrency(booking.priceSummary.vat)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City Tax (11%)</span>
                  <span>{formatCurrency(booking.priceSummary.cityTax)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(booking.priceSummary.total)}</span>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm">
                <p className="text-muted-foreground">Payment Notes</p>
                <p className="mt-1">{booking.paymentNotes}</p>
              </div>

              <Button className="w-full mt-4" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Process Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {guestBookings.length > 0 && (
        <Card className="animate-fade-up animation-delay-400">
          <CardHeader>
            <CardTitle className="text-lg">Previous Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {guestBookings.map((prevBooking) => (
                <Link key={prevBooking.id} href={`/bookings/${prevBooking.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="relative aspect-video overflow-hidden rounded-md mb-3">
                        <Image
                          src={prevBooking.room.imageUrl}
                          alt="Room"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="font-medium text-sm">{formatBookingId(prevBooking.id)}</p>
                      <p className="text-xs text-muted-foreground">
                        {prevBooking.roomType} • Room {prevBooking.roomNumber}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(prevBooking.checkIn)}
                      </p>
                      <Badge 
                        className={`mt-2 text-xs ${getStatusConfig(prevBooking.status).color}`}
                      >
                        {getStatusConfig(prevBooking.status).label}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
