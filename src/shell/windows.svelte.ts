// The window manager: the only place window state lives. Components read `wm` and call the
// functions below; they never change window state themselves.
import type { IconName } from '../art';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** What a window opens with. */
export interface WindowSpec extends Rect {
  title: string;
  icon: IconName;
  /** The window can't be resized or maximized. */
  fixedSize?: boolean;
}

export interface WindowState extends WindowSpec {
  id: string;
  fixedSize: boolean;
  minimized: boolean;
  maximized: boolean;
  /** Stacking order: higher is in front. */
  z: number;
}

export type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const MIN_WIDTH = 160;
const MIN_HEIGHT = 80;
/** How close a window fitted to its contents comes to the area's top and bottom. */
const FIT_GAP = 8;

const state = $state({
  windows: [] as WindowState[],
  activeId: null as string | null,
  // The area windows live in. Starts as the viewport so the first layout is right before the
  // desktop measures itself.
  area: { width: window.innerWidth, height: window.innerHeight },
});

let topZ = 0;

export const wm = {
  get windows(): readonly Readonly<WindowState>[] {
    return state.windows;
  },
  get activeId(): string | null {
    return state.activeId;
  },
};

/** Where a window is drawn. Stored rects are kept as set and fitted into the area only here, so a
 * window squeezed by a smaller browser window gets its place back when the browser grows again. */
export function rectOf(win: Readonly<WindowState>): Rect {
  const { width: areaWidth, height: areaHeight } = state.area;
  if (win.maximized) return { x: 0, y: 0, width: areaWidth, height: areaHeight };
  const width = win.fixedSize ? win.width : Math.min(win.width, areaWidth);
  const height = win.fixedSize ? win.height : Math.min(win.height, areaHeight);
  return {
    x: clamp(win.x, 0, areaWidth - width),
    y: clamp(win.y, 0, areaHeight - height),
    width,
    height,
  };
}

export function setArea(width: number, height: number): void {
  state.area = { width, height };
}

/** Opens a window, or brings it to the front if one with this id is already open. */
export function openWindow(id: string, spec: WindowSpec): void {
  if (!find(id)) {
    // Picked field by field: the spec may be a larger object, such as a program's definition.
    const { title, icon, x, y, width, height, fixedSize = false } = spec;
    state.windows.push({
      id,
      title,
      icon,
      x,
      y,
      width,
      height,
      fixedSize,
      minimized: false,
      maximized: false,
      z: 0,
    });
  }
  focusWindow(id);
}

/** Brings a window to the front and makes it active, restoring it if it's minimized. */
export function focusWindow(id: string): void {
  const win = find(id);
  if (!win) return;
  win.minimized = false;
  win.z = ++topZ;
  state.activeId = id;
}

/** Leaves no window active, as when the desktop itself is clicked. */
export function deactivate(): void {
  state.activeId = null;
}

export function minimizeWindow(id: string): void {
  const win = find(id);
  if (!win) return;
  win.minimized = true;
  if (state.activeId === id) activateTopmost();
}

/** What a taskbar button does: minimizes the active window, otherwise brings it to the front. */
export function toggleWindow(id: string): void {
  if (state.activeId === id && !find(id)?.minimized) minimizeWindow(id);
  else focusWindow(id);
}

export function closeWindow(id: string): void {
  state.windows = state.windows.filter((win) => win.id !== id);
  if (state.activeId === id) activateTopmost();
}

export function toggleMaximize(id: string): void {
  const win = find(id);
  if (win && !win.fixedSize) win.maximized = !win.maximized;
}

export function setTitle(id: string, title: string): void {
  const win = find(id);
  if (win) win.title = title;
}

/**
 * Makes a window `by` px taller, or shorter when negative, as far as the area allows short of its
 * top and bottom. It moves up if it needs the room, and keeps a top already higher than that.
 */
export function fitWindow(id: string, by: number): void {
  const win = find(id);
  if (!win || win.fixedSize || win.maximized) return;
  const { y, height } = rectOf(win);
  const top = Math.min(y, FIT_GAP);
  const bottom = state.area.height - FIT_GAP;
  win.height = clamp(height + by, MIN_HEIGHT, bottom - top);
  win.y = clamp(y, top, bottom - win.height);
}

/** Moves a window's top-left corner to (x, y), keeping the whole window on screen. */
export function moveWindow(id: string, x: number, y: number): void {
  const win = find(id);
  if (!win) return;
  const { width, height } = rectOf(win);
  win.x = clamp(x, 0, state.area.width - width);
  win.y = clamp(y, 0, state.area.height - height);
}

/** Drags one edge or corner of a window by (dx, dy) from where it was when the drag started. */
export function resizeWindow(id: string, edge: Edge, start: Rect, dx: number, dy: number): void {
  const win = find(id);
  if (!win || win.fixedSize) return;
  let left = start.x;
  let top = start.y;
  let right = start.x + start.width;
  let bottom = start.y + start.height;
  if (edge.includes('w')) left = clamp(left + dx, 0, right - MIN_WIDTH);
  if (edge.includes('e')) right = clamp(right + dx, left + MIN_WIDTH, state.area.width);
  if (edge.includes('n')) top = clamp(top + dy, 0, bottom - MIN_HEIGHT);
  if (edge.includes('s')) bottom = clamp(bottom + dy, top + MIN_HEIGHT, state.area.height);
  win.x = left;
  win.y = top;
  win.width = right - left;
  win.height = bottom - top;
}

function find(id: string): WindowState | undefined {
  return state.windows.find((win) => win.id === id);
}

function activateTopmost(): void {
  let top: WindowState | undefined;
  for (const win of state.windows) {
    if (!win.minimized && (!top || win.z > top.z)) top = win;
  }
  state.activeId = top?.id ?? null;
}

// When max < min (a window bigger than the area), the window sticks to the top-left.
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}
