import { http, HttpResponse } from 'msw'

const mockGuests = [
  {
    id: 'gst_001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 555 123 456',
    country: 'USA',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe',
    totalStays: 5,
    vipStatus: true,
  },
  {
    id: 'gst_002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+44 555 789 012',
    country: 'UK',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JaneSmith',
    totalStays: 2,
    vipStatus: false,
  },
]

const mockBookings = [
  {
    id: 'bkg_001',
    guestId: 'gst_001',
    guest: mockGuests[0],
    roomNumber: '101',
    checkIn: new Date('2026-01-20'),
    checkOut: new Date('2026-01-25'),
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 750,
    isOnline: true,
    createdAt: new Date('2026-01-15'),
  },
]

const mockUser = {
  id: 'usr_001',
  email: 'admin@hotel.com',
  name: 'Admin User',
  role: 'admin',
  sessionToken: 'valid_session_token_123',
}

export const handlers = [
  http.get('/api/guests', () => {
    return HttpResponse.json({ data: mockGuests })
  }),

  http.get('/api/guests/:id', ({ params }) => {
    const guest = mockGuests.find(g => g.id === params.id)
    if (!guest) {
      return HttpResponse.json({ error: 'Guest not found' }, { status: 404 })
    }
    return HttpResponse.json({ data: guest })
  }),

  http.get('/api/bookings', () => {
    return HttpResponse.json({ data: mockBookings })
  }),

  http.get('/api/bookings/:id', ({ params }) => {
    const booking = mockBookings.find(b => b.id === params.id)
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    return HttpResponse.json({ data: booking })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email?: string; password?: string }
    
    if (body.email === 'admin@hotel.com' && body.password === 'password123') {
      return HttpResponse.json({
        data: mockUser,
        token: 'valid_session_token_123',
      })
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    if (token !== 'valid_session_token_123') {
      return HttpResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return HttpResponse.json({ data: mockUser })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/bookings', async ({ request }) => {
    const csrfToken = request.headers.get('X-CSRF-Token')
    
    if (!csrfToken || csrfToken !== 'valid_csrf_token') {
      return HttpResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      )
    }

    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({
      data: {
        id: 'bkg_new',
        ...body,
        createdAt: new Date(),
      },
    })
  }),

  http.post('/api/guests', async ({ request }) => {
    const body = await request.json() as { name?: string; email?: string }
    
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ]
    
    const hasXSS = Object.values(body).some(value => {
      if (typeof value !== 'string') return false
      return xssPatterns.some(pattern => pattern.test(value))
    })

    if (hasXSS) {
      return HttpResponse.json(
        { error: 'Invalid input detected' },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      data: {
        id: 'gst_new',
        ...body,
      },
    })
  }),

  http.get('/api/admin/users', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return HttpResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      data: [mockUser],
    })
  }),

  http.delete('/api/admin/users/:id', ({ request, params }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader) {
      return HttpResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (params.id === 'usr_001') {
      return HttpResponse.json(
        { error: 'Cannot delete own account' },
        { status: 403 }
      )
    }

    return HttpResponse.json({ success: true })
  }),
]
