'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { guests } from '@/data/guests'
import { hotels } from '@/data/hotels'
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MoreHorizontal,
  Search,
  Star,
  ThumbsDown,
  ThumbsUp,
  TrendingUp
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { match, P } from 'ts-pattern'

interface Review {
  id: string
  guestId: string
  hotelId: string
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  response?: string
  createdAt: Date
  helpful: number
  verified: boolean
  categories: {
    cleanliness: number
    service: number
    location: number
    value: number
    amenities: number
  }
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

const reviewTitles = [
  'Amazing stay, will come back!',
  'Perfect location and service',
  'Great experience overall',
  'Wonderful hotel, minor issues',
  'Exceeded expectations',
  'Good value for money',
  'Beautiful property',
  'Friendly staff',
  'Comfortable and clean',
  'Highly recommended'
]

const reviewContents = [
  'The hotel exceeded all our expectations. The staff was incredibly friendly and helpful throughout our stay. The room was spacious, clean, and had a beautiful view.',
  'We had a wonderful time at this hotel. The location is perfect for exploring the city. The breakfast buffet was excellent with many options.',
  'Great experience from check-in to check-out. The concierge helped us with restaurant reservations and local recommendations.',
  'The room was comfortable and well-appointed. The spa facilities were top-notch. Would definitely recommend for a relaxing getaway.',
  'Excellent service and attention to detail. The restaurant served delicious food. The pool area was clean and well-maintained.',
  'Perfect for a business trip. Fast WiFi, comfortable workspace in the room, and great meeting facilities.',
  'The hotel has a beautiful design and the common areas are stunning. Room service was prompt and the food was delicious.',
  'Staff went above and beyond to make our anniversary special. We found champagne and chocolates in our room upon arrival.',
  'Clean, modern, and well-located. The gym was well-equipped and the rooftop bar had amazing views.',
  'Great stay overall. The only minor issue was the noise from the street, but earplugs solved that problem.'
]

const prosOptions = [
  'Excellent location',
  'Friendly staff',
  'Clean rooms',
  'Great breakfast',
  'Beautiful views',
  'Comfortable beds',
  'Fast WiFi',
  'Good restaurant',
  'Nice spa',
  'Quiet rooms'
]

const consOptions = [
  'Small bathroom',
  'Street noise',
  'Slow elevator',
  'Limited parking',
  'Expensive minibar',
  'No gym',
  'Small pool',
  'No room service after 10pm'
]

const reviews: Review[] = Array.from({ length: 50 }, (_, index) => {
  const seed = index * 17 + 1
  const guest = guests[Math.floor(seededRandom(seed) * guests.length)]
  const hotel = hotels[Math.floor(seededRandom(seed + 1) * hotels.length)]
  const rating = Math.floor(seededRandom(seed + 2) * 3) + 3
  const numPros = Math.floor(seededRandom(seed + 3) * 3) + 1
  const numCons = rating < 4 ? Math.floor(seededRandom(seed + 4) * 2) + 1 : Math.floor(seededRandom(seed + 4) * 2)
  
  const shuffledPros = [...prosOptions].sort(() => seededRandom(seed + 5) - 0.5)
  const shuffledCons = [...consOptions].sort(() => seededRandom(seed + 6) - 0.5)

  return {
    id: `rev_${index.toString(36).padStart(6, '0')}`,
    guestId: guest.id,
    hotelId: hotel.id,
    rating,
    title: reviewTitles[index % reviewTitles.length],
    content: reviewContents[index % reviewContents.length],
    pros: shuffledPros.slice(0, numPros),
    cons: shuffledCons.slice(0, numCons),
    response: seededRandom(seed + 7) > 0.6 ? 'Thank you for your wonderful review! We are delighted to hear you enjoyed your stay with us. We look forward to welcoming you back soon.' : undefined,
    createdAt: new Date(Date.now() - Math.floor(seededRandom(seed + 8) * 90) * 24 * 60 * 60 * 1000),
    helpful: Math.floor(seededRandom(seed + 9) * 50),
    verified: seededRandom(seed + 10) > 0.2,
    categories: {
      cleanliness: Math.floor(seededRandom(seed + 11) * 2) + 4,
      service: Math.floor(seededRandom(seed + 12) * 2) + 4,
      location: Math.floor(seededRandom(seed + 13) * 2) + 4,
      value: Math.floor(seededRandom(seed + 14) * 2) + 3,
      amenities: Math.floor(seededRandom(seed + 15) * 2) + 3
    }
  }
})

function getStarColor(rating: number) {
  return match(rating)
    .with(5, () => 'text-amber-500')
    .with(4, () => 'text-amber-500')
    .with(3, () => 'text-amber-400')
    .with(2, () => 'text-amber-300')
    .otherwise(() => 'text-amber-200')
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  return match(diffDays)
    .with(0, () => 'Today')
    .with(1, () => 'Yesterday')
    .with(P.when(d => d < 7), () => `${diffDays} days ago`)
    .with(P.when(d => d < 30), () => `${Math.floor(diffDays / 7)} weeks ago`)
    .otherwise(() => `${Math.floor(diffDays / 30)} months ago`)
}

type SortField = 'createdAt' | 'rating' | 'helpful'
type SortDirection = 'asc' | 'desc'

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const stats = useMemo(() => {
    const totalReviews = reviews.length
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    const fiveStarCount = reviews.filter(r => r.rating === 5).length
    const responseRate = (reviews.filter(r => r.response).length / totalReviews) * 100
    
    return {
      totalReviews,
      avgRating: Math.round(avgRating * 10) / 10,
      fiveStarPercent: Math.round((fiveStarCount / totalReviews) * 100),
      responseRate: Math.round(responseRate)
    }
  }, [])

