import { test, expect } from '@playwright/test'

test.describe('Bookings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bookings')
  })

  test('should display bookings list', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Bookings/i })).toBeVisible()
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('should have New Booking button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /New Booking/i })).toBeVisible()
  })

  test('should open new booking dialog', async ({ page }) => {
    await page.getByRole('button', { name: /New Booking/i }).click()
    
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText(/Create New Booking/i)).toBeVisible()
  })

  test('should search bookings', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search by name/i)
    await searchInput.fill('John')
    
    await page.waitForTimeout(500)
  })

  test('should navigate to booking details', async ({ page }) => {
    const firstBookingRow = page.locator('tbody tr').first()
    await firstBookingRow.click()
    
    await expect(page.getByText(/Booking Details/i)).toBeVisible()
  })

  test('should display booking statuses', async ({ page }) => {
    const statusBadges = page.locator('[class*="badge"]')
    await expect(statusBadges.first()).toBeVisible()
  })
})

test.describe('Booking Creation Flow', () => {
  test('should complete booking creation wizard', async ({ page }) => {
    await page.goto('/bookings')
    
    await page.getByRole('button', { name: /New Booking/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    
    const searchGuest = page.getByPlaceholder(/Search guests/i)
    if (await searchGuest.isVisible()) {
      await searchGuest.click()
    }
    
    const guestCard = page.locator('[data-testid="guest-card"]').first()
    if (await guestCard.isVisible()) {
      await guestCard.click()
    }
  })
})
