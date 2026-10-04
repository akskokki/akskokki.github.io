import { join } from 'node:path';

import { icons, staged } from '../src/desktop';
import { projects } from '../src/programs/projects/projects';
import {
  activeTitle,
  boxOf,
  expect,
  frontPath,
  frontTitle,
  openDesktop,
  stagedTitles,
  taskButton,
  test,
  titleOf,
  windowTitled,
} from './fixtures';

const [first, second] = projects;
if (!first || !second) throw new Error('these tests need at least two projects');

test('projects open from the folder in their own windows, titled by the project', async ({
  page,
}) => {
  await openDesktop(page);
  const folder = windowTitled(page, titleOf('projects'));

  await folder.getByRole('button', { name: first.title }).dblclick();
  const win = windowTitled(page, first.title);
  await expect(win).toHaveClass(/active/);
  await expect(win.getByRole('heading', { name: first.title, level: 1 })).toBeVisible();
  const links = win.getByRole('link');
  await expect(links).toHaveCount([first.visit, first.source].filter(Boolean).length);
  for (const link of await links.all()) await expect(link).toHaveAttribute('target', '_blank');

  // A second project window cascades instead of covering the first exactly. The first may cover
  // the folder, so bring the folder forward from the taskbar.
  await taskButton(page, titleOf('projects')).click();
  await folder.getByRole('button', { name: second.title }).dblclick();
  const firstBox = await boxOf(win);
  await expect
    .poll(() => boxOf(windowTitled(page, second.title)))
    .toEqual({ ...firstBox, x: firstBox.x + 24, y: firstBox.y + 24 });
});

test('a link to a project opens it on top of the staged view', async ({ page }) => {
  await openDesktop(page, `#/projects/${first.slug}`, first.title);
  await expect(page.locator('.window')).toHaveCount(stagedTitles.length + 1);
  await expect(page).toHaveURL(new RegExp(`#/projects/${first.slug}$`));
});

test('the hash follows the window in front, and a new hash opens its window', async ({ page }) => {
  await openDesktop(page);
  await expect(page).toHaveURL(new RegExp(`#/${frontPath}$`));

  const back = staged[0]?.path ?? '';
  await windowTitled(page, titleOf(back)).locator('.title').click();
  await expect(page).toHaveURL(new RegExp(`#/${back}$`));

  const closed = icons.find(({ path }) => !staged.some((s) => s.path === path))?.path ?? '';
  await page.evaluate((path) => (location.hash = `#/${path}`), closed);
  await expect(activeTitle(page)).toHaveText(titleOf(closed));
  await expect(page).toHaveURL(new RegExp(`#/${closed}$`));
});

test('a link to a missing project says so', async ({ page }) => {
  await openDesktop(page, '#/projects/no-such-project', titleOf('projects/*'));
  await expect(page.locator('.window.active')).toContainText('no project called');
});

// base: './' must keep the build working under a sub-path, as on GitHub Pages.
test('the build works when served under a sub-path', async ({ page }) => {
  const dist = join(import.meta.dirname, '..', 'dist');
  await page.route('**/sub/**', (route) =>
    route.fulfill({
      path: join(
        dist,
        new URL(route.request().url()).pathname.slice('/sub/'.length) || 'index.html',
      ),
    }),
  );
  await page.goto(`/sub/#/projects/${first.slug}`);
  await expect(activeTitle(page)).toHaveText(first.title);
  await expect(windowTitled(page, frontTitle)).toBeVisible();
});
