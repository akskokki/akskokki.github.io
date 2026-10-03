// The one file that knows both the shell and the programs: which programs exist, where their
// windows open, and what the first view looks like.
import type { ProgramDefinition, StagedWindow } from './shell/types';

// Test windows for the window manager, until the real programs exist.
const loadTest = () => import('./programs/test/Test.svelte');

export const programs: ProgramDefinition[] = [
  {
    id: 'test-a',
    title: 'Test window A',
    icon: 'application',
    x: 80,
    y: 60,
    width: 420,
    height: 300,
    load: loadTest,
  },
  {
    id: 'test-b',
    title: 'Test window B',
    icon: 'application',
    x: 420,
    y: 160,
    width: 380,
    height: 260,
    load: loadTest,
  },
  {
    id: 'test-fixed',
    title: 'Fixed-size test window',
    icon: 'application',
    x: 260,
    y: 380,
    width: 300,
    height: 180,
    fixedSize: true,
    load: loadTest,
  },
];

export const staged: StagedWindow[] = [
  { program: 'test-fixed' },
  { program: 'test-b' },
  { program: 'test-a' },
];
