import { test, expect } from '@playwright/test';

test.describe('Login Module', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/hwwebapp#/auth/login');

    // ✅ Wait for login page to load properly
    await expect(
      page.getByRole('textbox', { name: 'Enter your username' })
    ).toBeVisible({ timeout: 10000 });
  });

  // ✅ Positive Test
  test('Valid login', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('nurse1');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Nurse@123');

    await page.getByRole('button', { name: 'Select Role' }).click();
    await page.getByRole('checkbox').check();

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText('Welcome')).toBeVisible();
  });

  // ❌ Blank Inputs
  test('Login with blank username and password', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Username is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  // ❌ Invalid Username
  test('Login with invalid username', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('wrongUser');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Nurse@123');

    await page.getByRole('button', { name: 'Select Role' }).click();
    await page.getByRole('checkbox').check();

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('.Toastify__toast--error'))
      .toContainText('Login Failed', { timeout: 7000 });
  });

  // ❌ Invalid Password
  test('Login with invalid password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('nurse1');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('WrongPass');

    await page.getByRole('button', { name: 'Select Role' }).click();
    await page.getByRole('checkbox').check();

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('.Toastify__toast--error'))
      .toContainText('Login Failed', { timeout: 7000 });
  });

});