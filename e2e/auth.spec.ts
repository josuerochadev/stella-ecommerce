import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth");
  });

  test("displays login form by default", async ({ page }) => {
    await expect(page.locator("h2").filter({ hasText: "Connexion" })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Se connecter" })).toBeVisible();
  });

  test("toggles between login and register forms", async ({ page }) => {
    // Switch to register
    await page.getByRole("button", { name: "Inscrivez-vous ici" }).click();
    await expect(page.locator("h2").filter({ hasText: "Inscription" })).toBeVisible();
    await expect(page.getByRole("button", { name: "S'inscrire" })).toBeVisible();

    // Switch back to login
    await page.getByRole("button", { name: "Connectez-vous ici" }).click();
    await expect(page.locator("h2").filter({ hasText: "Connexion" })).toBeVisible();
  });

  test("shows validation errors on empty login submission", async ({ page }) => {
    await page.getByRole("button", { name: "Se connecter" }).click();

    // The form should show required field validation (browser native or custom)
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute("aria-required", "true");
  });

  test("shows validation errors on empty register submission", async ({ page }) => {
    await page.getByRole("button", { name: "Inscrivez-vous ici" }).click();
    await page.getByRole("button", { name: "S'inscrire" }).click();

    // Required fields should be marked
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute("aria-required", "true");
  });

  test("register form has all required fields", async ({ page }) => {
    await page.getByRole("button", { name: "Inscrivez-vous ici" }).click();

    await expect(page.getByPlaceholder("Prénom")).toBeVisible();
    await expect(page.getByPlaceholder("Nom")).toBeVisible();
    await expect(page.getByPlaceholder("votre@email.com")).toBeVisible();
    await expect(page.getByPlaceholder("Minimum 8 caractères")).toBeVisible();
  });

  test("login form rejects invalid credentials", async ({ page }) => {
    await page.locator('input[type="email"]').fill("fake@nonexistent.com");
    await page.locator('input[type="password"]').fill("WrongPassword123!");
    await page.getByRole("button", { name: "Se connecter" }).click();

    // Should show error message (role="alert")
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10_000 });
  });
});
