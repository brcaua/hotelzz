import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate through all main pages', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
    
    await page.getByRole('link', { name: /Bookings/i }).click()
    await expect(page).toHaveURL('/bookings')
    
    await page.getByRole('link', { name: /Guests/i }).click()
    await expect(page).toHaveURL('/guests')
    
    await page.getByRole('link', { name: /Messages/i }).click()
    await expect(page).toHaveURL('/messages')
    
    await page.getByRole('link', { name: /Reviews/i }).click()
    await expect(page).toHaveURL('/reviews')
    
    await page.getByRole('link', { name: /Dashboard/i }).click()
    await expect(page).toHaveURL('/')
  })

  test('should highlight active navigation item', async ({ page }) => {
    await page.goto('/bookings')
    
    const bookingsLink = page.getByRole('link', { name: /Bookings/i })
    await expect(bookingsLink).toHaveClass(/bg-primary/)
  })

  test('should display sidebar logo', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText('Hotelzz')).toBeVisible()
  })
})

test.describe('Responsive Behavior', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    await expect(page.getByText(/Hi, Sarah!/)).toBeVisible()
  })
})
