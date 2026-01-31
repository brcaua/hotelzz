import { useUIStore } from '@/stores'

export function useDialog() {
  const activeDialog = useUIStore((state) => state.activeDialog)
  const openDialog = useUIStore((state) => state.openDialog)
  const closeDialog = useUIStore((state) => state.closeDialog)

  return {
    activeDialog,
    isOpen: (dialog: string) => activeDialog === dialog,
    open: openDialog,
    close: closeDialog,
  }
}

export function useSidebar() {
  const collapsed = useUIStore((state) => state.sidebarCollapsed)
  const toggle = useUIStore((state) => state.toggleSidebar)
  const setCollapsed = useUIStore((state) => state.setSidebarCollapsed)

  return {
    collapsed,
    toggle,
    setCollapsed,
  }
}

export function useSearch() {
  const query = useUIStore((state) => state.searchQuery)
  const setQuery = useUIStore((state) => state.setSearchQuery)

  return {
    query,
    setQuery,
    clear: () => setQuery(''),
  }
}

export function useFilters() {
  const searchQuery = useUIStore((state) => state.searchQuery)
  const dateRangeFilter = useUIStore((state) => state.dateRangeFilter)
  const statusFilter = useUIStore((state) => state.statusFilter)
  const paymentFilter = useUIStore((state) => state.paymentFilter)
  const setSearchQuery = useUIStore((state) => state.setSearchQuery)
  const setDateRangeFilter = useUIStore((state) => state.setDateRangeFilter)
  const setStatusFilter = useUIStore((state) => state.setStatusFilter)
  const setPaymentFilter = useUIStore((state) => state.setPaymentFilter)
  const resetFilters = useUIStore((state) => state.resetFilters)

  const hasActiveFilters = 
    searchQuery !== '' ||
    dateRangeFilter.from !== null ||
    dateRangeFilter.to !== null ||
    statusFilter.length > 0 ||
    paymentFilter.length > 0

  return {
    searchQuery,
    dateRangeFilter,
    statusFilter,
    paymentFilter,
    setSearchQuery,
    setDateRangeFilter,
    setStatusFilter,
    setPaymentFilter,
    resetFilters,
    hasActiveFilters,
  }
}
