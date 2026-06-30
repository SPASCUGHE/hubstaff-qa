import { test, expect } from "@playwright/test";

/**
 * Demo tests for QA Automation Hub — deterministic mocks, no external services.
 * Includes one intentional failure to showcase analytics and failure reporting.
 */
test.describe("Hub demo suite", () => {
  test("lists connected projects in the sidebar", async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <nav id="sidebar">
            <ul>
              <li class="project">Hubstaff Web</li>
              <li class="project">Hubstaff QA</li>
              <li class="project">Billing Service</li>
            </ul>
          </nav>
        </body>
      </html>
    `);

    await expect(page.locator(".project")).toHaveCount(3);
    await expect(page.locator(".project").first()).toHaveText("Hubstaff Web");
  });

  test("filters recent runs by failed status", async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <select id="status-filter">
            <option value="all">All</option>
            <option value="failed" selected>Failed</option>
          </select>
          <table id="runs">
            <tr data-status="failed"><td>Run #18</td></tr>
            <tr data-status="passed" hidden><td>Run #19</td></tr>
          </table>
        </body>
      </html>
    `);

    await expect(page.locator("#status-filter")).toHaveValue("failed");
    await expect(page.locator('[data-status="failed"]')).toBeVisible();
    await expect(page.locator('[data-status="passed"]')).toBeHidden();
  });

  test("calculates pass rate for a test run", async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="summary" data-passed="48" data-failed="4" data-total="52"></div>
          <span id="pass-rate"></span>
          <script>
            const el = document.getElementById('summary');
            const passed = Number(el.dataset.passed);
            const total = Number(el.dataset.total);
            const rate = ((passed / total) * 100).toFixed(1);
            document.getElementById('pass-rate').textContent = rate + '%';
          </script>
        </body>
      </html>
    `);

    await expect(page.locator("#pass-rate")).toHaveText("92.3%");
  });

  test("shows analytics overview tab by default", async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div class="tabs">
            <button class="tab active" data-tab="overview">Overview</button>
            <button class="tab" data-tab="projects">By project</button>
          </div>
          <section id="panel-overview">Portfolio metrics</section>
        </body>
      </html>
    `);

    await expect(page.locator('[data-tab="overview"]')).toHaveClass(/active/);
    await expect(page.locator("#panel-overview")).toContainText("Portfolio metrics");
  });

  test("displays per-run outcomes on the analytics chart", async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="chart">
            <div class="run" data-day="Jun 29" data-passed="24" data-failed="2"></div>
            <div class="run" data-day="Jun 30" data-passed="3" data-failed="0"></div>
          </div>
        </body>
      </html>
    `);

    const runs = page.locator(".run");
    await expect(runs).toHaveCount(2);
    await expect(runs.first()).toHaveAttribute("data-day", "Jun 29");
    await expect(runs.last()).toHaveAttribute("data-passed", "3");
  });

  test("marks release as ready when all regression tests pass", async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="release-status" data-blockers="2">blocked</div>
        </body>
      </html>
    `);

    // Intentional demo failure: release still has blockers but test expects "ready".
    await expect(page.locator("#release-status")).toHaveText("ready");
  });
});
