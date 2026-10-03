// The only file that imports art. Everything else asks for art by name, so replacing a placeholder
// means swapping its file or changing its line here.
import bliss from './bliss.jpg';

const images = { bliss };

type ImageName = keyof typeof images;

export function imageUrl(name: ImageName): string {
  return images[name];
}
