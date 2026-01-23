import { test, expect } from '@playwright/test';

const APP_URL = 'http://frontend:5173';
const API_BASE = 'http://backend:8000/api/';

test.describe('Job Management E2E Tests', () => {
  test.setTimeout(60000);
  test.beforeEach(async ({ page }) => {
    // Add listeners for debugging (remove after fixing)
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));
    page.on('response', response => console.log('RESPONSE:', response.url(), response.status()));

    await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForSelector('h2:text("Jobs")', { timeout: 30000 });
    // Optional: Wait for table or empty message to confirm data load
    await expect(page.locator('table') || page.locator('p:text("No jobs yet. Create one below.")')).toBeVisible({ timeout: 30000 });
  });

  test.afterEach(async ({ page }) => {
    try {
      const response = await page.request.get(`${API_BASE}jobs/`);
      const jobs = await response.json();
      for (const job of jobs) {
        await page.request.delete(`${API_BASE}jobs/${job.id}/`);
      }
    } catch (error) {
      console.error('Cleanup failed: ', error);
    }
  });

  test('Create a new job', async ({ page }) => {
    const uniqueJobName = `Test Job E2E ${Date.now()}`;
    const input = page.locator('input[placeholder="Enter job name..."]');
    const createButton = page.locator('button:text("Create Job")');
    await input.fill(uniqueJobName);
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/jobs/') && resp.status() === 201, { timeout: 10000 }),
      createButton.click(),
    ]);
    await expect(page.locator(`td:text("${uniqueJobName}")`)).toBeVisible({ timeout: 30000 });
    await expect(page.locator(`tr:has(td:text("${uniqueJobName}")) td.capitalize:text("pending")`)).toBeVisible({ timeout: 30000 });
  });

  test('Modify job status', async ({ page }) => {
    const uniqueJobName = `Status Update Job ${Date.now()}`;
    const input = page.locator('input[placeholder="Enter job name..."]');
    const createButton = page.locator('button:text("Create Job")');
    await input.fill(uniqueJobName);
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/jobs/') && resp.status() === 201, { timeout: 10000 }),
      createButton.click(),
    ]);
    const jobRow = page.locator(`tr:has(td:text("${uniqueJobName}"))`);
    const statusCell = jobRow.locator('td.capitalize:text("pending")');
    const select = jobRow.locator('select');
    await expect(statusCell).toBeVisible({ timeout: 30000 });
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/jobs/') && resp.request().method() === 'PATCH' && resp.status() === 200, { timeout: 10000 }),
      select.selectOption({ value: 'running' }),
    ]);
    await expect(jobRow.locator('td.capitalize:text("running")')).toBeVisible({ timeout: 30000 });
  });

  test('Delete a job', async ({ page }) => {
    const uniqueJobName = `Delete Me Job ${Date.now()}`;
    const input = page.locator('input[placeholder="Enter job name..."]');
    const createButton = page.locator('button:text("Create Job")');
    await input.fill(uniqueJobName);
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/jobs/') && resp.status() === 201, { timeout: 10000 }),
      createButton.click(),
    ]);
    const jobRow = page.locator(`tr:has(td:text("${uniqueJobName}"))`);
    const nameCell = jobRow.locator(`td:text("${uniqueJobName}")`);
    const deleteButton = jobRow.locator('button:text("Delete")');
    await expect(nameCell).toBeVisible({ timeout: 30000 });
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/jobs/') && resp.request().method() === 'DELETE' && resp.status() === 204, { timeout: 10000 }),
      deleteButton.click(),
    ]);
    await expect(page.locator(`tr:has-text("${uniqueJobName}")`)).toBeHidden({ timeout: 30000 });
  });
});