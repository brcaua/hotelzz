'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { guests } from '@/data/guests'
import { hotels } from '@/data/hotels'
import { formatCurrency } from '@/lib/patterns'
import { type BookingFormData } from '@/services/booking.service'
import type { Guest, Hotel, PaymentStatus, RoomType } from '@/types'
import { differenceInDays, format } from 'date-fns'
import {
  AlertCircle,
  Building2,
  CalendarDays,
  CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Loader2,
  Search,
  User
} from 'lucide-react'
import { err, ok, Result } from 'neverthrow'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { match, P } from 'ts-pattern'

interface ValidationError {
  field: keyof BookingFormData
  message: string
}

type ValidationResult = Result<BookingFormData, ValidationError[]>

interface NewBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookingCreated?: (booking: BookingFormData & { id: string }) => void
}

const ROOM_TYPES: RoomType[] = ['Standard', 'Deluxe', 'Suite', 'Presidential']

const ROOM_TYPE_MULTIPLIERS: Record<RoomType, number> = {
  'Standard': 1,
  'Deluxe': 1.5,
  'Suite': 2.5,
  'Presidential': 4
}

const SPECIAL_REQUESTS = [
  'Late Check-Out',
  'Early Check-In', 
  'Extra Pillows',
  'Quiet Room',
  'High Floor',
  'Accessible Room',
  'Connecting Rooms',
  'Airport Transfer'
]

const STEPS = [
  { id: 1, title: 'Guest', icon: User },
  { id: 2, title: 'Room', icon: Building2 },
  { id: 3, title: 'Dates', icon: CalendarDays },
  { id: 4, title: 'Review', icon: CreditCard },
] as const

const INITIAL_FORM_DATA: BookingFormData = {
  id: '',
  guestId: '',
  hotelId: '',
  roomType: 'Deluxe',
  roomNumber: '',
  checkIn: null,
  checkOut: null,
  guests: 2,
  requests: [],
  notes: '',
  paymentStatus: 'pending'
}

function validateStep(step: number, data: BookingFormData): ValidationResult {
  const errors: ValidationError[] = []

  match(step)
    .with(1, () => {
      match(data.guestId)
        .with(P.string.length(0), () => 
          errors.push({ field: 'guestId', message: 'Please select a guest' })
        )
        .otherwise(() => {})
    })
    .with(2, () => {
      match(data.hotelId)
        .with(P.string.length(0), () => 
          errors.push({ field: 'hotelId', message: 'Please select a hotel' })
        )
        .otherwise(() => {})
      
      match(data.roomNumber)
        .with(P.string.length(0), () => 
          errors.push({ field: 'roomNumber', message: 'Please enter room number' })
        )
        .otherwise(() => {})
    })
    .with(3, () => {
      match(data.checkIn)
        .with(null, () => 
          errors.push({ field: 'checkIn', message: 'Check-in date is required' })
        )
        .otherwise(() => {})
      
      match(data.checkOut)
        .with(null, () => 
          errors.push({ field: 'checkOut', message: 'Check-out date is required' })
        )
        .otherwise(() => {})
      
      match({ checkIn: data.checkIn, checkOut: data.checkOut })
        .with(
          { checkIn: P.not(null), checkOut: P.not(null) },
          ({ checkIn, checkOut }) => {
            if (checkOut <= checkIn) {
              errors.push({ field: 'checkOut', message: 'Check-out must be after check-in' })
            }
          }
        )
        .otherwise(() => {})
    })
    .otherwise(() => {})

  return errors.length > 0 ? err(errors) : ok(data)
}

function getFieldError(
  errors: ValidationError[], 
  field: keyof BookingFormData
): string | undefined {
  return errors.find(e => e.field === field)?.message
}

interface PriceDetails {
  nights: number
  roomPrice: number
  vat: number
  cityTax: number
  total: number
}

