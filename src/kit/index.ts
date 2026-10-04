// Everything a program may import. Keep this small: it's the whole interface between programs and
// the shell.
// Loaded with every program that imports the kit, so its classes work whichever window opens first.
import './xp.css';

export { iconUrl, imageUrl } from '../art';
export { default as ScrollArea } from './ScrollArea.svelte';

/** A program's handle on its own window. */
export interface WindowHandle {
  readonly id: string;
  setTitle(title: string): void;
  close(): void;
  /**
   * Opens a window by its path, such as `about` or `projects/some-slug`, or brings it to the
   * front if it's already open.
   */
  open(path: string): void;
}

/** What every program component receives. */
export interface ProgramProps {
  win: WindowHandle;
  /** For programs listed as `id/*`: the rest of the window's path, such as a project's slug. */
  arg?: string;
}
