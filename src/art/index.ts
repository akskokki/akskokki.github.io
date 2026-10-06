// The only file that imports art. Everything else asks for art by name, so replacing a placeholder
// means swapping its file or changing its line here.
import application16 from './application-16.webp';
import application32 from './application-32.webp';
import blissPreview from './bliss-preview.webp';
import bliss from './bliss.webp';
import computer16 from './computer-16.webp';
import computer32 from './computer-32.webp';
import dateTime16 from './date-time-16.webp';
import dateTime32 from './date-time-32.webp';
import folder16 from './folder-16.webp';
import folder32 from './folder-32.webp';
import gameController16 from './game-controller-16.webp';
import gameController32 from './game-controller-32.webp';
import globe16 from './globe-16.webp';
import globe32 from './globe-32.webp';
import notepad16 from './notepad-16.webp';
import notepad32 from './notepad-32.webp';
import pictureViewer16 from './picture-viewer-16.webp';
import pictureViewer32 from './picture-viewer-32.webp';
import startFlag from './start-flag.webp';
import users16 from './users-16.webp';
import users32 from './users-32.webp';

const images = { bliss, blissPreview, startFlag };

// The dev-only tools' icons are left out of the build, where nothing shows them.
const NONE = { 16: '', 32: '' };

const icons = {
  application: { 16: application16, 32: application32 },
  computer: import.meta.env.DEV ? { 16: computer16, 32: computer32 } : NONE,
  dateTime: import.meta.env.DEV ? { 16: dateTime16, 32: dateTime32 } : NONE,
  folder: { 16: folder16, 32: folder32 },
  gameController: { 16: gameController16, 32: gameController32 },
  globe: { 16: globe16, 32: globe32 },
  notepad: { 16: notepad16, 32: notepad32 },
  pictureViewer: { 16: pictureViewer16, 32: pictureViewer32 },
  users: { 16: users16, 32: users32 },
};

export type ImageName = keyof typeof images;
export type IconName = keyof typeof icons;

export function imageUrl(name: ImageName): string {
  return images[name];
}

export function iconUrl(name: IconName, size: 16 | 32): string {
  return icons[name][size];
}
