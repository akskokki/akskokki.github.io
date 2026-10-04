// The one file that knows both the shell and the programs: which programs exist, the desktop
// icons, and the layouts that say which windows open first, and where, on each size of screen.
import type { IconPlacement, Layout, ProgramDefinition } from './shell/types';

// The Projects folder's two widths: its tiles fit two to a row, even with a scrollbar, or one. Its
// height shows every project where there's room, or else ends halfway down a row, so it's clear
// the rest scrolls.
const projectsWide = 560;
const projectsNarrow = 320;

export const programs: ProgramDefinition[] = [
  {
    id: 'about',
    title: 'About me',
    icon: 'users',
    width: 560,
    height: 340,
    load: () => import('./programs/about/About.svelte'),
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: 'folder',
    width: projectsWide,
    height: 325,
    load: () => import('./programs/projects/Projects.svelte'),
  },
  {
    // One window per project, titled by the project itself.
    id: 'projects/*',
    title: 'Project',
    icon: 'application',
    width: 500,
    height: 540,
    load: () => import('./programs/projects/Project.svelte'),
  },
  {
    id: 'links',
    title: 'Links',
    icon: 'globe',
    width: 400,
    height: 145,
    load: () => import('./programs/links/Links.svelte'),
  },
  {
    id: 'photo',
    title: 'Photo',
    icon: 'pictureViewer',
    width: 400,
    height: 300,
    load: () => import('./programs/photo/Photo.svelte'),
  },
  {
    id: 'note',
    title: 'Note',
    icon: 'notepad',
    width: 360,
    height: 180,
    load: () => import('./programs/note/Note.svelte'),
  },
  {
    id: 'eight-ball',
    title: '8-Ball',
    icon: 'gameController',
    width: 300,
    height: 340,
    fixedSize: true,
    load: () => import('./programs/eight-ball/EightBall.svelte'),
  },
];

// XP's default column down the left.
export const icons: IconPlacement[] = [
  { path: 'about', x: 8, y: 8 },
  { path: 'projects', x: 8, y: 88 },
  { path: 'links', x: 8, y: 168 },
  { path: 'photo', x: 8, y: 248 },
  { path: 'note', x: 8, y: 328 },
  { path: 'eight-ball', x: 8, y: 408 },
];

/**
 * Biggest first: a screen gets the first layout that fits above its taskbar, or the last one. In
 * `pnpm dev`, the Layouts icon in the bottom-right corner opens a tool for arranging these.
 */
export const layouts: Layout[] = [
  {
    // Big screens, wider than 1080p: the same windows, larger and with room around them.
    width: 2000,
    height: 870,
    staged: ['photo', 'projects', 'note', 'about'],
    windows: {
      about: { x: 320, y: 50, width: 680, height: 436 },
      projects: { x: 1040, y: 0, width: 620, height: 436 },
      'projects/*': { x: 700, y: 60, width: 560 },
      links: { x: 360, y: 300 },
      photo: { x: 1120, y: 490, width: 500, height: 370 },
      note: { x: 520, y: 560, width: 420, height: 210 },
      'eight-ball': { x: 1120, y: 260 },
    },
  },
  {
    // Laptops up to 1080p. Projects is tall enough for every project, and Photo below it gives up
    // some height on the shortest screens.
    width: 1280,
    height: 620,
    staged: ['photo', 'projects', 'note', 'about'],
    windows: {
      about: { x: 110, y: 40, width: 560, height: 340 },
      projects: { x: 700, y: 16, width: projectsWide, height: 378 },
      'projects/*': { x: 380, y: 40 },
      links: { x: 200, y: 190 },
      photo: { x: 740, y: 410, width: 380, height: 270, bottom: 8 },
      note: { x: 360, y: 430 },
      'eight-ball': { x: 820, y: 110 },
    },
  },
  {
    // About and Projects side by side, Projects tall enough for every project, the note below.
    width: 920,
    height: 580,
    staged: ['projects', 'note', 'about'],
    windows: {
      about: { x: 90, y: 40, width: 480, height: 364 },
      projects: { x: 590, y: 16, width: projectsNarrow, height: 518 },
      'projects/*': { x: 300, y: 20 },
      links: { x: 180, y: 180 },
      photo: { x: 480, y: 180 },
      note: { x: 200, y: 424, width: 340, height: 150 },
      'eight-ball': { x: 560, y: 100 },
    },
  },
  {
    // The same, without the note, for screens too short for it.
    width: 920,
    height: 480,
    staged: ['projects', 'about'],
    windows: {
      about: { x: 90, y: 30, width: 480, height: 364 },
      projects: { x: 590, y: 8, width: projectsNarrow, height: 453 },
      'projects/*': { x: 300, y: 10 },
      links: { x: 180, y: 150 },
      photo: { x: 480, y: 90 },
      note: { x: 280, y: 300, width: 340, height: 150 },
      'eight-ball': { x: 560, y: 60 },
    },
  },
  {
    // Taller than wide, as a tablet held upright: About above a two-column Projects, which shows
    // every project where there's room and is cut halfway down a row on the shortest screens.
    width: 640,
    height: 710,
    staged: ['projects', 'about'],
    windows: {
      about: { x: 80, y: 16, width: 520, height: 346 },
      projects: { x: 80, y: 378, width: projectsWide, height: 378, bottom: 8 },
      'projects/*': { x: 110, y: 60 },
      links: { x: 160, y: 200 },
      photo: { x: 160, y: 220 },
      note: { x: 200, y: 300 },
      'eight-ball': { x: 260, y: 160 },
    },
  },
  {
    width: 640,
    height: 440,
    staged: ['projects', 'about'],
    windows: {
      about: { x: 90, y: 56, width: 520, height: 370 },
      projects: { x: 80, y: 8, width: projectsWide, height: 378 },
      'projects/*': { x: 110, y: 8 },
      links: { x: 140, y: 150 },
      photo: { x: 200, y: 100 },
      note: { x: 240, y: 240 },
      'eight-ball': { x: 300, y: 60 },
    },
  },
  {
    // Wide but short, as a phone held sideways or a browser with its devtools along the bottom.
    width: 640,
    height: 300,
    staged: ['projects', 'about'],
    windows: {
      about: { x: 90, y: 34, width: 520, height: 266 },
      projects: { x: 80, y: 0, width: projectsWide, height: 300 },
      'projects/*': { x: 110, y: 0 },
      links: { x: 160, y: 60 },
      photo: { x: 160, y: 0, height: 300 },
      note: { x: 200, y: 60 },
      'eight-ball': { x: 260, y: 0 },
    },
  },
  {
    // Phones. Windows are as wide as the screen allows, and Projects' title bar peeks out above
    // About's. About is as tall as its contents, or on a short phone reaches down to the taskbar.
    width: 360,
    height: 500,
    staged: ['projects', 'about'],
    windows: {
      about: { x: 8, y: 46, width: 344, height: 496, bottom: 8 },
      projects: { x: 32, y: 8, width: projectsNarrow, height: 453 },
      'projects/*': { x: 8, y: 8, width: 344 },
      links: { x: 8, y: 180, width: 344, height: 150 },
      photo: { x: 8, y: 100, width: 344, height: 280 },
      note: { x: 20, y: 280, width: 330, height: 180 },
      'eight-ball': { x: 30, y: 80 },
    },
  },
];
