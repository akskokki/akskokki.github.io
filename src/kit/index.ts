// Everything a program may import. Keep this small: it's the whole interface between programs and
// the shell.

/** A program's handle on its own window. */
export interface WindowHandle {
  readonly id: string;
  setTitle(title: string): void;
  close(): void;
  /** Opens another program's window, or brings it to the front if it's already open. */
  open(programId: string): void;
}
