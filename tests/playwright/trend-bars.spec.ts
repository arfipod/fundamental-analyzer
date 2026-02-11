import { expect, test } from '@playwright/test';

test.describe('Trend bars dashboard', () => {
  test('does not render "Sin datos" helper and keeps period/value tooltip on bars', async ({
    page
  }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Modo prueba (AAPL)' }).click();
    await page.getByRole('button', { name: 'Analizar Financieros' }).click();

    await page.locator('.dashboard').waitFor({ timeout: 90_000 });

    const firstMetricCard = page.locator('.a-item').first();
    await expect(firstMetricCard).not.toContainText('Sin datos');

    const bars = firstMetricCard.locator('.trend-bar .bar');
    await expect(bars.first()).toBeVisible();

    const title = await bars.first().getAttribute('title');
    const ariaLabel = await bars.first().getAttribute('aria-label');

    expect(title).toBeTruthy();
    expect(title).toContain(':');
    expect(ariaLabel).toBe(title);
  });
});
