import type { BookingStatus, PaymentStatus } from '@/types'
import { match } from 'ts-pattern'

export function getStatusColor(status: BookingStatus | string): string {
  return match(status)
    .with('confirmed', () => 'bg-emerald-50 text-emerald-700 border-emerald-200')
    .with('pending', () => 'bg-amber-50 text-amber-700 border-amber-200')
    .with('cancelled', () => 'bg-red-50 text-red-700 border-red-200')
    .with('checked-in', () => 'bg-blue-50 text-blue-700 border-blue-200')
    .with('checked-out', () => 'bg-slate-50 text-slate-700 border-slate-200')
    .otherwise(() => 'bg-slate-50 text-slate-700 border-slate-200')
}

export function getPaymentStatusColor(status: PaymentStatus | string): string {
  return match(status)
    .with('paid', () => 'bg-lime-50 text-lime-700 border-lime-200')
    .with('pending', () => 'bg-amber-50 text-amber-700 border-amber-200')
    .with('refunded', () => 'bg-slate-50 text-slate-700 border-slate-200')
    .with('failed', () => 'bg-red-50 text-red-700 border-red-200')
    .otherwise(() => 'bg-slate-50 text-slate-700 border-slate-200')
}
