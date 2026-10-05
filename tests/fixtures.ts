import { test as base, expect, type Locator, type Page } from '@playwright/test';

import { layouts, programs } from '../src/desktop';
import { pickLayout } from '../src/shell/layout';
import * as paths from '../src/shell/paths';

export { expect };

/** Every test fails on an uncaught exception or a console error or warning. */
export const test = base.extend<{ failOnConsoleProblems: void }>({
  failOnConsoleProblems: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on('pageerror', (error) => problems.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error' || message.type() === 'warning')
          problems.push(message.text());
      });
      await use();
      expect(problems, 'console errors or warnings').toEqual([]);
    },
    { auto: true },
  ],
});

export const TASKBAR_HEIGHT = 30;

function resolve(path: string) {
  const resolved = paths.resolve(programs, path);
  if (!resolved) throw new Error(`desktop.ts has no program for "${path}"`);
  return resolved;
}

/** A window's title, worked out from desktop.ts as the site does, so the tests follow its content. */
export function titleOf(path: string): string {
  return paths.titleOf(resolve(path));
}

/** A desktop icon's label, worked out the same way. */
export function labelOf(path: string): string {
  return paths.labelOf(resolve(path));
}

/** What the staged view opens on this page's screen, back to front, as desktop.ts's layouts say. */
export function stagedPaths(page: Page): readonly string[] {
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('the tests need a fixed viewport');
  return pickLayout(layouts, programs, viewport.width, viewport.height - TASKBAR_HEIGHT).layout
    .staged;
}

export function stagedTitles(page: Page): string[] {
  return stagedPaths(page).map(titleOf);
}

export function frontPath(page: Page): string {
  return stagedPaths(page).at(-1) ?? '';
}

export function frontTitle(page: Page): string {
  return titleOf(frontPath(page));
}

/** Loads the site and waits for the staged view's front window. */
export async function openDesktop(page: Page, hash = '', front = frontTitle(page)): Promise<void> {
  await page.goto(`/${hash}`);
  await expect(activeTitle(page)).toHaveText(front);
}

// The shell's elements are found by where they sit in the shell, not by class alone: a program may
// use the same class names inside its window (8-Ball has its own `.window`).

export function windows(page: Page): Locator {
  return page.locator('.area > .window');
}

export function activeWindow(page: Page): Locator {
  return page.locator('.area > .window.active');
}

/** A window's title bar, which holds its title and its minimize, maximize and close buttons. */
export function titleBar(win: Locator): Locator {
  return win.locator(':scope > .title-bar');
}

export function windowTitles(page: Page): Locator {
  return windows(page).locator(':scope > .title-bar > .title');
}

/** A window's resize edges, or one of them: `edges(win, 'se')`. */
export function edges(win: Locator, edge = ''): Locator {
  return win.locator(`:scope > .edge${edge && `.${edge}`}`);
}

// Matched exactly: About's "My projects" button would otherwise match "Projects".
export function windowTitled(page: Page, title: string): Locator {
  return windows(page).filter({
    has: page.locator(':scope > .title-bar > .title').getByText(title, { exact: true }),
  });
}

export function activeTitle(page: Page): Locator {
  return titleBar(activeWindow(page)).locator('.title');
}

export function desktopIcons(page: Page): Locator {
  return page.locator('.area > .icon');
}

export function desktopIcon(page: Page, label: string): Locator {
  return desktopIcons(page).filter({
    has: page.locator('.label').getByText(label, { exact: true }),
  });
}

export function taskButtons(page: Page): Locator {
  return page.locator('.tasks > .task');
}

export function taskButton(page: Page, title: string): Locator {
  return taskButtons(page).filter({ has: page.getByText(title, { exact: true }) });
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function boxOf(locator: Locator): Promise<Box> {
  const box = await locator.boundingBox();
  if (!box) throw new Error('element is not visible');
  return box;
}

/** Drags with the mouse from a point by (dx, dy), in steps so pointermove fires along the way. */
export async function drag(page: Page, from: { x: number; y: number }, dx: number, dy: number) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x + dx, from.y + dy, { steps: 5 });
  await page.mouse.up();
}
