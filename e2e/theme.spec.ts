import { test, expect } from '@playwright/test'

test.describe('Theme Switching', () => {
  test('should switch to dark mode', async ({ page }) => {
    await page.goto('/')
    
    await page.getByRole('button', { name: /Toggle theme/i }).click()
    await page.getByRole('menuitem', { name: /Dark/i }).click()
    
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })

  test('should switch to light mode', async ({ page }) => {
    await page.goto('/')
    
    await page.getByRole('button', { name: /Toggle theme/i }).click()
    await page.getByRole('menuitem', { name: /Dark/i }).click()
    
    await page.getByRole('button', { name: /Toggle theme/i }).click()
    await page.getByRole('menuitem', { name: /Light/i }).click()
    
    const html = page.locator('html')
    await expect(html).toHaveClass(/light/)
  })

  test('should persist theme preference', async ({ page }) => {
    await page.goto('/')
    
    await page.getByRole('button', { name: /Toggle theme/i }).click()
    await page.getByRole('menuitem', { name: /Dark/i }).click()
    
    await page.reload()
    
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })

  test('should respect system preference', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    
    await page.getByRole('button', { name: /Toggle theme/i }).click()
    await page.getByRole('menuitem', { name: /System/i }).click()
    
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })
})
