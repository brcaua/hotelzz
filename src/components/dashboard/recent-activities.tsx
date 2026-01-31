'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useActivities } from '@/hooks/use-dashboard'
import { formatTimeAgo, getActivityConfig } from '@/lib/patterns'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

export function RecentActivities() {
  const { data: activities, isLoading, error } = useActivities(10)

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )
    }

    if (error) {
      return <div className="px-6 py-4 text-sm text-destructive">Error: {error.message}</div>
    }

    return (
      <ScrollArea className="h-[320px]">
        <div className="space-y-1 px-2">
          {activities?.slice(0, 6).map((activity, index) => {
            const config = getActivityConfig(activity.type)
            return (
              <div
                key={activity.id}
                className={cn(
                  "group flex items-start gap-4 rounded-xl px-4 py-3",
                  "transition-all duration-200 hover:bg-muted/50",
                  "animate-fade-up"
                )}
                style={{ animationDelay: `${500 + index * 75}ms` }}
              >
                <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                  <AvatarImage src={activity.guest.avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                    {activity.guest.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{activity.guest.name}</p>
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      config.bgColor,
                      config.color
                    )}>
                      {activity.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    Room {activity.roomNumber} • {activity.action}
                  </p>
                </div>
                <span className="text-xs font-medium text-muted-foreground/70 whitespace-nowrap pt-0.5">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    )
  }

  return (
    <Card className="border-0 bg-card shadow-sm dark:shadow-none dark:border dark:border-border/50 animate-fade-up animation-delay-500">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="font-display text-base font-semibold tracking-tight">
          Recent activities
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 gap-1"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="px-4 pt-0">
        {renderContent()}
      </CardContent>
    </Card>
  )
}
