import type { Component } from 'svelte';

import type { ProgramProps } from '../kit';
import type { WindowSpec } from './windows.svelte';

/** A program's component. Programs that don't use their props can leave them out. */
type ProgramComponent = Component<ProgramProps> | Component<Record<string, never>>;

/** One program as `desktop.ts` lists it: its window's defaults, plus how to load it. Where the
 * window opens is up to the layout. */
export interface ProgramDefinition extends Omit<WindowSpec, 'x' | 'y'> {
  /**
   * URL-safe and unique; also the window's path in links (`#/about`). An id ending in `/*`, such as
   * `projects/*`, is a program opened with an argument: `projects/some-slug` opens its window with
   * the argument `some-slug`, one window per argument.
   */
  id: string;
  load: () => Promise<{ default: ProgramComponent }>;
}

/** A desktop icon that opens a window, placed by hand. */
export interface IconPlacement {
  path: string;
  x: number;
  y: number;
}

/** Where a program's windows open in a layout. Without a size, at the program's own. */
interface Placement {
  x: number;
  y: number;
  width?: number;
  height?: number;
  /** Instead of a height: reaches down to this many px above the taskbar, however tall the screen. */
  bottom?: number;
}

/** The first view on screens of one size, and where windows open on them later. */
export interface Layout {
  /**
   * The area it's drawn for: the screen above the taskbar. A bigger area centres its windows, but
   * not down if one of them reaches to the taskbar: that one stretches instead.
   */
  width: number;
  height: number;
  /** Opened on load, back to front: the last one is in front. */
  staged: readonly string[];
  /** Where each program's windows open, by program id. One left out opens in the middle. */
  windows: Readonly<Record<string, Placement>>;
}
