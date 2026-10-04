import { icons, programs } from '../src/desktop';
import {
  activeTitle,
  boxOf,
  desktopIcon,
  drag,
  expect,
  frontTitle,
  openDesktop,
  stagedTitles,
  TASKBAR_HEIGHT,
  taskButton,
  test,
  titleOf,
  windowTitled,
} from './fixtures';

const AREA = { width: 1280, height: 800 - TASKBAR_HEIGHT };

test('the staged view opens with its front window active and a taskbar button each', async ({
  page,
}) => {
  await openDesktop(page);
  await expect(page.locator('.window .title')).toHaveText(stagedTitles);
  await expect(page.locator('.task')).toHaveText(stagedTitles);
  await expect(taskButton(page, frontTitle)).toHaveClass(/active/);
});

// Catches a broken lazy import or desktop.ts entry: each window opens fresh and renders.
test('every desktop icon opens its program', async ({ page }) => {
  await openDesktop(page);
  while ((await page.locator('.window').count()) > 0) {
    await page.locator('.window.active button.close').click();
  }
  for (const { path } of icons) {
    const title = titleOf(path);
    await desktopIcon(page, title).dblclick();
    const win = windowTitled(page, title);
    await expect(win).toHaveClass(/active/);
    await expect(win.locator('.body *').first()).toBeVisible();
    await expect(win).not.toContainText("Couldn't load");
    await win.locator('button.close').click();
  }
});

test('dragging a title bar moves the window and keeps it on screen', async ({ page }) => {
  await openDesktop(page);
  const win = windowTitled(page, frontTitle);
  const start = await boxOf(win);
  const title = await boxOf(win.locator('.title'));
  const grip = { x: title.x + 20, y: title.y + title.height / 2 };

  await drag(page, grip, 40, 30);
  await expect.poll(() => boxOf(win)).toEqual({ ...start, x: start.x + 40, y: start.y + 30 });

  await drag(page, { x: grip.x + 40, y: grip.y + 30 }, 3000, 3000);
  await expect
    .poll(() => boxOf(win))
    .toEqual({
      ...start,
      x: AREA.width - start.width,
      y: AREA.height - start.height,
    });
});

test('edges and corners resize the window, keeping the opposite side in place', async ({
  page,
}) => {
  await openDesktop(page);
  const win = windowTitled(page, frontTitle);
  const start = await boxOf(win);

  const corner = await boxOf(win.locator('.edge.se'));
  await drag(page, { x: corner.x + 6, y: corner.y + 6 }, 50, 40);
  await expect
    .poll(() => boxOf(win))
    .toEqual({ ...start, width: start.width + 50, height: start.height + 40 });

  const left = await boxOf(win.locator('.edge.w'));
  await drag(page, { x: left.x + 3, y: left.y + left.height / 2 }, 30, 0);
  await expect
    .poll(() => boxOf(win))
    .toEqual({
      x: start.x + 30,
      y: start.y,
      width: start.width + 50 - 30,
      height: start.height + 40,
    });
});

test('double-clicking a title bar maximizes the window and restores it', async ({ page }) => {
  await openDesktop(page);
  const win = windowTitled(page, frontTitle);
  const start = await boxOf(win);

  await win.locator('.title').dblclick();
  await expect.poll(() => boxOf(win)).toEqual({ x: 0, y: 0, ...AREA });
  await expect(win.locator('.edge')).toHaveCount(0);

  await win.locator('.title').dblclick();
  await expect.poll(() => boxOf(win)).toEqual(start);
});

// A real bug: new windows never got a stacking order, so clicking one didn't bring it forward.
test('clicking a window behind brings it to the front', async ({ page }) => {
  await openDesktop(page);
  const back = windowTitled(page, frontTitle);
  const backBox = await boxOf(back);

  // Open a second window and drag it so it covers the middle of the first.
  const other = icons.map(({ path }) => titleOf(path)).find((title) => title !== frontTitle) ?? '';
  await desktopIcon(page, other).dblclick();
  const front = windowTitled(page, other);
  await expect(front).toHaveClass(/active/);
  const otherTitle = await boxOf(front.locator('.title'));
  const target = { x: backBox.x + backBox.width / 2, y: backBox.y + backBox.height / 2 };
  await drag(
    page,
    { x: otherTitle.x + 5, y: otherTitle.y + 5 },
    target.x - otherTitle.x,
    target.y - otherTitle.y,
  );

  // A point inside both windows shows whichever is in front.
  const overlap = { x: target.x + 10, y: target.y + 40 };
  const titleAt = () =>
    page.evaluate(
      ({ x, y }) =>
        document.elementFromPoint(x, y)?.closest('.window')?.querySelector('.title')?.textContent,
      overlap,
    );
  await expect.poll(titleAt).toBe(other);

  await back.locator('.title').click();
  await expect(activeTitle(page)).toHaveText(frontTitle);
  await expect.poll(titleAt).toBe(frontTitle);
});

test('a fixed-size window can be neither resized nor maximized', async ({ page }) => {
  const fixed = programs.find((program) => program.fixedSize);
  test.skip(!fixed, 'no fixed-size program in desktop.ts');
  if (!fixed) return;

  await openDesktop(page);
  await desktopIcon(page, fixed.title).dblclick();
  const win = windowTitled(page, fixed.title);
  await expect(win).toHaveClass(/active/);
  await expect(win.locator('.edge')).toHaveCount(0);
  await expect(win.locator('button.maximize')).toBeDisabled();

  const start = await boxOf(win);
  await win.locator('.title').dblclick();
  await expect.poll(() => boxOf(win)).toEqual(start);
});

test('a taskbar button focuses its window, then minimizes and restores it', async ({ page }) => {
  await openDesktop(page);
  const title = stagedTitles[0] ?? '';
  const win = windowTitled(page, title);
  const button = taskButton(page, title);

  await button.click();
  await expect(win).toHaveClass(/active/);

  await button.click();
  await expect(win).toBeHidden();
  await expect(button).not.toHaveClass(/active/);
  await expect(activeTitle(page)).toHaveText(frontTitle);

  await button.click();
  await expect(win).toBeVisible();
  await expect(win).toHaveClass(/active/);
});
