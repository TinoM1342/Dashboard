import { test, expect } from '@playwright/test';

const APP_URL = 'http://localhost:5173';
const API_BASE = 'http://localhost:8000/api/';

test.describe('Job Management E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.waitForSelector('h2:text("Jobs")');
  });

  test.afterEach(async ({ page }) => {
    //Clean up
    try {
      const response = await page.request.get(`${API_BASE}jobs/`);
      const jobs = await response.json();

      for (const job of jobs) {
        await page.request.delete(`${API_BASE}jobs/${job.id}`);
      }
    }
    catch (error) {
      console.error('Cleanup failed: ', error);
    }
  })

  test('Create a new job', async ({ page }) => {
    const uniqueJobName = `Test Job E2E ${Date.now()}`;  // Unique name to avoid duplicates

    const input = page.locator('input[placeholder="Enter job name..."]');
    const createButton = page.locator('button:text("Create Job")');

    await input.fill(uniqueJobName);

    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/jobs/') && resp.status() === 201),
      createButton.click(),
    ]);

    // Assert with unique name
    await expect(page.locator(`td:text("${uniqueJobName}")`)).toBeVisible();

    // Scoped status assertion for this job's row
    await expect(page.locator(`tr:has(td:text("${uniqueJobName}")) td.capitalize:text("pending")`)).toBeVisible();
  });

  test('Modify job status', async ({ page }) => {
    const uniqueJobName = `Status Update Job ${Date.now()}`;

    const input = page.locator('input[placeholder="Enter job name..."]');
    const createButton = page.locator('button:text("Create Job")');
    await input.fill(uniqueJobName);
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/jobs/') && resp.status() === 201),
      createButton.click(),
    ]);

    // Locate by unique name
    const jobRow = page.locator(`tr:has(td:text("${uniqueJobName}"))`);
    const statusCell = jobRow.locator('td.capitalize:text("pending")');
    const select = jobRow.locator('select');

    await expect(statusCell).toBeVisible();

    await select.selectOption({ value: 'running' });

    await page.waitForResponse(resp => resp.url().includes('/api/jobs/') && resp.request().method() === 'PATCH' && resp.status() === 200);

    await expect(jobRow.locator('td.capitalize:text("running")')).toBeVisible();
  });

  test('Delete a job', async ({ page }) => {
    const uniqueJobName = `Delete Me Job ${Date.now()}`;

    const input = page.locator('input[placeholder="Enter job name..."]');
    const createButton = page.locator('button:text("Create Job")');
    await input.fill(uniqueJobName);
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/jobs/') && resp.status() === 201),
      createButton.click(),
    ]);

    const jobRow = page.locator(`tr:has(td:text("${uniqueJobName}"))`);
    const nameCell = jobRow.locator(`td:text("${uniqueJobName}")`);
    const deleteButton = jobRow.locator('button:text("Delete")');

    await expect(nameCell).toBeVisible();

    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/jobs/') && resp.request().method() === 'DELETE' && resp.status() === 204),
      deleteButton.click(),
    ]);

    await expect(nameCell).not.toBeVisible();
  });
});