// XP's minimize and restore: the window vanishes, or waits to appear, while a copy of its title bar
// flies between where it is and its taskbar button, as with XP's "Animate windows when minimizing
// and maximizing".
import type { Rect } from './windows.svelte';

/** The flight, in ms, at a steady speed as XP's. */
const DURATION = 200;

export interface Flight {
  from: Rect;
  to: Rect;
  onland: () => void;
}

/** For someone who'd rather have less motion, windows minimize and restore at once. */
export function flies(): boolean {
  return !matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Flies the element, moved out to the page so it passes over the taskbar, and lands it. */
export function fly(node: HTMLElement, { from, to, onland }: Flight) {
  document.body.append(node);
  const animation = node.animate([box(from), box(to)], {
    duration: DURATION,
    easing: 'linear',
    fill: 'forwards',
  });
  animation.onfinish = onland;
  // Moved, it's no longer where Svelte would remove it from.
  return {
    destroy: () => {
      animation.cancel();
      node.remove();
    },
  };
}

function box({ x, y, width, height }: Rect): Keyframe {
  return { left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px` };
}
