import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type DialogType = 'newBooking' | 'editBooking' | 'deleteConfirm' | null

interface UIState {
  sidebarCollapsed: boolean
  activeDialog: DialogType
  searchQuery: string
  dateRangeFilter: {
    from: Date | null
    to: Date | null
  }
  statusFilter: string[]
  paymentFilter: string[]
}

interface UIActions {
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  openDialog: (dialog: DialogType) => void
  closeDialog: () => void
  setSearchQuery: (query: string) => void
  setDateRangeFilter: (from: Date | null, to: Date | null) => void
  setStatusFilter: (statuses: string[]) => void
  setPaymentFilter: (statuses: string[]) => void
  resetFilters: () => void
}

type UIStore = UIState & UIActions

const initialFilters = {
  searchQuery: '',
  dateRangeFilter: { from: null, to: null },
  statusFilter: [],
  paymentFilter: [],
}

const initialState: UIState = {
  sidebarCollapsed: false,
  activeDialog: null,
  ...initialFilters,
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      ...initialState,

      toggleSidebar: () =>
        set(
          (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
          false,
          'ui/toggleSidebar'
        ),

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }, false, 'ui/setSidebarCollapsed'),

      openDialog: (dialog) =>
        set({ activeDialog: dialog }, false, 'ui/openDialog'),

      closeDialog: () =>
        set({ activeDialog: null }, false, 'ui/closeDialog'),

      setSearchQuery: (query) =>
        set({ searchQuery: query }, false, 'ui/setSearchQuery'),

      setDateRangeFilter: (from, to) =>
        set({ dateRangeFilter: { from, to } }, false, 'ui/setDateRangeFilter'),

      setStatusFilter: (statuses) =>
        set({ statusFilter: statuses }, false, 'ui/setStatusFilter'),

      setPaymentFilter: (statuses) =>
        set({ paymentFilter: statuses }, false, 'ui/setPaymentFilter'),

      resetFilters: () =>
        set(initialFilters, false, 'ui/resetFilters'),
    }),
    { name: 'UIStore' }
  )
)

export const selectSidebarCollapsed = (state: UIStore) => state.sidebarCollapsed
export const selectActiveDialog = (state: UIStore) => state.activeDialog
export const selectSearchQuery = (state: UIStore) => state.searchQuery
export const selectFilters = (state: UIStore) => ({
  search: state.searchQuery,
  dateRange: state.dateRangeFilter,
  status: state.statusFilter,
  payment: state.paymentFilter,
})
