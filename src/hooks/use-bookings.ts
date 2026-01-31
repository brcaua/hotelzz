import { useMemo } from 'react'
import { useBookingsStore } from '@/stores'
import { bookingDetails } from '@/data/guest-profiles'
import type { BookingDetails } from '@/types'

export function useAllBookings(): BookingDetails[] {
  const newBookings = useBookingsStore((state) => state.bookings)
  
  return useMemo(
    () => [...newBookings, ...bookingDetails],
    [newBookings]
  )
}

export function useBookingById(id: string): BookingDetails | undefined {
  const allBookings = useAllBookings()
  return useMemo(
    () => allBookings.find((b) => b.id === id),
    [allBookings, id]
  )
}

export function useBookingsByGuestId(guestId: string): BookingDetails[] {
  const allBookings = useAllBookings()
  return useMemo(
    () => allBookings.filter((b) => b.guestId === guestId),
    [allBookings, guestId]
  )
}

export function useBookingActions() {
  const addBooking = useBookingsStore((state) => state.addBooking)
  const updateBooking = useBookingsStore((state) => state.updateBooking)
  const deleteBooking = useBookingsStore((state) => state.deleteBooking)
  const selectBooking = useBookingsStore((state) => state.selectBooking)
  const clearBookings = useBookingsStore((state) => state.clearBookings)

  return {
    addBooking,
    updateBooking,
    deleteBooking,
    selectBooking,
    clearBookings,
  }
}

export function useSelectedBooking(): BookingDetails | undefined {
  const selectedId = useBookingsStore((state) => state.selectedBookingId)
  const allBookings = useAllBookings()
  
  return useMemo(
    () => selectedId ? allBookings.find((b) => b.id === selectedId) : undefined,
    [allBookings, selectedId]
  )
}

export function useBookingsCount(): number {
  const newBookings = useBookingsStore((state) => state.bookings)
  return newBookings.length + bookingDetails.length
}

export function useNewBookingsCount(): number {
  return useBookingsStore((state) => state.bookings.length)
}