  const filteredReviews = useMemo(() => {
    return reviews
      .filter(review => {
        const guest = guests.find(g => g.id === review.guestId)
        const hotel = hotels.find(h => h.id === review.hotelId)
        const matchesSearch = !searchQuery || 
          guest?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.title.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter)
        
        return matchesSearch && matchesRating
      })
      .sort((a, b) => {
        const modifier = sortDirection === 'asc' ? 1 : -1
        return match(sortField)
          .with('createdAt', () => modifier * (a.createdAt.getTime() - b.createdAt.getTime()))
          .with('rating', () => modifier * (a.rating - b.rating))
          .with('helpful', () => modifier * (a.helpful - b.helpful))
          .exhaustive()
      })
  }, [searchQuery, ratingFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">Manage and respond to guest reviews</p>
        </div>
        <Button size="sm">Export Reviews</Button>
      </div>

      <div className="grid grid-cols-4 gap-4 animate-fade-up animation-delay-100">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{stats.totalReviews}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{stats.avgRating}</p>
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">5-Star Reviews</p>
                <p className="text-2xl font-bold">{stats.fiveStarPercent}%</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                <Star className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{stats.responseRate}%</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50">
                <MessageSquare className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade-up animation-delay-200">
        <CardHeader className="flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-lg">All Reviews</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                className="w-64 pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 border rounded-md">
              <Button 
                variant={sortField === 'createdAt' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => handleSort('createdAt')}
              >
                Recent
                {sortField === 'createdAt' && (
                  sortDirection === 'desc' ? <ChevronDown className="ml-1 h-3 w-3" /> : <ChevronUp className="ml-1 h-3 w-3" />
                )}
              </Button>
              <Button 
                variant={sortField === 'rating' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => handleSort('rating')}
              >
                Rating
                {sortField === 'rating' && (
                  sortDirection === 'desc' ? <ChevronDown className="ml-1 h-3 w-3" /> : <ChevronUp className="ml-1 h-3 w-3" />
                )}
              </Button>
              <Button 
                variant={sortField === 'helpful' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => handleSort('helpful')}
              >
                Helpful
                {sortField === 'helpful' && (
                  sortDirection === 'desc' ? <ChevronDown className="ml-1 h-3 w-3" /> : <ChevronUp className="ml-1 h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredReviews.slice(0, 20).map((review) => {
              const guest = guests.find(g => g.id === review.guestId)
              const hotel = hotels.find(h => h.id === review.hotelId)
              
              return (
                <div key={review.id} className="p-6 hover:bg-muted/20 transition-colors">
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={guest?.avatarUrl} />
                      <AvatarFallback>
                        {guest?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{guest?.name}</p>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{hotel?.name}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(review.createdAt)}</p>
                        </div>
                      </div>

                      <div>
                        <p className="font-medium">{review.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{review.content}</p>
                      </div>

                      <div className="flex gap-6">
                        {review.pros.length > 0 && (
                          <div className="flex items-start gap-2">
                            <ThumbsUp className="h-4 w-4 text-emerald-600 mt-0.5" />
                            <div className="text-sm">
                              {review.pros.map((pro, i) => (
                                <span key={pro}>
                                  {pro}{i < review.pros.length - 1 && ', '}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {review.cons.length > 0 && (
                          <div className="flex items-start gap-2">
                            <ThumbsDown className="h-4 w-4 text-rose-600 mt-0.5" />
                            <div className="text-sm">
                              {review.cons.map((con, i) => (
                                <span key={con}>
                                  {con}{i < review.cons.length - 1 && ', '}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {review.response && (
                        <div className="bg-muted/50 rounded-lg p-3 mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Hotel Response</p>
                          <p className="text-sm">{review.response}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            Helpful ({review.helpful})
                          </Button>
                          {!review.response && (
                            <Button variant="ghost" size="sm" className="text-primary">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              Respond
                            </Button>
                          )}
                        </div>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
