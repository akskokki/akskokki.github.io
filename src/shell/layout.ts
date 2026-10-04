// Which layout a screen gets. Apart from the window manager, so the tests can use it too.
import type { Layout, ProgramDefinition } from './types';

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
  programs: readonly Pick<ProgramDefinition, 'id' | 'width'>[],
  width: number,
  height: number,
): PickedLayout {
  const layout =
    layouts.find((l) => l.width <= width && l.height <= height) ?? layouts[layouts.length - 1];
  if (!layout) throw new Error('desktop.ts has no layouts');

  // Across, it's the staged windows that are centred on the screen, rather than the whole layout,
  // whose left edge leaves room for the desktop icons. They never move left of where the layout
  // puts them, though, into the icons, nor past the right edge.
  let left = Infinity;
  let right = -Infinity;
  for (const path of layout.staged) {
    const placement = layout.windows[path];
    if (!placement) continue;
    const windowWidth = placement.width ?? programs.find((p) => p.id === path)?.width ?? 0;
    left = Math.min(left, placement.x);
    right = Math.max(right, placement.x + windowWidth);
  }
  if (left > right) [left, right] = [0, layout.width];
  const centred = Math.floor(width / 2 - (left + right) / 2);

  return {
    layout,
    dx: Math.max(0, Math.min(centred, width - right)),
    dy: Math.max(0, Math.floor((height - layout.height) / 2)),
  };
}
