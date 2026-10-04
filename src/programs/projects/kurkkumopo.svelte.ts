// The kurkkumopo easter egg. Toska's mascot hides behind a Toska project's picture, and once it's
// found, it drives off and takes the place of Toska's logo throughout the projects until the page
// reloads. The egg is this file and Kurkkumopo.svelte: the rest of the program only asks it which
// logo to show, and gives it somewhere to hide.
import { type Project, projects, toskaLogo } from './projects';

/** The project whose window the kurkkumopo hides in: a Toska one with a picture, new each visit. */
const hideouts = projects.filter((p) => p.logo === toskaLogo && p.picture);
export const HIDEOUT = hideouts[Math.floor(Math.random() * hideouts.length)]?.slug;

export const kurkkumopoUrl = new URL('./kurkkumopo.png', import.meta.url).href;

const state = $state({ found: false });

export const kurkkumopo = {
  get found(): boolean {
    return state.found;
  },
  find(): void {
    state.found = true;
  },
};

/** A project's logo, with the kurkkumopo in place of Toska's once it's found. */
export function logoOf(project: Project): string | undefined {
  return state.found && project.logo === toskaLogo ? kurkkumopoUrl : project.logo;
}
