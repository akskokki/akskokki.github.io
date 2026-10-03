import type { Component } from 'svelte';

import type { IconName } from '../art';
import type { WindowHandle } from '../kit';

/** One program as `desktop.ts` lists it. */
export interface ProgramDefinition {
  /** URL-safe, unique. */
  id: string;
  title: string;
  icon: IconName;
  x: number;
  y: number;
  width: number;
  height: number;
  /** The window can't be resized or maximized. */
  fixedSize?: boolean;
  load: () => Promise<{ default: Component<{ win: WindowHandle }> }>;
}

/** A window the staged first view opens, overriding the program's default position. */
export interface StagedWindow {
  program: string;
  x?: number;
  y?: number;
}
