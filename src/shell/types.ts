import type { Component } from 'svelte';

import type { IconName } from '../art';
import type { ProgramProps } from '../kit';

/** A program's component. Programs that don't use their props can leave them out. */
type ProgramComponent = Component<ProgramProps> | Component<Record<string, never>>;

/** One program as `desktop.ts` lists it. */
export interface ProgramDefinition {
  /**
   * URL-safe and unique; also the window's path in links (`#/about`). An id ending in `/*`, such as
   * `projects/*`, is a program opened with an argument: `projects/some-slug` opens its window with
   * the argument `some-slug`, one window per argument.
   */
  id: string;
  title: string;
  icon: IconName;
  x: number;
  y: number;
  width: number;
  height: number;
  /** The window can't be resized or maximized. */
  fixedSize?: boolean;
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
