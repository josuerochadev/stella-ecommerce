import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: "http://localhost:3001",
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: [
    {
      command: "npm start",
      cwd: "./server",
      port: 3000,
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: "CI= npm start",
      cwd: "./client",
      port: 3001,
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
});
