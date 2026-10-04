// For `pnpm dev` only: the layout tool, a window of the shell's own for arranging the layouts in
// desktop.ts. While it's open, resizing the browser goes back to the staged view of the layout for
// the new size, and it can copy the windows' positions to hand to an agent.
import type { PickedLayout } from './layout';
import { rectOf, type WindowSpec, wm } from './windows.svelte';

/** The tool's window id, and its path: #/layout-tool reopens it. */
export const LAYOUT_TOOL = 'layout-tool';

export function layoutToolSpec(
  area: { width: number; height: number },
  layoutCount: number,
): WindowSpec {
  const width = 300;
  // Tall enough to list every layout, at 20 px a row.
  const height = 152 + 20 * layoutCount;
  // In the bottom-right corner, beside its desktop icon.
  return {
    title: 'Layouts',
    icon: 'computer',
    x: area.width - width - 92,
    y: area.height - height - 8,
    width,
    height,
    fixedSize: true,
  };
}

/** The screen and the windows as they are now, as text for an agent. */
export function layoutInfo(
  { layout, dx, dy }: PickedLayout,
  area: { width: number; height: number },
): string {
  const windows = wm.windows
    .filter((win) => win.id !== LAYOUT_TOOL)
    .toSorted((a, b) => a.z - b.z)
    .map((win) => {
      const { x, y, width, height } = rectOf({ ...win, maximized: false });
      // Rounded: dragging at a browser zoom other than 100% leaves fractions.
      const r = Math.round;
      const notes = [win.maximized && 'maximized', win.minimized && 'minimized'].filter(Boolean);
      const gap = r(area.height - y - height);
      return `- ${win.id}: x ${r(x - dx)}, y ${r(y - dy)}, ${r(width)}×${r(height)}, ${gap} px above the taskbar${notes.length ? ` (${notes.join(', ')})` : ''}`;
    });
  return [
    `Viewport ${window.innerWidth}×${window.innerHeight}, so the area above the taskbar is ${area.width}×${area.height}.`,
    `It uses the ${layout.width}×${layout.height} layout, moved ${dx} px right and ${dy} px down to centre it. A window placed with \`bottom\` shrinks on a short screen to stay that far above the taskbar.`,
    'Windows back to front, in the layout’s coordinates (the area’s minus that offset):',
    ...windows,
  ].join('\n');
}

/** Copies text, falling back to the old way where the clipboard API isn't allowed: it needs a
 * secure context, which the dev server reached by IP isn't. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    document.body.append(field);
    field.select();
    // oxlint-disable-next-line typescript/no-deprecated -- the fallback where the API isn't allowed
    const copied = document.execCommand('copy');
    field.remove();
    return copied;
  }
}
