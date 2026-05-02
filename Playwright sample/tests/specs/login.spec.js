const { test, expect } = require('@playwright/test');
const testData = require('../testdata/loginData.json');

// Reusable logout function
async function logout(page,baseURL) {
    
    await page.locator('.MuiGrid-root.displayflex').click();
    await page.locator('div:nth-child(3) > .sssmicc').click();
    await page.getByRole('menuitem', { name: 'Log out' }).click();
    await page.goto(testData.navigation.logout);
   
   
}

// Runs before every test
test.beforeEach(async ({ page, baseURL  }) => {
  await page.goto(baseURL);
});


// ✅ Test Case 1: Invalid username or password
test('Invalid username or password', async ({ page }) => {
  await page.fill('#Username_input', testData.users.invalidUser.username);
  await page.fill('#Password_input', testData.users.invalidUser.password);
  await page.getByRole('button', { name: 'logins' }).click();

  await expect(
    page.locator(`text=${testData.expectedMessages.invalidLogin}`)
  ).toBeVisible();
});


// ✅ Test Case 2: Password Should Not Be Empty
test('Password Should Not Be Empty', async ({ page }) => {
  await page.fill('#Username_input', testData.users.emptyPassword.username);
  await page.fill('#Password_input', testData.users.emptyPassword.password);
  await page.getByRole('button', { name: 'login' }).click();

  await expect(page.getByRole('alert')).toContainText(
    testData.expectedMessages.emptyPassword
  );
});


// ✅ Test Case 3: Login Success + Logout
test('Login success and logout', async ({ page, baseURL}) => {
  await page.fill('#Username_input', testData.users.validUser.username);
  await page.fill('#Password_input', testData.users.validUser.password);
  await page.getByRole('button', { name: 'login' }).click();

  // Verify navigation to home
  await expect(page).toHaveURL(testData.navigation.home);
  //await expect(page).toHaveURL(`${baseURL}${testData.navigation.home}`);

  // Logout
  await logout(page);

  // Verify back to login page
  await expect(page).toHaveURL(testData.navigation.logout);
  // await expect(page).toHaveURL(`${baseURL}${testData.navigation.logout}`);
});


// ✅ Test Case 4: Username Should Not Be Empty
test('Username Should Not Be Empty', async ({ page }) => {
  await page.fill('#Username_input', testData.users.emptyUsername.username);
  await page.fill('#Password_input', testData.users.emptyUsername.password);
  await page.getByRole('button', { name: 'login' }).click();

  await expect(page.getByRole('alert')).toContainText(
    testData.expectedMessages.emptyUsername
  );
});