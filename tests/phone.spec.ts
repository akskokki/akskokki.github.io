import { icons } from '../src/desktop';
import {
  activeTitle,
  boxOf,
  desktopIcon,
  expect,
  openDesktop,
  stagedPhoneTitles,
  TASKBAR_HEIGHT,
  taskButton,
  test,
  titleOf,
  windowTitled,
} from './fixtures';

const AREA = { x: 0, y: 0, width: 390, height: 844 - TASKBAR_HEIGHT };
const phoneFront = stagedPhoneTitles.at(-1) ?? '';

test('a phone opens only the phone staged view, filling the screen above the taskbar', async ({
  page,
}) => {
  await openDesktop(page, '', phoneFront);
  await expect(page.locator('.window .title')).toHaveText(stagedPhoneTitles);
  const win = windowTitled(page, phoneFront);
  await expect.poll(() => boxOf(win)).toEqual(AREA);
  await expect(win.locator('.edge')).toHaveCount(0);
  await expect(win.locator('button.maximize')).toBeDisabled();
});

test('closing the windows shows the icons, and one tap opens an icon filling the screen', async ({
  page,
}) => {
  await openDesktop(page, '', phoneFront);
  while ((await page.locator('.window').count()) > 0) {
    await page.locator('.window.active button.close').tap();
  }
  await expect(page.locator('.icon')).toHaveCount(icons.length);

  const title = titleOf(icons.at(-1)?.path ?? '');
  await desktopIcon(page, title).tap();
  await expect(activeTitle(page)).toHaveText(title);
  await expect.poll(() => boxOf(windowTitled(page, title))).toEqual(AREA);
});

test('taskbar taps switch between full-screen windows', async ({ page }) => {
  await openDesktop(page, '', phoneFront);
  // Minimize the front window to reach the icons, then open a second window.
  const other = titleOf(icons.find(({ path }) => titleOf(path) !== phoneFront)?.path ?? '');
  await page.locator('.window.active button.minimize').tap();
  await desktopIcon(page, other).tap();
  await expect(activeTitle(page)).toHaveText(other);

  await taskButton(page, phoneFront).tap();
  await expect(activeTitle(page)).toHaveText(phoneFront);

  await taskButton(page, phoneFront).tap();
  await expect(windowTitled(page, phoneFront)).toBeHidden();
  await expect(activeTitle(page)).toHaveText(other);
});
