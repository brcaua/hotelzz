import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '@/stores/ui.store'

describe('UI Store', () => {
  beforeEach(() => {
    useUIStore.getState().resetFilters()
    useUIStore.getState().closeDialog()
    useUIStore.getState().setSidebarCollapsed(false)
  })

  describe('Sidebar', () => {
    it('toggles sidebar collapsed state', () => {
      expect(useUIStore.getState().sidebarCollapsed).toBe(false)
      
      useUIStore.getState().toggleSidebar()
      expect(useUIStore.getState().sidebarCollapsed).toBe(true)
      
      useUIStore.getState().toggleSidebar()
      expect(useUIStore.getState().sidebarCollapsed).toBe(false)
    })

    it('sets sidebar collapsed state directly', () => {
      useUIStore.getState().setSidebarCollapsed(true)
      expect(useUIStore.getState().sidebarCollapsed).toBe(true)
      
      useUIStore.getState().setSidebarCollapsed(false)
      expect(useUIStore.getState().sidebarCollapsed).toBe(false)
    })
  })

  describe('Dialog', () => {
    it('opens a dialog', () => {
      useUIStore.getState().openDialog('newBooking')
      expect(useUIStore.getState().activeDialog).toBe('newBooking')
    })

    it('closes the dialog', () => {
      useUIStore.getState().openDialog('newBooking')
      useUIStore.getState().closeDialog()
      expect(useUIStore.getState().activeDialog).toBeNull()
    })

    it('can open different dialog types', () => {
      useUIStore.getState().openDialog('editBooking')
      expect(useUIStore.getState().activeDialog).toBe('editBooking')
      
      useUIStore.getState().openDialog('deleteConfirm')
      expect(useUIStore.getState().activeDialog).toBe('deleteConfirm')
    })
  })

  describe('Search Query', () => {
    it('sets search query', () => {
      useUIStore.getState().setSearchQuery('John Doe')
      expect(useUIStore.getState().searchQuery).toBe('John Doe')
    })

    it('clears search query', () => {
      useUIStore.getState().setSearchQuery('test')
      useUIStore.getState().setSearchQuery('')
      expect(useUIStore.getState().searchQuery).toBe('')
    })
  })

  describe('Date Range Filter', () => {
    it('sets date range filter', () => {
      const from = new Date('2026-01-01')
      const to = new Date('2026-01-31')
      
      useUIStore.getState().setDateRangeFilter(from, to)
      
      const filter = useUIStore.getState().dateRangeFilter
      expect(filter.from).toEqual(from)
      expect(filter.to).toEqual(to)
    })

    it('can set partial date range', () => {
      const from = new Date('2026-01-01')
      
      useUIStore.getState().setDateRangeFilter(from, null)
      
      const filter = useUIStore.getState().dateRangeFilter
      expect(filter.from).toEqual(from)
      expect(filter.to).toBeNull()
    })
  })

  describe('Status Filter', () => {
    it('sets status filter', () => {
      useUIStore.getState().setStatusFilter(['confirmed', 'pending'])
      expect(useUIStore.getState().statusFilter).toEqual(['confirmed', 'pending'])
    })

    it('can clear status filter', () => {
      useUIStore.getState().setStatusFilter(['confirmed'])
      useUIStore.getState().setStatusFilter([])
      expect(useUIStore.getState().statusFilter).toEqual([])
    })
  })

  describe('Payment Filter', () => {
    it('sets payment filter', () => {
      useUIStore.getState().setPaymentFilter(['paid', 'pending'])
      expect(useUIStore.getState().paymentFilter).toEqual(['paid', 'pending'])
    })
  })

  describe('Reset Filters', () => {
    it('resets all filters to initial state', () => {
      useUIStore.getState().setSearchQuery('test')
      useUIStore.getState().setDateRangeFilter(new Date(), new Date())
      useUIStore.getState().setStatusFilter(['confirmed'])
      useUIStore.getState().setPaymentFilter(['paid'])
      
      useUIStore.getState().resetFilters()
      
      expect(useUIStore.getState().searchQuery).toBe('')
      expect(useUIStore.getState().dateRangeFilter).toEqual({ from: null, to: null })
      expect(useUIStore.getState().statusFilter).toEqual([])
      expect(useUIStore.getState().paymentFilter).toEqual([])
    })
  })
})
