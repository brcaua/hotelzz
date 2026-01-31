import type { DashboardStats, RevenueData } from '@/types'
import { bookings, getTodayCheckIns, getTodayCheckOuts, getRecentBookings } from './bookings'
import { hotels } from './hotels'

export function getDashboardStats(): DashboardStats {
  const recentBookings = getRecentBookings(30)
  const todayCheckIns = getTodayCheckIns()
  const todayCheckOuts = getTodayCheckOuts()

  const totalRevenue = recentBookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0)

  const onlineBookings = recentBookings.filter(b => b.isOnline).length
  const offlineBookings = recentBookings.filter(b => !b.isOnline).length

  const totalAvailableRooms = hotels.reduce((sum, h) => sum + h.availableRooms, 0)

  return {
    newBookings: recentBookings.length,
    availableRooms: totalAvailableRooms,
    checkIns: todayCheckIns.length,
    checkOuts: todayCheckOuts.length,
    totalRevenue,
    revenueChange: 16,
    totalBookings: recentBookings.length,
    onlineBookings,
    offlineBookings
  }
}

export function getWeeklyRevenue(): RevenueData[] {
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const now = new Date()

  return days.map((day, index) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (6 - index))

    const baseRevenue = 8000
    const variance = Math.random() * 12000
    const dayBonus = index >= 3 ? 3000 : 0
    const revenue = Math.floor(baseRevenue + variance + dayBonus)

    return {
      day,
      revenue,
      date
    }
  })
}

export function getMonthlyRevenue(): RevenueData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const currentMonth = now.getMonth()

  return months.slice(0, currentMonth + 1).map((month, index) => {
    const date = new Date(now.getFullYear(), index, 1)

    const baseRevenue = 150000
    const seasonalBonus = [6, 7, 8].includes(index) ? 80000 : 0
    const variance = Math.random() * 50000
    const revenue = Math.floor(baseRevenue + seasonalBonus + variance)

    return {
      day: month,
      revenue,
      date
    }
  })
}

export function getBookingsSparkline(): number[] {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 50)
}

export function getRoomsSparkline(): number[] {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 30)
}

export function getCheckInsSparkline(): number[] {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 30) + 10)
}

export function getCheckOutsSparkline(): number[] {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 25) + 8)
}
