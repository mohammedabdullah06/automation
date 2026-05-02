const { test, expect } = require('@playwright/test');
const testData = require('../testdata/Login.json');
const formData = require('../testdata/CityPage.json'); 

const user = testData.users[0]; // ✅ FIX

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(baseURL);

  await page.fill('#Username_input', user.username);
  await page.fill('#Password_input', user.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL("https://verstdz.smartfm.cloud/#/Home");

  await page.locator('#flyout-safari > .ssiscsNew').click();

  await page.locator('input[placeholder="Search for Modules, Form"]:visible')
    .fill(formData.form.searchQuery);

  // ✅ Wait for search result
  await expect(page.getByText(formData.form.navText, { exact: false }))
    .toBeVisible();
});

// 🔹 Logout
test.afterEach(async ({ page }) => {
  const logoutBtn = page.getByRole('button', { name: 'Logout' });
  if (await logoutBtn.count() > 0 && await logoutBtn.isVisible()) {
    await logoutBtn.click();
  }
});

// ✅ RBAC Test
test('TC00 - RBAC Access Check', async ({ page }) => {

  const formLink = page.getByText(formData.form.navText, { exact: false });

  if (user.canAccess) {
    await expect(formLink).toBeVisible();
  } else {
    await expect(formLink).toHaveCount(0);
  }
});
// Form tests
test.describe('Form Functional Tests', () => {

  test.skip(!user.canAccess, 'User has no access to this module');

  test.beforeEach(async ({ page }) => {
    const formLink = page.getByText(formData.form.navText, { exact: false });
    await formLink.click();

    await page.getByRole('button', { name: 'Add' }).click();

    await expect(page.locator('#fld3_43_Input')).toBeVisible();
  });

  test('TC01 - Verify Add Form Opens', async ({ page }) => {
    await expect(page.locator('#fld3_43_Input')).toBeVisible();
  });

   // ✅ TC02
      test('TC02 - Fields visible', async ({ page ,  baseURL } ) => {
        for (const field of formData.fields) {
          console.log('Checking field',field.id);
          await expect(page.locator(field.id)).toBeVisible();
        }
  });
   // ✅ TC03
      test('TC03 - Fields are textbox', async ({ page ,  baseURL } ) => {
        console.log('🚀 TC03 started');
        for (const field of formData.fields) {
           console.log('Validating field:', field.id);
          await expect(page.locator(field.id))
            .toHaveJSProperty('tagName', 'INPUT');
             console.log('✅ TC03 completed');
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
          await page.locator(field.id).fill(field.value).click;
          await expect(page.locator(field.id)).toHaveValue(field.value);
        }
      });

});



