'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { guests } from '@/data/guests'
import {
  Archive, CheckCheck,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Star,
  Video
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { match, P } from 'ts-pattern'

interface Message {
  id: string
  content: string
  timestamp: Date
  isFromGuest: boolean
  read: boolean
}

interface Conversation {
  id: string
  guestId: string
  roomNumber: string
  subject: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  starred: boolean
  archived: boolean
  messages: Message[]
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

const subjects = [
  'Room Service Request',
  'Late Checkout Request',
  'Reservation Question',
  'Spa Booking',
  'Transportation Inquiry',
  'Special Occasion',
  'Complaint',
  'Feedback',
  'Amenities Question',
  'General Inquiry'
]

const guestMessages = [
  'Hi, I would like to request room service for dinner tonight. Could you send me the menu?',
  'Is it possible to arrange a late checkout tomorrow? We have a late flight.',
  'I noticed a small issue with the air conditioning in our room. Could someone take a look?',
  'We are celebrating our anniversary. Is there any special arrangement possible?',
  'Could you help us book a spa treatment for tomorrow afternoon?',
  'What time does the pool close? We would like to take a swim before dinner.',
  'The WiFi seems to be slow. Is there a premium option available?',
  'We need an extra towel set delivered to our room please.',
  'Can we get a restaurant recommendation for tonight? Looking for Italian cuisine.',
  'Is airport transfer available? We need to catch a morning flight.'
]

const staffResponses = [
  'Of course! I will send the room service menu to your room right away. Is there anything specific you are craving?',
  'Absolutely, I have arranged a late checkout for you until 2 PM. Have a safe flight!',
  'I apologize for the inconvenience. Our maintenance team will be there within 15 minutes.',
  'Happy Anniversary! We have arranged a complimentary bottle of champagne and chocolate-covered strawberries for your room.',
  'The spa is available tomorrow at 2 PM and 4 PM. Which time works better for you?',
  'The pool is open until 10 PM. Would you like me to reserve poolside dining for you?',
  'I have upgraded your WiFi to our premium tier at no extra charge. Please reconnect to see improved speeds.',
  'Extra towels are on their way! Is there anything else you need?',
  'I highly recommend La Trattoria, just 5 minutes walk from the hotel. Would you like me to make a reservation?',
  'Yes, we offer airport transfers. I will arrange a car for you. What time is your flight?'
]

const conversations: Conversation[] = Array.from({ length: 30 }, (_, index) => {
  const seed = index * 23 + 1
  const guest = guests[Math.floor(seededRandom(seed) * guests.length)]
  const numMessages = Math.floor(seededRandom(seed + 1) * 8) + 2
  const baseTime = Date.now() - Math.floor(seededRandom(seed + 2) * 7) * 24 * 60 * 60 * 1000
  
  const messages: Message[] = Array.from({ length: numMessages }, (_, msgIndex) => {
    const isFromGuest = msgIndex % 2 === 0
    const messageTime = new Date(baseTime + msgIndex * 5 * 60 * 1000)
    
    return {
      id: `msg_${index}_${msgIndex}`,
      content: isFromGuest 
        ? guestMessages[(seed + msgIndex) % guestMessages.length]
        : staffResponses[(seed + msgIndex) % staffResponses.length],
      timestamp: messageTime,
      isFromGuest,
      read: msgIndex < numMessages - 1 || seededRandom(seed + msgIndex) > 0.3
    }
  })

  const lastMsg = messages[messages.length - 1]
  const unreadCount = messages.filter(m => m.isFromGuest && !m.read).length

  return {
    id: `conv_${index.toString(36).padStart(6, '0')}`,
    guestId: guest.id,
    roomNumber: `${Math.floor(seededRandom(seed + 3) * 9) + 1}${String(Math.floor(seededRandom(seed + 4) * 50) + 1).padStart(2, '0')}`,
    subject: subjects[index % subjects.length],
    lastMessage: lastMsg.content,
    lastMessageTime: lastMsg.timestamp,
    unreadCount,
    starred: seededRandom(seed + 5) > 0.8,
    archived: seededRandom(seed + 6) > 0.9,
    messages
  }
}).filter(c => !c.archived).sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime())

function formatTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  return match(diffDays)
    .with(0, () => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date))
    .with(1, () => 'Yesterday')
    .with(P.when(d => d < 7), () => new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date))
    .otherwise(() => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date))
}

function formatMessageTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }).format(date)
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0])
  const [newMessage, setNewMessage] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all')

  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      const guest = guests.find(g => g.id === conv.guestId)
      const matchesSearch = !searchQuery || 
        guest?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.roomNumber.includes(searchQuery)
      
      const matchesFilter = match(filter)
        .with('all', () => true)
        .with('unread', () => conv.unreadCount > 0)
        .with('starred', () => conv.starred)
        .exhaustive()
      
      return matchesSearch && matchesFilter
    })
  }, [searchQuery, filter])

  const unreadTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return
    setNewMessage('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            {unreadTotal > 0 ? `${unreadTotal} unread messages` : 'All caught up!'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-220px)] animate-fade-up animation-delay-100">
        <Card className="col-span-4 flex flex-col">
          <CardHeader className="border-b pb-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'unread' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setFilter('unread')}
                className="gap-1"
              >
                Unread
                {unreadTotal > 0 && (
                  <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                    {unreadTotal}
                  </Badge>
                )}
              </Button>
              <Button 
                variant={filter === 'starred' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setFilter('starred')}
              >
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredConversations.map((conv) => {
                const guest = guests.find(g => g.id === conv.guestId)
                const isSelected = selectedConversation?.id === conv.id
                
                return (
                  <div
                    key={conv.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                      isSelected ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="flex gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={guest?.avatarUrl} />
                          <AvatarFallback>
                            {guest?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`font-medium truncate ${conv.unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {guest?.name}
                          </p>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatTime(conv.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Room {conv.roomNumber}</p>
                        <p className={`text-sm truncate mt-1 ${conv.unreadCount > 0 ? 'font-medium' : 'text-muted-foreground'}`}>
                          {conv.lastMessage}
                        </p>
                      </div>
                      {conv.starred && (
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500 shrink-0" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </Card>

        <Card className="col-span-8 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={guests.find(g => g.id === selectedConversation.guestId)?.avatarUrl} />
                      <AvatarFallback>
                        {guests.find(g => g.id === selectedConversation.guestId)?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {guests.find(g => g.id === selectedConversation.guestId)?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Room {selectedConversation.roomNumber} • {selectedConversation.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Star className={`h-4 w-4 ${selectedConversation.starred ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message, index) => {
                    const showDate = index === 0 || 
                      new Date(message.timestamp).toDateString() !== 
                      new Date(selectedConversation.messages[index - 1].timestamp).toDateString()
                    
                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="flex items-center justify-center my-4">
                            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                              {new Intl.DateTimeFormat('en-US', { 
                                weekday: 'long', 
                                month: 'short', 
                                day: 'numeric' 
                              }).format(message.timestamp)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${message.isFromGuest ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[70%] ${
                            message.isFromGuest 
                              ? 'bg-muted rounded-2xl rounded-bl-md' 
                              : 'bg-primary text-primary-foreground rounded-2xl rounded-br-md'
                          } px-4 py-2`}>
                            <p className="text-sm">{message.content}</p>
                            <div className={`flex items-center justify-end gap-1 mt-1 ${
                              message.isFromGuest ? 'text-muted-foreground' : 'text-primary-foreground/70'
                            }`}>
                              <span className="text-[10px]">{formatMessageTime(message.timestamp)}</span>
                              {!message.isFromGuest && (
                                <CheckCheck className="h-3 w-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea
                    placeholder="Type a message..."
                    className="min-h-[44px] max-h-32 resize-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <Button size="icon" className="shrink-0" onClick={handleSend} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to view messages
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
