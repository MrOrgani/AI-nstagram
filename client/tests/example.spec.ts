import { test, expect } from "@playwright/test";

test("homepage", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AI-Stagram/);
});

test("Writing a comment in a post", async ({ page }) => {
  await page.goto("http://localhost:3000/");
});
