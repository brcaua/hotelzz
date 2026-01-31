import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDialog, useSidebar, useSearch, useFilters } from '@/hooks/use-ui'
import { useUIStore } from '@/stores'

describe('use-ui hooks', () => {
  beforeEach(() => {
    useUIStore.getState().resetFilters()
    useUIStore.getState().closeDialog()
    useUIStore.getState().setSidebarCollapsed(false)
  })

  describe('useDialog', () => {
    it('returns dialog state and actions', () => {
      const { result } = renderHook(() => useDialog())
      
      expect(result.current.activeDialog).toBeNull()
      expect(typeof result.current.isOpen).toBe('function')
      expect(typeof result.current.open).toBe('function')
      expect(typeof result.current.close).toBe('function')
    })

    it('isOpen returns true when dialog is active', () => {
      useUIStore.getState().openDialog('newBooking')
      
      const { result } = renderHook(() => useDialog())
      expect(result.current.isOpen('newBooking')).toBe(true)
      expect(result.current.isOpen('editBooking')).toBe(false)
    })

    it('open sets the active dialog', () => {
      const { result } = renderHook(() => useDialog())
      
      act(() => {
        result.current.open('editBooking')
      })
      
      expect(useUIStore.getState().activeDialog).toBe('editBooking')
    })

    it('close clears the active dialog', () => {
      useUIStore.getState().openDialog('newBooking')
      
      const { result } = renderHook(() => useDialog())
      act(() => {
        result.current.close()
      })
      
      expect(useUIStore.getState().activeDialog).toBeNull()
    })
  })

  describe('useSidebar', () => {
    it('returns sidebar state and actions', () => {
      const { result } = renderHook(() => useSidebar())
      
      expect(result.current.collapsed).toBe(false)
      expect(typeof result.current.toggle).toBe('function')
      expect(typeof result.current.setCollapsed).toBe('function')
    })

    it('toggle switches collapsed state', () => {
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.toggle()
      })
      
      expect(useUIStore.getState().sidebarCollapsed).toBe(true)
    })

    it('setCollapsed sets specific state', () => {
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.setCollapsed(true)
      })
      
      expect(useUIStore.getState().sidebarCollapsed).toBe(true)
    })
  })

  describe('useSearch', () => {
    it('returns search state and actions', () => {
      const { result } = renderHook(() => useSearch())
      
      expect(result.current.query).toBe('')
      expect(typeof result.current.setQuery).toBe('function')
      expect(typeof result.current.clear).toBe('function')
    })

    it('setQuery updates search query', () => {
      const { result } = renderHook(() => useSearch())
      
      act(() => {
        result.current.setQuery('test search')
      })
      
      expect(useUIStore.getState().searchQuery).toBe('test search')
    })

    it('clear resets search query', () => {
      useUIStore.getState().setSearchQuery('some query')
      
      const { result } = renderHook(() => useSearch())
      act(() => {
        result.current.clear()
      })
      
      expect(useUIStore.getState().searchQuery).toBe('')
    })
  })

  describe('useFilters', () => {
    it('returns filter state and actions', () => {
      const { result } = renderHook(() => useFilters())
      
      expect(result.current.searchQuery).toBe('')
      expect(result.current.dateRangeFilter).toEqual({ from: null, to: null })
      expect(result.current.statusFilter).toEqual([])
      expect(result.current.paymentFilter).toEqual([])
      expect(result.current.hasActiveFilters).toBe(false)
    })

    it('hasActiveFilters is true when search query is set', () => {
      useUIStore.getState().setSearchQuery('test')
      
      const { result } = renderHook(() => useFilters())
      expect(result.current.hasActiveFilters).toBe(true)
    })

    it('hasActiveFilters is true when date range is set', () => {
      useUIStore.getState().setDateRangeFilter(new Date(), null)
      
      const { result } = renderHook(() => useFilters())
      expect(result.current.hasActiveFilters).toBe(true)
    })

    it('hasActiveFilters is true when status filter is set', () => {
      useUIStore.getState().setStatusFilter(['confirmed'])
      
      const { result } = renderHook(() => useFilters())
      expect(result.current.hasActiveFilters).toBe(true)
    })

    it('hasActiveFilters is true when payment filter is set', () => {
      useUIStore.getState().setPaymentFilter(['paid'])
      
      const { result } = renderHook(() => useFilters())
      expect(result.current.hasActiveFilters).toBe(true)
    })

    it('resetFilters clears all filters', () => {
      useUIStore.getState().setSearchQuery('test')
      useUIStore.getState().setStatusFilter(['confirmed'])
      
      const { result } = renderHook(() => useFilters())
      act(() => {
        result.current.resetFilters()
      })
      
      expect(useUIStore.getState().searchQuery).toBe('')
      expect(useUIStore.getState().statusFilter).toEqual([])
    })
  })
})
