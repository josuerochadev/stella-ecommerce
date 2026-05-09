import { test, expect } from "@playwright/test";

test.describe("Navigation & Pages", () => {
  test("home page loads correctly", async ({ page }) => {
    await page.goto("/");

    // Header should be visible
    await expect(page.locator("header")).toBeVisible();

    // Footer should be visible
    await expect(page.locator("footer")).toBeVisible();
  });

  test("navigates to main pages", async ({ page }) => {
    // About
    await page.goto("/about");
    await expect(page.locator("main")).toBeVisible();

    // FAQ
    await page.goto("/faq");
    await expect(page.locator("main")).toBeVisible();

    // Contact
    await page.goto("/contact");
    await expect(page.locator("main")).toBeVisible();

    // Legal
    await page.goto("/legal");
    await expect(page.locator("main")).toBeVisible();
  });

  test("unknown routes redirect to home", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await expect(page).toHaveURL("/");
  });

  test("health check endpoint responds", async ({ request }) => {
    const response = await request.get("http://localhost:3000/api/health");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body).toHaveProperty("uptime");
    expect(body).toHaveProperty("database");
  });
});
