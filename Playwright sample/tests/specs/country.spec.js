const { test, expect } = require('@playwright/test');
const usersData = require('../testdata/login.json');
const formData = require('../testdata/country.json');

for (const user of usersData.users) {

  test.describe(`Country Form - ${user.username} (${user.role})`, () => {

    // 🔹 Login before each test
    test.beforeEach(async ({ page ,  baseURL } ) => {
      await page.goto(baseURL);

      await page.locator('#Username_input').fill(user.username);
      await page.locator('#Password_input').fill(user.password);
      await page.getByRole('button', { name: 'login' }).click();

      await expect(page).toHaveURL(/Home/);

      // Navigate to module
      await page.locator('#flyout-safari > .ssiscsNew').click();

      await page.getByRole('textbox', { name: 'Search for Modules, Form' })
        .fill(formData.form.searchQuery);
    });

    // 🔹 Logout
    test.afterEach(async ({ page ,  baseURL } ) => {
      const logoutBtn = page.getByRole('button', { name: 'Logout' });
      if (await logoutBtn.isVisible()) {
        await logoutBtn.click();
      }
    });

    // ✅ TC00 - RBAC Validation (IMPORTANT)
    test('TC00 - RBAC Access Check', async ({ page ,  baseURL } ) => {

      const formLink = page.getByText(formData.form.navText);

      if (user.canAccess) {
        await expect(formLink).toBeVisible();
      } else {
        await expect(formLink).toHaveCount(0);
      }
    });

    // 🔥 Group all form tests
    test.describe('Form Functional Tests', () => {

      // ⛔ Skip all below tests if user has no access
      test.beforeEach(async ({ page ,  baseURL } ) => {

        if (!user.canAccess) {
          test.skip(true, 'User has no access to this module');
        }

        const formLink = page.getByText(formData.form.navText);
        await formLink.click();

        await page.getByRole('button', { name: 'Add' }).click();
      });

      // ✅ TC01
      test('TC01 - Form should open', async ({ page ,  baseURL } ) => {
        await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
      });

      // ✅ TC02
      test('TC02 - Fields visible', async ({ page ,  baseURL } ) => {
        for (const field of formData.fields) {
          await expect(page.locator(field.id)).toBeVisible();
        }
      });

      // ✅ TC03
      test('TC03 - Fields are textbox', async ({ page ,  baseURL } ) => {
        for (const field of formData.fields) {
          await expect(page.locator(field.id))
            .toHaveJSProperty('tagName', 'INPUT');
        }
      });

      // ✅ TC04
      test('TC04 - Placeholder validation', async ({ page ,  baseURL } ) => {
        for (const field of formData.fields) {
          await expect(page.locator(field.id))
            .toHaveAttribute('placeholder', ' ');
        }
      });

      // ✅ TC05
      test('TC05 - Fill fields', async ({ page ,  baseURL } ) => {
        for (const field of formData.fields) {
          await page.locator(field.id).fill(field.value);
          await expect(page.locator(field.id)).toHaveValue(field.value);
        }
      });

      // ✅ TC06
      test('TC06 - Reset form', async ({ page ,  baseURL } ) => {
        await page.locator(formData.fields[0].id).fill('Test');
        await page.getByTitle('clear').click();
        await expect(page.locator(formData.fields[0].id)).toHaveValue('');
      });

      // ✅ TC07
      test('TC07 - Action Refresh', async ({ page ,  baseURL } ) => {
        for (const action of formData.actions) {
          const locator = page.locator(action.id).getByText(action.name);
          await expect(locator).toBeVisible();
          await locator.click();
        }
      });

      // ✅ TC08
      test('TC08 - Filter Data', async ({ page ,  baseURL } ) => {

        const filterPanel = page.locator('#AdminCountryRegistryFilterDiv');

        await page.locator('#AdminCountryRegistryfildiv')
          .getByText('Filter Data')
          .click();

        await filterPanel.getByText('Filter').click();

        for (const filter of formData.filters) {

          await filterPanel.getByText(filter.name).click();

          const input = page.getByRole('textbox', { name: filter.placeholder });
          await input.click();

          await page.locator('#fld4L1TFCScrollYDefault div')
            .filter({ hasText: new RegExp(`^${filter.value}$`) })
            .click();
        }

        await page.getByRole('button', { name: 'Search' }).click();

        for (const filter of formData.filters) {
          await expect(page.getByText(`${filter.name}${filter.value}`))
            .toBeVisible();
        }

      });

    });

  });

}