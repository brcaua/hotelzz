'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MessageSquare, Bell, Calendar } from 'lucide-react'

export function Header() {
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-white/80 px-8 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <div className="hidden items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground md:flex">
          <Calendar className="h-3.5 w-3.5" />
          {formattedDate}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder="Search anything..."
            className="w-72 rounded-xl border-border/50 bg-muted/30 pl-10 pr-14 text-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus:bg-white focus:shadow-sm"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border/50 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
            ⌘K
          </kbd>
        </div>

        <div className="h-8 w-px bg-border/50" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-xl text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <MessageSquare className="h-5 w-5" strokeWidth={1.75} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-xl text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <Bell className="h-5 w-5" strokeWidth={1.75} />
            <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}
