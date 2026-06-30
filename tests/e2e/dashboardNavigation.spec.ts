import { test, expect } from "@playwright/test";
import fs from "fs/promises";
import { BasePage } from "../models/basepage";

const workspaceSections = ["Project management", "Financials"];

test.describe("Dashboard navigation", () => {
  let basePage: BasePage;

  test.beforeEach(({ page }) => {
    basePage = new BasePage(page);
  });

  test("shows core sidebar sections after login", async ({ page }) => {
    const { email, password } = JSON.parse(await fs.readFile("test-user.json", "utf-8"));

    await basePage.singInPage.login(email, password);

    for (const section of workspaceSections) {
      await expect(page.getByRole("menuitem", { name: section })).toBeVisible();
    }
  });
});
