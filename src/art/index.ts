// The only file that imports art. Everything else asks for art by name, so replacing a placeholder
// means swapping its file or changing its line here.
import application16 from './application-16.png';
import application32 from './application-32.png';
import bliss from './bliss.jpg';
import folder16 from './folder-16.png';
import folder32 from './folder-32.png';
import gameController16 from './game-controller-16.png';
import gameController32 from './game-controller-32.png';
import globe16 from './globe-16.png';
import globe32 from './globe-32.png';
import notepad16 from './notepad-16.png';
import notepad32 from './notepad-32.png';
import pictureViewer16 from './picture-viewer-16.png';
import pictureViewer32 from './picture-viewer-32.png';
import startFlag from './start-flag.png';
import users16 from './users-16.png';
import users32 from './users-32.png';

const images = { bliss, startFlag };

const icons = {
  application: { 16: application16, 32: application32 },
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
