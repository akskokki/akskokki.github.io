// What the wallpaper shows, shared by the wallpaper, the taskbar clock and its balloon, and the
// dev-only time tool.
import { SvelteSet } from 'svelte/reactivity';

import { type Period, pictureOf, pictures, type Place } from './sky';

export const chosen = $state({
  /** A time to show instead of now: dragged to or played through in the clock's balloon, or set
   * in the dev tool. */
  time: null as Date | null,
  /** Somewhere else to show the sky over, on the clock there, chosen in the clock's balloon. */
  place: null as Place | null,
});

/** The full pictures that have loaded and decoded. */
export const loaded = new SvelteSet<Period>();

const loads = new Map<Period, Promise<boolean>>();

/** Loads and decodes a picture once, saying whether it could. */
export function load(period: Period): Promise<boolean> {
  let loading = loads.get(period);
  if (!loading) {
    const image = new Image();
    image.src = pictureOf(period).url;
    loading = image.decode().then(
      () => {
        loaded.add(period);
        return true;
      },
      () => false,
    );
    loads.set(period, loading);
  }
  return loading;
}

/** Every picture, for playing through the day. */
export function loadAll(): Promise<boolean[]> {
  return Promise.all(pictures.map(({ period }) => load(period)));
}
