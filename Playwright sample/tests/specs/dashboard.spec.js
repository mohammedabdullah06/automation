import { test, expect } from '@playwright/test';
import users from '../testdata/dashboard.json'; // adjust path if needed

test.describe('Dashboard search textbox', () => {

  for (const user of users) {

    test(`Verify Search Functionality for ${user.username}`, async ({ page,baseURL }) => {

     
      await page.goto(baseURL);

      await page.locator('#Username_input').fill(user.username);
      await page.locator('#Password_input').fill(user.password);
      await page.getByRole('button', { name: /login/i }).click();

      await expect(page).toHaveURL(/Home/);
      

     
      await page.locator('#flyout-safari > .ssiscsNew').click();

      const searchBox = page.getByRole('textbox', {
        name: 'Search for Modules, Form'
      });

      await expect(searchBox).toBeVisible();

      // 🔍 Search using JSON data
     await searchBox.fill(user.searchText);
      await searchBox.press('Enter');

      const moduleOption = page.getByText(user.moduleName);

      if (user.canAccess) {
       
        await expect(moduleOption.first()).toBeVisible({ timeout: 5000 });
        await moduleOption.first().click();
        
        
        await expect(page.getByText('Admin Forms', { exact: false })).toBeVisible();

        const closeBtn = page.locator('.MuiSvgIcon-root.closeBtnTab').first();
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
        }

      } else {
   
        const isVisible = await moduleOption.first().isVisible({ timeout: 2000 }).catch(() => false);
        expect(isVisible).toBe(false);
        await page.getByTitle('clear').click();
        await page.locator('.SearchTemModal > .MuiBackdrop-root').click();
        await page.locator('.MuiGrid-root.displayflex').click();
          const logoutBtn = page.locator('div:nth-child(2) > .sssmi > .sssmidb');
  await logoutBtn.waitFor({ state: 'visible' });
  await logoutBtn.click();
  return
     
        
       
      }

      
      try {
        await page.locator('#flyout-safari').click();
        const logoutBtn = page.getByText(/log out/i);

        if (await logoutBtn.isVisible()) {
          await logoutBtn.click();
          await expect(page).toHaveURL(/login/);
        }
      } catch (e) {
        console.warn(`Logout skipped for ${user.username}`);
      }

    });

  }

});