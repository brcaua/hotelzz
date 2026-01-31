'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  Star,
  Settings,
  Search,
  Plus,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

interface Command {
  id: string
  label: string
  icon: React.ElementType
  shortcut?: string
  action: () => void
  category: 'navigation' | 'actions' | 'settings'
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()

  const commands: Command[] = [
    {
      id: 'dashboard',
      label: 'Go to Dashboard',
      icon: LayoutDashboard,
      shortcut: 'G D',
      action: () => { router.push('/'); setOpen(false) },
      category: 'navigation',
    },
    {
      id: 'bookings',
      label: 'Go to Bookings',
      icon: Calendar,
      shortcut: 'G B',
      action: () => { router.push('/bookings'); setOpen(false) },
      category: 'navigation',
    },
    {
      id: 'guests',
      label: 'Go to Guests',
      icon: Users,
      shortcut: 'G G',
      action: () => { router.push('/guests'); setOpen(false) },
      category: 'navigation',
    },
    {
      id: 'messages',
      label: 'Go to Messages',
      icon: MessageSquare,
      shortcut: 'G M',
      action: () => { router.push('/messages'); setOpen(false) },
      category: 'navigation',
    },
    {
      id: 'reviews',
      label: 'Go to Reviews',
      icon: Star,
      shortcut: 'G R',
      action: () => { router.push('/reviews'); setOpen(false) },
      category: 'navigation',
    },
    {
      id: 'new-booking',
      label: 'Create New Booking',
      icon: Plus,
      shortcut: 'N B',
      action: () => { router.push('/bookings'); setOpen(false) },
      category: 'actions',
    },
    {
      id: 'toggle-theme',
      label: resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: resolvedTheme === 'dark' ? Sun : Moon,
      shortcut: 'T T',
      action: () => { setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'); setOpen(false) },
      category: 'settings',
    },
    {
      id: 'settings',
      label: 'Open Settings',
      icon: Settings,
      shortcut: 'G S',
      action: () => { setOpen(false) },
      category: 'settings',
    },
  ]

  const filteredCommands = commands.filter(command =>
    command.label.toLowerCase().includes(search.toLowerCase())
  )

  const groupedCommands = {
    navigation: filteredCommands.filter(c => c.category === 'navigation'),
    actions: filteredCommands.filter(c => c.category === 'actions'),
    settings: filteredCommands.filter(c => c.category === 'settings'),
  }

  const flatFiltered = [
    ...groupedCommands.navigation,
    ...groupedCommands.actions,
    ...groupedCommands.settings,
  ]

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setOpen(prev => !prev)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < flatFiltered.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : flatFiltered.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flatFiltered[selectedIndex]) {
        flatFiltered[selectedIndex].action()
      }
    }
  }

  const categoryLabels = {
    navigation: 'Navigation',
    actions: 'Actions',
    settings: 'Settings',
  }

  let currentIndex = 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="max-w-lg p-0 gap-0 overflow-hidden"
        onKeyDown={handleDialogKeyDown}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Command Palette</DialogTitle>
        </DialogHeader>
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Type a command or search..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <ScrollArea className="max-h-80">
          <div className="p-2">
            {Object.entries(groupedCommands).map(([category, items]) => {
              if (items.length === 0) return null
              
              return (
                <div key={category} className="mb-4 last:mb-0">
                  <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </p>
                  {items.map((command) => {
                    const itemIndex = currentIndex++
                    const Icon = command.icon
                    
                    return (
                      <button
                        key={command.id}
                        onClick={command.action}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          selectedIndex === itemIndex
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1 text-left">{command.label}</span>
                        {command.shortcut && (
                          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                            {command.shortcut}
                          </kbd>
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            })}
            {flatFiltered.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No commands found.
              </p>
            )}
          </div>
        </ScrollArea>
        <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">↑↓</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">↵</kbd>
            <span>Select</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">Esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
