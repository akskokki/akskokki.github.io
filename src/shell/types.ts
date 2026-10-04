import type { Component } from 'svelte';

import type { ProgramProps } from '../kit';
import type { WindowSpec } from './windows.svelte';

/** A program's component. Programs that don't use their props can leave them out. */
type ProgramComponent = Component<ProgramProps> | Component<Record<string, never>>;

/** One program as `desktop.ts` lists it: its window's defaults, plus how to load it. */
export interface ProgramDefinition extends WindowSpec {
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

/** A window the staged first view opens, overriding the program's default position. */
export interface StagedWindow {
  path: string;
  x?: number;
  y?: number;
}
