import { test, expect } from "@playwright/test";
import { SignInPage } from "../models/signinpage";

test.describe("Marketing homepage", () => {
  test("shows the public sign-in entry point", async ({ page }) => {
    const signInPage = new SignInPage(page);

    await page.goto("/");
    await signInPage.acceptCookiesIfVisible();

    await expect(signInPage.landingPageSignInBtn).toBeVisible();
  });

  test("navigates to the sign-in form from the marketing site", async ({ page }) => {
    const signInPage = new SignInPage(page);

    await page.goto("/");
    await signInPage.acceptCookiesIfVisible();
    await signInPage.landingPageSignInBtn.click();

    await expect(signInPage.userEmail).toBeVisible();
    await expect(signInPage.userPassword).toBeVisible();
    await expect(signInPage.signInBtn).toBeVisible();
  });
});
