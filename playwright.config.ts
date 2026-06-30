import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const isCi = !!process.env.CI;

/** Hubstaff E2E — real browser flows. MailSlurp optional on CI (auth tests fail fast for demo). */
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  globalSetup: "./tests/setup/global.setup.ts",
  fullyParallel: false,
  forbidOnly: isCi,
  retries: 0,
  workers: 1,
  timeout: isCi ? 30_000 : 60_000,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["junit", { outputFile: "reports/junit.xml" }],
    ...(isCi ? [["github"] as const] : []),
  ],
  use: {
    baseURL: process.env.BASEURL || "https://hubstaff.com/",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: isCi ? 10_000 : 15_000,
    navigationTimeout: isCi ? 15_000 : 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
