import { test, expect } from "@playwright/test";

test.describe("Catalog & Cart Flow", () => {
  test("displays the catalog page with stars", async ({ page }) => {
    await page.goto("/catalog");

    await expect(page.locator("h1").filter({ hasText: "Catalogue" })).toBeVisible();

    // Wait for star cards to load (links to /star/:id)
    const starLinks = page.locator('a[href^="/star/"]');
    await expect(starLinks.first()).toBeVisible({ timeout: 15_000 });
  });

  test("navigates to star detail from catalog", async ({ page }) => {
    await page.goto("/catalog");

    // Wait for cards to load, then click the first star link
    const detailLinks = page.locator('a[href^="/star/"]');
    await expect(detailLinks.first()).toBeVisible({ timeout: 15_000 });
    await detailLinks.first().click();

    // Should navigate to a star detail page
    await expect(page).toHaveURL(/\/star\/\d+/);
  });

  test("cart page shows empty state when not authenticated", async ({ page }) => {
    await page.goto("/cart");

    await expect(page.getByText("Votre panier est vide")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: "Se connecter" })).toBeVisible();
  });

  test("checkout redirects to auth when not authenticated", async ({ page }) => {
    await page.goto("/checkout");

    // Should redirect to /auth
    await expect(page).toHaveURL(/\/auth/);
  });
});
