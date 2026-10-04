// Which layout a screen gets. Apart from the window manager, so the tests can use it too.
import type { Layout } from './types';

export interface PickedLayout {
  layout: Layout;
  /** How far the layout is moved to centre it in the area. */
  dx: number;
  dy: number;
}

/**
 * The first of `layouts` (biggest first) that fits an area this big, or the last one if none
 * does, and how far to move it to centre it in the area.
 */
export function pickLayout(
  layouts: readonly Layout[],
  width: number,
  height: number,
): PickedLayout {
  const layout =
    layouts.find((l) => l.width <= width && l.height <= height) ?? layouts[layouts.length - 1];
  if (!layout) throw new Error('desktop.ts has no layouts');
  return {
    layout,
    dx: Math.max(0, Math.floor((width - layout.width) / 2)),
    dy: Math.max(0, Math.floor((height - layout.height) / 2)),
  };
}
