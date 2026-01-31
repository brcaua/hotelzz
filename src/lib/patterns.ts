import { match, P } from 'ts-pattern'
import type { BookingStatus, PaymentStatus, RoomStatus, LoadingState, ApiError } from '@/types'

export function getBookingStatusConfig(status: BookingStatus) {
  return match(status)
    .with('confirmed', () => ({
      label: 'Confirmed',
      variant: 'success' as const,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: 'check-circle'
    }))
    .with('pending', () => ({
      label: 'Pending',
      variant: 'warning' as const,
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: 'clock'
    }))
    .with('cancelled', () => ({
      label: 'Cancelled',
      variant: 'destructive' as const,
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: 'x-circle'
    }))
    .with('checked-in', () => ({
      label: 'Checked In',
      variant: 'default' as const,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: 'log-in'
    }))
    .with('checked-out', () => ({
      label: 'Checked Out',
      variant: 'secondary' as const,
      color: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: 'log-out'
    }))
    .exhaustive()
}

export function getPaymentStatusConfig(status: PaymentStatus) {
  return match(status)
    .with('paid', () => ({
      label: 'Paid',
      color: 'bg-emerald-100 text-emerald-700',
      icon: 'check'
    }))
    .with('pending', () => ({
      label: 'Pending',
      color: 'bg-amber-100 text-amber-700',
      icon: 'clock'
    }))
    .with('refunded', () => ({
      label: 'Refunded',
      color: 'bg-purple-100 text-purple-700',
      icon: 'rotate-ccw'
    }))
    .with('failed', () => ({
      label: 'Failed',
      color: 'bg-red-100 text-red-700',
      icon: 'x'
    }))
    .exhaustive()
}

export function getRoomStatusConfig(status: RoomStatus) {
  return match(status)
    .with('available', () => ({
      label: 'Available',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700'
    }))
    .with('occupied', () => ({
      label: 'Occupied',
      color: 'bg-blue-500',
      textColor: 'text-blue-700'
    }))
    .with('maintenance', () => ({
      label: 'Maintenance',
      color: 'bg-amber-500',
      textColor: 'text-amber-700'
    }))
    .with('reserved', () => ({
      label: 'Reserved',
      color: 'bg-purple-500',
      textColor: 'text-purple-700'
    }))
    .exhaustive()
}

export function renderLoadingState<T, R>(
  state: LoadingState<T>,
  handlers: {
    idle: () => R
    loading: () => R
    error: (error: ApiError) => R
    success: (data: T) => R
  }
): R {
  return match(state)
    .with({ status: 'idle' }, handlers.idle)
    .with({ status: 'loading' }, handlers.loading)
    .with({ status: 'error' }, (s) => handlers.error(s.error))
    .with({ status: 'success' }, (s) => handlers.success(s.data))
    .exhaustive()
}

export function getErrorMessage(error: ApiError): string {
  return match(error)
    .with({ code: 'NOT_FOUND' }, (e) => e.message || 'Resource not found')
    .with({ code: 'UNAUTHORIZED' }, () => 'You are not authorized to perform this action')
    .with({ code: 'SERVER_ERROR' }, () => 'An unexpected error occurred. Please try again.')
    .with({ code: 'VALIDATION_ERROR' }, (e) => e.message || 'Invalid input provided')
    .with({ code: 'NETWORK_ERROR' }, () => 'Network error. Please check your connection.')
    .exhaustive()
}

export function getActivityConfig(type: 'request' | 'booking' | 'checkout' | 'checkin' | 'payment') {
  return match(type)
    .with('request', () => ({
      icon: 'message-square',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }))
    .with('booking', () => ({
      icon: 'calendar-plus',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    }))
    .with('checkout', () => ({
      icon: 'log-out',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50'
    }))
    .with('checkin', () => ({
      icon: 'log-in',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }))
    .with('payment', () => ({
      icon: 'credit-card',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    }))
    .exhaustive()
}

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  return match({ diffMins, diffHours, diffDays })
    .with({ diffMins: P.number.lt(1) }, () => 'Just now')
    .with({ diffMins: P.number.lt(60) }, ({ diffMins }) => `${diffMins} mins`)
    .with({ diffHours: P.number.lt(24) }, ({ diffHours }) => `${diffHours} hours`)
    .with({ diffDays: P.number.lt(7) }, ({ diffDays }) => `${diffDays} days`)
    .otherwise(() => date.toLocaleDateString())
}

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatNumber(num: number): string {
  return match(num)
    .when(n => n >= 1000000, n => `${(n / 1000000).toFixed(1)}M`)
    .when(n => n >= 1000, n => `${(n / 1000).toFixed(1)}K`)
    .otherwise(n => n.toLocaleString())
}
