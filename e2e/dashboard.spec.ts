import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the dashboard header', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible()
    await expect(page.getByText(/Hi, Sarah!/)).toBeVisible()
  })

  test('should display stats cards', async ({ page }) => {
    await expect(page.getByText(/New Booking/i)).toBeVisible()
    await expect(page.getByText(/Available Rooms/i)).toBeVisible()
  })

  test('should have working sidebar navigation', async ({ page }) => {
    await page.getByRole('link', { name: /Bookings/i }).click()
    await expect(page).toHaveURL('/bookings')
    await expect(page.getByRole('heading', { name: /Bookings/i })).toBeVisible()
  })

  test('should toggle dark mode', async ({ page }) => {
    const html = page.locator('html')
    
    await page.getByRole('button', { name: /Toggle theme/i }).click()
    await page.getByRole('menuitem', { name: /Dark/i }).click()
    
    await expect(html).toHaveClass(/dark/)
  })

  test('should open command palette with Cmd+K', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    
    await expect(page.getByPlaceholder(/Type a command/i)).toBeVisible()
  })

  test('should navigate via command palette', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.getByPlaceholder(/Type a command/i).fill('bookings')
    await page.keyboard.press('Enter')
    
    await expect(page).toHaveURL('/bookings')
  })
})
