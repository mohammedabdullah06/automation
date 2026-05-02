const { test, expect } = require('@playwright/test');
const testData = require('../testdata/Login.json');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('valid username or password', async ({ page }) => {
  await page.fill('#Username_input', testData.users[0].username);
  await page.fill('#Password_input', testData.users[0].password);
  await page.getByRole('button', { name: 'Login' }).click();


  await expect(page).toHaveURL("https://verstdz.smartfm.cloud/#/Home"); // better validation
}); 