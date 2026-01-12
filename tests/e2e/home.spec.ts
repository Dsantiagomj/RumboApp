import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');

    // Check for the main heading
    await expect(page.getByRole('heading', { name: /Rumbo/i })).toBeVisible();

    // Check for the design system showcase
    await expect(page.getByRole('heading', { name: /AI-Powered Life Assistant/i })).toBeVisible();
  });

  test('should have working theme toggle', async ({ page }) => {
    await page.goto('/');

    // Find the theme toggle button
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();

    // Click to toggle theme
    await themeToggle.click();

    // Wait for theme to change (this is a basic check)
    await page.waitForTimeout(100);
  });

  test('should display all button variants', async ({ page }) => {
    await page.goto('/');

    // Check that button variants are visible
    await expect(page.getByRole('button', { name: /Primary Button/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Secondary/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Destructive/i })).toBeVisible();
  });
});
