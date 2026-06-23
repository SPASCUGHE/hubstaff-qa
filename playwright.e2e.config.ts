import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import base from "./playwright.config";

dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * Full Hubstaff E2E tests — requires MAILSURPAPIKEY and .env.
 * Run locally: npm run test:e2e
 */
export default defineConfig({
  ...base,
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  globalSetup: "./tests/setup/global.setup.ts",
  timeout: process.env.CI ? 180_000 : 60_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    ...base.use,
    baseURL: process.env.BASEURL || "https://hubstaff.com/",
    actionTimeout: process.env.CI ? 30_000 : 15_000,
    navigationTimeout: process.env.CI ? 45_000 : 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
