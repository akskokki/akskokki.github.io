// The only file that imports art. Everything else asks for art by name, so replacing a placeholder
// means swapping its file or changing its line here.
import application16 from './application-16.png';
import application32 from './application-32.png';
import bliss from './bliss.jpg';
import startFlag from './start-flag.png';

const images = { bliss, startFlag };

const icons = {
  application: { 16: application16, 32: application32 },
};

type ImageName = keyof typeof images;
export type IconName = keyof typeof icons;

export function imageUrl(name: ImageName): string {
  return images[name];
}

export function iconUrl(name: IconName, size: 16 | 32): string {
  return icons[name][size];
}
