import { icons } from '../src/desktop';
import {
  activeTitle,
  activeWindow,
  boxOf,
  desktopIcon,
  desktopIcons,
  edges,
  expect,
  openDesktop,
  stagedPhoneTitles,
  TASKBAR_HEIGHT,
  taskButton,
  test,
  titleBar,
  titleOf,
  windows,
  windowTitled,
  windowTitles,
} from './fixtures';

const AREA = { x: 0, y: 0, width: 390, height: 844 - TASKBAR_HEIGHT };
const phoneFront = stagedPhoneTitles.at(-1) ?? '';

test('a phone opens only the phone staged view, filling the screen above the taskbar', async ({
  page,
}) => {
  await openDesktop(page, '', phoneFront);
  await expect(windowTitles(page)).toHaveText(stagedPhoneTitles);
  const win = windowTitled(page, phoneFront);
  await expect.poll(() => boxOf(win)).toEqual(AREA);
  await expect(edges(win)).toHaveCount(0);
  await expect(titleBar(win).locator('.maximize')).toBeDisabled();
});

test('closing the windows shows the icons, and one tap opens an icon filling the screen', async ({
  page,
}) => {
  await openDesktop(page, '', phoneFront);
  while ((await windows(page).count()) > 0) {
    await titleBar(activeWindow(page)).locator('.close').tap();
  }
  await expect(desktopIcons(page)).toHaveCount(icons.length);

  const title = titleOf(icons.at(-1)?.path ?? '');
  await desktopIcon(page, title).tap();
  await expect(activeTitle(page)).toHaveText(title);
  await expect.poll(() => boxOf(windowTitled(page, title))).toEqual(AREA);
});

test('taskbar taps switch between full-screen windows', async ({ page }) => {
  await openDesktop(page, '', phoneFront);
  // Minimize the front window to reach the icons, then open a second window.
  const other = titleOf(icons.find(({ path }) => titleOf(path) !== phoneFront)?.path ?? '');
  await titleBar(activeWindow(page)).locator('.minimize').tap();
  await desktopIcon(page, other).tap();
  await expect(activeTitle(page)).toHaveText(other);

  await taskButton(page, phoneFront).tap();
  await expect(activeTitle(page)).toHaveText(phoneFront);

  await taskButton(page, phoneFront).tap();
  await expect(windowTitled(page, phoneFront)).toBeHidden();
  await expect(activeTitle(page)).toHaveText(other);
});
