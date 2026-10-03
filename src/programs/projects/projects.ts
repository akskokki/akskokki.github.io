// Placeholder projects. Each one's slug is its window's address: #/projects/<slug>.

export interface Project {
  slug: string;
  title: string;
  whatItIs: string;
  whatIDid: string;
  tags: string[];
  visit?: string;
  source?: string;
}

export const projects: Project[] = [
  {
    slug: 'tiny-weather',
    title: 'Tiny Weather',
    whatItIs: 'A placeholder project: a weather app that fits the forecast into one glance.',
    whatIDid: 'Designed and built the whole thing, from the data fetching to the little icons.',
    tags: ['TypeScript', 'Svelte', 'Open-Meteo'],
    visit: 'https://example.com/',
    source: 'https://github.com/',
  },
  {
    slug: 'pixel-garden',
    title: 'Pixel Garden',
    whatItIs: 'A placeholder project: a slow, cosy browser game about growing pixel plants.',
    whatIDid: 'Wrote the game loop and the plant growth rules, and drew most of the sprites.',
    tags: ['Canvas', 'JavaScript', 'Game'],
    visit: 'https://example.com/',
    source: 'https://github.com/',
  },
  {
    slug: 'bus-times',
    title: 'Bus Times',
    whatItIs: 'A placeholder project: a departures board for the stops near home.',
    whatIDid: 'Built the backend that polls the transit API, and a big-text frontend for the hall.',
    tags: ['Python', 'FastAPI', 'Raspberry Pi'],
    source: 'https://github.com/',
  },
  {
    slug: 'recipe-box',
    title: 'Recipe Box',
    whatItIs:
      'A placeholder project: a family recipe collection that works offline in the kitchen.',
    whatIDid: 'Led a team of three: planned the data model, the sync and the search.',
    tags: ['React', 'PWA', 'IndexedDB'],
    visit: 'https://example.com/',
  },
];
