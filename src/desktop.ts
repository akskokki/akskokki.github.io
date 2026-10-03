// The one file that knows both the shell and the programs: which programs exist, where their
// windows open, the desktop icons, and what the first view looks like.
import type { IconPlacement, ProgramDefinition, StagedWindow } from './shell/types';

export const programs: ProgramDefinition[] = [
  {
    id: 'about',
    title: 'About me',
    icon: 'users',
    x: 150,
    y: 80,
    width: 480,
    height: 300,
    load: () => import('./programs/about/About.svelte'),
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: 'folder',
    x: 670,
    y: 40,
    width: 440,
    height: 220,
    load: () => import('./programs/projects/Projects.svelte'),
  },
  {
    // One window per project, titled by the project itself.
    id: 'projects/*',
    title: 'Project',
    icon: 'application',
    x: 420,
    y: 60,
    width: 440,
    height: 480,
    load: () => import('./programs/projects/Project.svelte'),
  },
  {
    id: 'links',
    title: 'Links',
    icon: 'globe',
    x: 240,
    y: 200,
    width: 340,
    height: 170,
    load: () => import('./programs/links/Links.svelte'),
  },
  {
    id: 'photo',
    title: 'Photo',
    icon: 'pictureViewer',
    x: 800,
    y: 300,
    width: 400,
    height: 330,
    load: () => import('./programs/photo/Photo.svelte'),
  },
  {
    id: 'note',
    title: 'Note',
    icon: 'notepad',
    x: 420,
    y: 440,
    width: 340,
    height: 170,
    load: () => import('./programs/note/Note.svelte'),
  },
];

// XP's default column down the left.
export const icons: IconPlacement[] = [
  { path: 'about', x: 8, y: 8 },
  { path: 'projects', x: 8, y: 88 },
  { path: 'links', x: 8, y: 168 },
  { path: 'photo', x: 8, y: 248 },
  { path: 'note', x: 8, y: 328 },
];

/** Opened on load, back to front: the last one is in front. */
export const staged: StagedWindow[] = [
  { path: 'photo' },
  { path: 'projects' },
  { path: 'note' },
  { path: 'about' },
];
