// Which layout a screen gets. Apart from the window manager, so the tests can use it too.
import { resolve } from './paths';
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
  programs: readonly Pick<ProgramDefinition, 'id' | 'width' | 'height'>[],
  width: number,
  height: number,
): PickedLayout {
  const layout =
    layouts.find((l) => l.width <= width && l.height <= height) ?? layouts[layouts.length - 1];
  if (!layout) throw new Error('desktop.ts has no layouts');

  // The staged windows the layout places, with their programs.
  const staged = layout.staged.flatMap((path) => {
    const program = resolve(programs, path)?.program;
    const placement = program && (layout.windows[path] ?? layout.windows[program.id]);
    return placement ? [{ program, placement }] : [];
  });

  // Across, it's the staged windows that are centred on the screen, rather than the whole layout,
  // whose left edge leaves room for the desktop icons. They never move left of where the layout
  // puts them, though, into the icons, nor past the right edge.
  let left = Infinity;
  let right = -Infinity;
  for (const { program, placement } of staged) {
    const windowWidth = placement.width ?? program.width;
    left = Math.min(left, placement.x);
    right = Math.max(right, placement.x + windowWidth);
  }
  if (left > right) [left, right] = [0, layout.width];
  const centred = Math.floor(width / 2 - (left + right) / 2);

  // Down, they're centred too, the ones that shrink on a short screen at their full height.
  let top = Infinity;
  let bottom = -Infinity;
  for (const { program, placement } of staged) {
    top = Math.min(top, placement.y);
    bottom = Math.max(bottom, placement.y + (placement.height ?? program.height));
  }
  if (top > bottom) [top, bottom] = [0, layout.height];

  return {
    layout,
    dx: Math.max(0, Math.min(centred, width - right)),
    dy: Math.max(0, Math.floor(height / 2 - (top + bottom) / 2)),
  };
}
