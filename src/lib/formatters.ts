export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

export function formatCurrencyUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export function formatCurrencyEUR(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export function formatPhoneNumber(phone: string): string {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date))
}

export function formatBookingId(id: string): string {
  return `LG-${id.replace('bkg_', '').slice(0, 6).toUpperCase()}`
}
