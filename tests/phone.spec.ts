import { icons } from '../src/desktop';
import {
  activeTitle,
  activeWindow,
  boxOf,
  desktopIcon,
  desktopIcons,
  edges,
  expect,
  frontTitle,
  openDesktop,
  stagedTitles,
  TASKBAR_HEIGHT,
  taskButton,
  test,
  titleBar,
  titleOf,
  windows,
  windowTitled,
  windowTitles,
  type Box,
} from './fixtures';

const AREA = { x: 0, y: 0, width: 390, height: 844 - TASKBAR_HEIGHT };

/** Windows on a phone float like on a computer: inside the screen, with the desktop around them. */
function expectFloating(box: Box) {
  expect(box.x).toBeGreaterThan(0);
  expect(box.y).toBeGreaterThan(0);
  expect(box.x + box.width).toBeLessThan(AREA.width);
  expect(box.y + box.height).toBeLessThan(AREA.height);
}

test("a phone opens its layout's windows inside the screen, without resize edges", async ({
  page,
}) => {
  await openDesktop(page);
  await expect(windowTitles(page)).toHaveText(stagedTitles(page));
  const win = windowTitled(page, frontTitle(page));
  expectFloating(await boxOf(win));
  for (const edge of await edges(win).all()) await expect(edge).toBeHidden();
});

test('maximize fills the screen above the taskbar, and restore puts the window back', async ({
  page,
}) => {
  await openDesktop(page);
  const win = windowTitled(page, frontTitle(page));
  const start = await boxOf(win);

  await titleBar(win).locator('.maximize').tap();
  await expect.poll(() => boxOf(win)).toEqual(AREA);

  await titleBar(win).locator('.restore').tap();
  await expect.poll(() => boxOf(win)).toEqual(start);
});

test('closing the windows shows the icons, and one tap opens an icon', async ({ page }) => {
  await openDesktop(page);
  while ((await windows(page).count()) > 0) {
    await titleBar(activeWindow(page)).locator('.close').tap();
  }
  await expect(desktopIcons(page)).toHaveCount(icons.length);

  const title = titleOf(icons.at(-1)?.path ?? '');
  await desktopIcon(page, title).tap();
  await expect(activeTitle(page)).toHaveText(title);
  expectFloating(await boxOf(windowTitled(page, title)));
});

test('taskbar taps switch between windows', async ({ page }) => {
  await openDesktop(page);
  const front = frontTitle(page);
  // Minimize every window to reach the icons, then open one that isn't open yet.
  const other = titleOf(
    icons.find(({ path }) => !stagedTitles(page).includes(titleOf(path)))?.path ?? '',
  );
  while ((await activeWindow(page).count()) > 0) {
    await titleBar(activeWindow(page)).locator('.minimize').tap();
  }
  await desktopIcon(page, other).tap();
  await expect(activeTitle(page)).toHaveText(other);

  await taskButton(page, front).tap();
  await expect(activeTitle(page)).toHaveText(front);

  await taskButton(page, front).tap();
  await expect(windowTitled(page, front)).toBeHidden();
  await expect(activeTitle(page)).toHaveText(other);
});
