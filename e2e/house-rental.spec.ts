import { test, expect } from '@playwright/test';

test.describe('House Rental Platform', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('full user flow: browse, search, favorite, add house', async ({ page }) => {
    // 1. Load houses
    await expect(page.getByText('Beachfront Villa')).toBeVisible();
    
    // 2. Search by location
    await page.click('text=Rentals');
    await page.fill('input[placeholder="City, state..."]', 'Malibu');
    await page.waitForTimeout(300); // Debounce delay
    
    // 3. Click details
    await page.click('text=Beachfront Villa');
    await expect(page.getByRole('heading', { name: 'Beachfront Villa' })).toBeVisible();
    
    // 4. Add to favorites
    await page.click('button:has-text("🤍")');
    
    // 5. Go to favorites page
    await page.click('text=Favorites');
    await expect(page.getByText('Beachfront Villa')).toBeVisible();
    
    // 6. Add new house
    await page.click('text=Add House');
    await page.fill('input[name="title"]', 'Test House');
    await page.fill('input[name="price"]', '500');
    await page.fill('input[name="location"]', 'Test City');
    await page.fill('input[name="bedrooms"]', '3');
    await page.fill('input[name="bathrooms"]', '2');
    await page.fill('input[name="imageUrl"]', 'https://example.com/test.jpg');
    await page.click('button[type="submit"]');
    
    // 7. Verify it appears
    await expect(page.getByText('Test House')).toBeVisible();
  });

  test('form validation works', async ({ page }) => {
    await page.click('text=Add House');
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.getByText('at least 3 characters')).toBeVisible();
    await expect(page.getByText('positive number')).toBeVisible();
  });

  test('responsive layout - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('House Rental')).toBeVisible();
    // Check mobile menu
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});