function calculatePrice(
  hotel: Hotel | undefined,
  checkIn: Date | null,
  checkOut: Date | null,
  roomType: RoomType
): PriceDetails | null {
  if (!hotel || !checkIn || !checkOut) return null
  
  const nights = differenceInDays(checkOut, checkIn)
  if (nights <= 0) return null

  const basePrice = hotel.pricePerNight * nights
  const roomMultiplier = ROOM_TYPE_MULTIPLIERS[roomType]
  const roomPrice = basePrice * roomMultiplier
  const vatRate = 0.08
  const cityTaxRate = 0.11
  const vat = roomPrice * vatRate
  const cityTax = roomPrice * cityTaxRate
  const total = roomPrice + vat + cityTax

  return {
    nights,
    roomPrice: Math.round(roomPrice * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    cityTax: Math.round(cityTax * 100) / 100,
    total: Math.round(total * 100) / 100
  }
}

export function NewBookingDialog({ open, onOpenChange, onBookingCreated }: NewBookingDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_DATA)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [guestSearch, setGuestSearch] = useState('')
  const [hotelSearch, setHotelSearch] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const selectedGuest = guests.find(g => g.id === formData.guestId)
  const selectedHotel = hotels.find(h => h.id === formData.hotelId)
  const priceDetails = calculatePrice(
    selectedHotel, 
    formData.checkIn, 
    formData.checkOut, 
    formData.roomType
  )

  const filteredGuests = useMemo(() => {
    if (!guestSearch) return guests.slice(0, 10)
    const query = guestSearch.toLowerCase()
    return guests.filter(g => 
      g.name.toLowerCase().includes(query) ||
      g.email.toLowerCase().includes(query) ||
      g.phone.includes(query)
    ).slice(0, 10)
  }, [guestSearch])

  const filteredHotels = useMemo(() => {
    if (!hotelSearch) return hotels.slice(0, 10)
    const query = hotelSearch.toLowerCase()
    return hotels.filter(h =>
      h.name.toLowerCase().includes(query) ||
      h.location.toLowerCase().includes(query) ||
      h.country.toLowerCase().includes(query)
    ).slice(0, 10)
  }, [hotelSearch])

  const updateField = useCallback(<K extends keyof BookingFormData>(
    field: K, 
    value: BookingFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setValidationErrors(prev => prev.filter(e => e.field !== field))
  }, [])

  const toggleRequest = useCallback((request: string) => {
    setFormData(prev => ({
      ...prev,
      requests: prev.requests.includes(request)
        ? prev.requests.filter(r => r !== request)
        : [...prev.requests, request]
    }))
  }, [])

  const handleNext = useCallback(() => {
    const result = validateStep(currentStep, formData)
    
    result.match(
      () => {
        setValidationErrors([])
        setCurrentStep(prev => Math.min(prev + 1, 4))
      },
      (errors) => {
        setValidationErrors(errors)
        const stepName = match(currentStep)
          .with(1, () => 'guest')
          .with(2, () => 'room')
          .with(3, () => 'dates')
          .otherwise(() => 'form')
        
        toast.error('Please complete all required fields', {
          description: `Check the ${stepName} information before proceeding.`,
        })
      }
    )
  }, [currentStep, formData])

  const handleBack = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setValidationErrors([])
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.1) {
            reject(new Error('Failed to connect to booking service. Please try again.'))
          } else {
            resolve(true)
          }
        }, 1500)
      })

      const newBooking = {
        ...formData,
        checkIn: formData.checkIn!,
        checkOut: formData.checkOut!,
        id: `bkg_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 9)}`
      }

      onBookingCreated?.(newBooking)

      toast.success('Booking created successfully!', {
        description: `Booking for ${selectedGuest?.name} at ${selectedHotel?.name} has been confirmed.`,
      })

      handleClose()
    } catch (error) {
      const errorMessage = match(error)
        .with(P.instanceOf(Error), (e) => e.message)
        .otherwise(() => 'An unexpected error occurred. Please try again.')

      setSubmitError(errorMessage)
      toast.error('Failed to create booking', { description: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, selectedGuest, selectedHotel, onBookingCreated])

  const handleClose = useCallback(() => {
    setFormData(INITIAL_FORM_DATA)
    setCurrentStep(1)
    setGuestSearch('')
    setHotelSearch('')
    setValidationErrors([])
    setSubmitError(null)
    onOpenChange(false)
  }, [onOpenChange])

  const getError = (field: keyof BookingFormData) => 
    getFieldError(validationErrors, field)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Booking</DialogTitle>
          <DialogDescription>
            Fill in the booking details step by step
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-6 px-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    match({ current: currentStep, stepId: step.id })
                      .with({ current: P.when(c => c > step.id) }, () => 
                        'bg-primary border-primary text-primary-foreground'
                      )
                      .with({ current: step.id }, () => 
                        'border-primary text-primary bg-primary/10'
                      )
                      .otherwise(() => 
                        'border-muted-foreground/30 text-muted-foreground'
                      )
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs mt-1 ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-2 mt-[-16px] ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or phone..."
                className="pl-10"
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
              />
            </div>

            {selectedGuest && (
              <Card className="border-primary bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedGuest.avatarUrl} />
                        <AvatarFallback>
                          {selectedGuest.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedGuest.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedGuest.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      Selected
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2 max-h-64 overflow-y-auto">
              <Label className="text-muted-foreground">
                {selectedGuest ? 'Or select another guest:' : 'Select a guest:'}
              </Label>
              {filteredGuests.map((guest) => (
                <GuestCard
                  key={guest.id}
                  guest={guest}
                  isSelected={formData.guestId === guest.id}
                  onSelect={() => updateField('guestId', guest.id)}
                />
              ))}
            </div>
            {getError('guestId') && (
              <p className="text-sm text-destructive">{getError('guestId')}</p>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search hotels by name or location..."
                className="pl-10"
                value={hotelSearch}
                onChange={(e) => setHotelSearch(e.target.value)}
              />
            </div>

            {selectedHotel && (
              <Card className="border-primary bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedHotel.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedHotel.location}, {selectedHotel.country} • {formatCurrency(selectedHotel.pricePerNight)}/night
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      Selected
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2 max-h-40 overflow-y-auto">
              <Label className="text-muted-foreground">
                {selectedHotel ? 'Or select another hotel:' : 'Select a hotel:'}
              </Label>
              {filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  isSelected={formData.hotelId === hotel.id}
                  onSelect={() => updateField('hotelId', hotel.id)}
                />
              ))}
            </div>
            {getError('hotelId') && (
              <p className="text-sm text-destructive">{getError('hotelId')}</p>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Room Type</Label>
                <Select 
                  value={formData.roomType} 
                  onValueChange={(v) => updateField('roomType', v as RoomType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type} ({ROOM_TYPE_MULTIPLIERS[type]}x)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Room Number</Label>
                <Input 
                  value={formData.roomNumber}
                  onChange={(e) => updateField('roomNumber', e.target.value)}
                  placeholder="e.g., 101, 205" 
                />
                {getError('roomNumber') && (
                  <p className="text-sm text-destructive">{getError('roomNumber')}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check-In Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.checkIn ? format(formData.checkIn, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.checkIn ?? undefined}
                      onSelect={(date) => updateField('checkIn', date ?? null)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {getError('checkIn') && (
                  <p className="text-sm text-destructive">{getError('checkIn')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Check-Out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.checkOut ? format(formData.checkOut, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.checkOut ?? undefined}
                      onSelect={(date) => updateField('checkOut', date ?? null)}
                      disabled={(date) => 
                        date < new Date() || 
                        (formData.checkIn !== null && date <= formData.checkIn)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {getError('checkOut') && (
                  <p className="text-sm text-destructive">{getError('checkOut')}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Number of Guests</Label>
              <Select 
                value={String(formData.guests)} 
                onValueChange={(v) => updateField('guests', Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Special Requests</Label>
              <div className="flex flex-wrap gap-2">
                {SPECIAL_REQUESTS.map((request) => (
                  <Badge
                    key={request}
                    variant={formData.requests.includes(request) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleRequest(request)}
                  >
                    {request}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Any special instructions or notes for this booking..."
                rows={3}
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            {submitError && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                <AlertCircle className="size-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Booking failed</p>
                  <p className="text-sm opacity-90">{submitError}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto -mr-2 -mt-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setSubmitError(null)}
                >
                  Dismiss
                </Button>
              </div>
            )}

            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedGuest?.avatarUrl} />
                    <AvatarFallback>
                      {selectedGuest?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedGuest?.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedGuest?.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedGuest?.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Hotel</p>
                    <p className="font-medium">{selectedHotel?.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {selectedHotel?.location}, {selectedHotel?.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Room</p>
                    <p className="font-medium">{formData.roomType} - #{formData.roomNumber}</p>
                    <p className="text-muted-foreground text-xs">{formData.guests} guest(s)</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Check-In</p>
                    <p className="font-medium">
                      {formData.checkIn ? format(formData.checkIn, 'PPP') : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Check-Out</p>
                    <p className="font-medium">
                      {formData.checkOut ? format(formData.checkOut, 'PPP') : '-'}
                    </p>
                  </div>
                </div>

                {formData.requests.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Special Requests</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.requests.map((req) => (
                        <Badge key={req} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{formData.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {priceDetails && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Price Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Room ({priceDetails.nights} night{priceDetails.nights > 1 ? 's' : ''})
                      </span>
                      <span>{formatCurrency(priceDetails.roomPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VAT (8%)</span>
                      <span>{formatCurrency(priceDetails.vat)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City Tax (11%)</span>
                      <span>{formatCurrency(priceDetails.cityTax)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-semibold">
                      <span>Total</span>
                      <span className="text-lg">{formatCurrency(priceDetails.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select 
                value={formData.paymentStatus} 
                onValueChange={(v) => updateField('paymentStatus', v as PaymentStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending Payment</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>

          {currentStep < 4 ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Booking'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function GuestCard({ 
  guest, 
  isSelected, 
  onSelect 
}: { 
  guest: Guest
  isSelected: boolean
  onSelect: () => void 
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:border-primary/50 ${
        isSelected ? 'border-primary bg-primary/5' : ''
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={guest.avatarUrl} />
            <AvatarFallback>{guest.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{guest.name}</p>
              {guest.vipStatus && (
                <Badge variant="secondary" className="text-xs">VIP</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{guest.email}</p>
          </div>
          <p className="text-xs text-muted-foreground">{guest.country}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function HotelCard({ 
  hotel, 
  isSelected, 
  onSelect 
}: { 
  hotel: Hotel
  isSelected: boolean
  onSelect: () => void 
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:border-primary/50 ${
        isSelected ? 'border-primary bg-primary/5' : ''
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="font-medium truncate">{hotel.name}</p>
            <p className="text-xs text-muted-foreground">
              {hotel.location}, {hotel.country}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm">{formatCurrency(hotel.pricePerNight)}</p>
            <p className="text-xs text-muted-foreground">per night</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
