import { expect, test } from '@playwright/test';

test.describe('Techverse homepage UI', () => {
  test('hero and primary navigation render', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Building Digital Solutions');
    await expect(page.getByRole('link', { name: 'Discuss Your Project' }).first()).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
  });

  test('scroll stack services section is present and stacks on scroll', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#services');
    await expect(section).toBeVisible();
    await expect(page.getByRole('heading', { name: /what we build/i })).toBeVisible();

    const cards = section.locator('.scroll-stack-card');
    await expect(cards).toHaveCount(7);
    await expect(cards.first()).toContainText('Custom Software Development');

    await section.scrollIntoViewIfNeeded();
    // Drive Lenis (or native scroll) so ScrollStack updates card transforms.
    await page.evaluate(async () => {
      const el = document.querySelector('#services') as HTMLElement | null;
      if (!el) return;
      const start = el.offsetTop + 1100;
      const lenis = (window as unknown as { __techverseLenis?: { scrollTo: (y: number, o?: object) => void } })
        .__techverseLenis;
      if (lenis) {
        lenis.scrollTo(start, { immediate: true });
      } else {
        window.scrollTo(0, start);
      }
      await new Promise((r) => setTimeout(r, 600));
    });

    const state = await cards.evaluateAll((els) => {
      const transforms = els.map((el) => (el as HTMLElement).style.transform || '');
      const tops = els.map((el) => Math.round(el.getBoundingClientRect().top));
      return {
        transforms,
        tops,
        hasTransform: transforms.some((t) => /translate3d|scale\(/.test(t)),
        stackedLook: tops.filter((t) => t > 0 && t < window.innerHeight).length >= 2,
      };
    });

    expect(state.hasTransform || state.stackedLook).toBeTruthy();
  });

  test('key service and contact routes load', async ({ page }) => {
    await page.goto('/services');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.goto('/ai-data-services');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('High-Quality Data Services');
    await page.goto('/contact');
    await expect(page.getByLabel('Full Name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Project Inquiry' })).toBeVisible();
  });
});
