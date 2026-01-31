import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { BookingDetails } from '@/types'

interface BookingsState {
  bookings: BookingDetails[]
  selectedBookingId: string | null
}

interface BookingsActions {
  addBooking: (booking: BookingDetails) => void
  updateBooking: (id: string, updates: Partial<BookingDetails>) => void
  deleteBooking: (id: string) => void
  selectBooking: (id: string | null) => void
  clearBookings: () => void
}

type BookingsStore = BookingsState & BookingsActions

const initialState: BookingsState = {
  bookings: [],
  selectedBookingId: null,
}

export const useBookingsStore = create<BookingsStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        addBooking: (booking) =>
          set(
            (state) => ({ bookings: [booking, ...state.bookings] }),
            false,
            'bookings/add'
          ),
        updateBooking: (id, updates) =>
          set(
            (state) => ({
              bookings: state.bookings.map((b) =>
                b.id === id ? { ...b, ...updates } : b
              ),
            }),
            false,
            'bookings/update'
          ),
        deleteBooking: (id) =>
          set(
            (state) => ({
              bookings: state.bookings.filter((b) => b.id !== id),
              selectedBookingId:
                state.selectedBookingId === id ? null : state.selectedBookingId,
            }),
            false,
            'bookings/delete'
          ),
        selectBooking: (id) =>
          set({ selectedBookingId: id }, false, 'bookings/select'),
        clearBookings: () =>
          set(initialState, false, 'bookings/clear'),
      }),
      {
        name: 'hotel-bookings-storage',
        partialize: (state) => ({ bookings: state.bookings }),
      }
    ),
    { name: 'BookingsStore' }
  )
)

export const selectBookings = (state: BookingsStore) => state.bookings
export const selectSelectedBookingId = (state: BookingsStore) => state.selectedBookingId
export const selectBookingById = (id: string) => (state: BookingsStore) =>
  state.bookings.find((b) => b.id === id)
