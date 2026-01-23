import { test, expect } from '@playwright/test';

const APP_URL = 'http://frontend:5173';
const API_BASE = 'http://backend:8000/api/';

test.describe('Job Management E2E Tests', () => {
  test.setTimeout(60000);
  test.beforeEach(async ({ page }) => {
    // Add listeners for debugging (remove after fixing)
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));

    // Change to 'domcontentloaded' to avoid HMR interference; increase goto timeout if needed
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });

    // Wait for key UI element first (ensures app rendered before expecting API call)
    await expect(page.locator('h2:text("Jobs")')).toBeVisible({ timeout: 60000 });

    // Broaden wait: any /api/jobs related, log details
    const response = await page.waitForResponse(
      resp => resp.url().includes('/api/jobs'),
      { timeout: 90000 }
    );
    console.log('API Response:', {
      url: response.url(),
      status: response.status(),
      method: response.request().method()
    });
    expect(response.status()).toBeLessThan(300);  // Accept 200-299
  });

  test.afterEach(async ({ page }) => {
    //Clean up
    try {
      const response = await page.request.get(`${API_BASE}jobs/`);
      const jobs = await response.json();
      console.log('Cleanup: Found', jobs.length, 'jobs to delete');

      for (const job of jobs) {
        const deleteResp = await page.request.delete(`${API_BASE}jobs/${job.id}/`);
        console.log('Deleted job', job.id, ':', deleteResp.status());
      }
    }
    catch (error) {
      console.error('Cleanup failed: ', error);
    }
  })

  test('Create a new job', async ({ page }) => {
    const uniqueJobName = `Test Job E2E ${Date.now()}`; // Unique name to avoid duplicates

    const input = page.locator('input[placeholder="Enter job name..."]');
    const createButton = page.locator('button:text("Create Job")');

    await input.fill(uniqueJobName);

    await Promise.all([
      page.waitForResponse(resp => 
        resp.url().includes('/api/jobs') && 
        resp.request().method() === 'POST' && 
        resp.status() === 201,
        { timeout: 30000 }
      ),
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
      page.waitForResponse(resp => 
        resp.url().includes('/api/jobs') && 
        resp.request().method() === 'POST' && 
        resp.status() === 201,
        { timeout: 30000 }
      ),
      createButton.click(),
    ]);

    // Locate by unique name
    const jobRow = page.locator(`tr:has(td:text("${uniqueJobName}"))`);
    const statusCell = jobRow.locator('td.capitalize:text("pending")');
    const select = jobRow.locator('select');

    await expect(statusCell).toBeVisible();

    await select.selectOption({ value: 'running' });

    await page.waitForResponse(resp => 
      resp.url().includes('/api/jobs') && 
      resp.request().method() === 'PATCH' && 
      resp.status() === 200,
      { timeout: 30000 }
    );

    await expect(jobRow.locator('td.capitalize:text("running")')).toBeVisible();
  });

  test('Delete a job', async ({ page }) => {
    const uniqueJobName = `Delete Me Job ${Date.now()}`;

    const input = page.locator('input[placeholder="Enter job name..."]');
    const createButton = page.locator('button:text("Create Job")');

    await input.fill(uniqueJobName);

    await Promise.all([
      page.waitForResponse(resp => 
        resp.url().includes('/api/jobs') && 
        resp.request().method() === 'POST' && 
        resp.status() === 201,
        { timeout: 30000 }
      ),
      createButton.click(),
    ]);

    const jobRow = page.locator(`tr:has(td:text("${uniqueJobName}"))`);
    const nameCell = jobRow.locator(`td:text("${uniqueJobName}")`);
    const deleteButton = jobRow.locator('button:text("Delete")');

    await expect(nameCell).toBeVisible();

    await deleteButton.click();

    // Wait for row to disappear (most reliable signal that delete worked)
    await expect(
      page.locator(`tr:has-text("${uniqueJobName}")`)
    ).toBeHidden({ timeout: 10000 });

    //await expect(nameCell).not.toBeVisible();
  });
});