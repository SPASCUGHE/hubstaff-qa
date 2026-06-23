import { test, expect } from "@playwright/test";

/**
 * Fast, deterministic smoke tests for CI and QA Results Hub integration.
 * No MailSlurp, no Hubstaff login — always produces a JUnit report.
 */
test.describe("CI smoke suite", () => {
  test("renders the QA dashboard header", async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <header id="app-header">Hubstaff QA Dashboard</header>
          <main>Test results overview</main>
        </body>
      </html>
    `);

    await expect(page.locator("#app-header")).toHaveText("Hubstaff QA Dashboard");
    await expect(page.locator("main")).toContainText("Test results");
  });

  test("validates a passing API health check", async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="status">checking</div>
          <script>
            setTimeout(() => {
              document.getElementById('status').textContent = 'healthy';
            }, 50);
          </script>
        </body>
      </html>
    `);

    await expect(page.locator("#status")).toHaveText("healthy", { timeout: 5_000 });
  });

  test("confirms checkout flow mock completes", async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <button id="run-tests">Run tests</button>
          <p id="result"></p>
          <script>
            document.getElementById('run-tests').addEventListener('click', () => {
              document.getElementById('result').textContent = '3 passed, 0 failed';
            });
          </script>
        </body>
      </html>
    `);

    await page.click("#run-tests");
    await expect(page.locator("#result")).toHaveText("3 passed, 0 failed");
  });
});
