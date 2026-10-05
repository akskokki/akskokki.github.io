// Window paths: which program a path opens, and the names its window and desktop icon go by.
// Apart from Desktop.svelte, so the layouts and the tests can use them too.
import type { ProgramDefinition } from './types';

/** A path's program, and its argument for `id/*` programs. */
export interface Resolved<P> {
  program: P;
  arg?: string;
}

/** The program a window path belongs to, if any. */
export function resolve<P extends Pick<ProgramDefinition, 'id'>>(
  programs: readonly P[],
  path: string,
): Resolved<P> | undefined {
  const program = programs.find((p) => p.id === path);
  // `projects/*` itself names no window, only the pattern for its arguments.
  if (program && !program.id.endsWith('/*')) return { program };
  const slash = path.indexOf('/');
  const withArg = slash > 0 && programs.find((p) => p.id === `${path.slice(0, slash)}/*`);
  if (withArg && slash < path.length - 1) return { program: withArg, arg: path.slice(slash + 1) };
  return undefined;
}

type Named = Resolved<Pick<ProgramDefinition, 'title'>>;

/**
 * A window's title until its program sets one: the program's title, or with an argument
 * "now.txt - Notepad", as XP titled a document's window.
 */
export function titleOf({ program, arg }: Named): string {
  return arg ? `${arg} - ${program.title}` : program.title;
}

/** A desktop icon's label: the program's title, or its argument alone, as XP named a file. */
export function labelOf({ program, arg }: Named): string {
  return arg ?? program.title;
}
