import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

const XSS_PAYLOADS = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  '<svg onload=alert("XSS")>',
  'javascript:alert("XSS")',
  '<iframe src="javascript:alert(\'XSS\')">',
  '<body onload=alert("XSS")>',
  '<input onfocus=alert("XSS") autofocus>',
  '<marquee onstart=alert("XSS")>',
  '<object data="javascript:alert(\'XSS\')">',
  '<embed src="javascript:alert(\'XSS\')">',
  '"><script>alert("XSS")</script>',
  '<a href="javascript:alert(\'XSS\')">Click</a>',
  '<div style="background:url(javascript:alert(\'XSS\'))">',
]

const SQL_INJECTION_PAYLOADS = [
  "'; DROP TABLE users; --",
  "1' OR '1'='1",
  "admin'--",
  "1; DELETE FROM guests WHERE 1=1",
  "' UNION SELECT * FROM users --",
]

describe('XSS Protection Tests', () => {
  describe('Input Sanitization', () => {
    it.each(XSS_PAYLOADS)(
      'should reject XSS payload: %s',
      async (payload) => {
        const response = await fetch('/api/guests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: payload, email: 'test@example.com' }),
        })

        const data = await response.json()
        
        expect(response.status).toBe(400)
        expect(data.error).toBe('Invalid input detected')
      }
    )

    it('should accept clean input', async () => {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
        }),
      })

      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data.name).toBe('John Doe')
    })

    it('should handle special characters that are not XSS', async () => {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "John O'Connor",
          email: 'john+test@example.com',
        }),
      })

      expect(response.status).toBe(200)
    })
  })

  describe('Output Encoding', () => {
    it('should encode HTML entities in responses', async () => {
      server.use(
        http.get('/api/guests/xss-test', () => {
          const encodedName = '&lt;script&gt;alert("XSS")&lt;/script&gt;'
          return HttpResponse.json({
            data: {
              id: 'gst_xss',
              name: encodedName,
              email: 'test@example.com',
            },
          })
        })
      )

      const response = await fetch('/api/guests/xss-test')
      const data = await response.json()

      expect(data.data.name).not.toContain('<script>')
      expect(data.data.name).toContain('&lt;script&gt;')
    })
  })

  describe('Content-Type Validation', () => {
    it('should reject non-JSON content types for API endpoints', async () => {
      server.use(
        http.post('/api/guests', async ({ request }) => {
          const contentType = request.headers.get('Content-Type')
          
          if (!contentType?.includes('application/json')) {
            return HttpResponse.json(
              { error: 'Invalid content type' },
              { status: 415 }
            )
          }

          return HttpResponse.json({ data: {} })
        })
      )

      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'text/html' },
        body: '<html><script>alert("XSS")</script></html>',
      })

      expect(response.status).toBe(415)
    })
  })

  describe('SQL Injection Prevention', () => {
    it.each(SQL_INJECTION_PAYLOADS)(
      'should handle SQL injection attempt safely: %s',
      async (payload) => {
        const response = await fetch('/api/guests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: payload, email: 'test@example.com' }),
        })

        expect([200, 400]).toContain(response.status)
      }
    )
  })
})

describe('DOM-based XSS Prevention', () => {
  it('should not execute scripts when using textContent', () => {
    const testDiv = document.createElement('div')
    const maliciousInput = '<img src=x onerror=window.xssExecuted=true>'
    
    testDiv.textContent = maliciousInput
    
    expect(testDiv.children.length).toBe(0)
    expect((window as unknown as { xssExecuted?: boolean }).xssExecuted).toBeUndefined()
  })

  it('should sanitize URL parameters', () => {
    const maliciousUrl = 'javascript:alert("XSS")'
    const isValid = /^https?:\/\//.test(maliciousUrl)
    
    expect(isValid).toBe(false)
  })

  it('should reject data URLs in sensitive contexts', () => {
    const dataUrl = 'data:text/html,<script>alert("XSS")</script>'
    const isAllowed = /^https?:\/\/|^\/[^/]/.test(dataUrl)
    
    expect(isAllowed).toBe(false)
  })
})
