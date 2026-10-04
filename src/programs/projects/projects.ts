// Each project's slug is its window's address: #/projects/<slug>. The university projects'
// screenshots are from toska.dev. They're `new URL`s rather than imports, which the tests can't
// load when they read this file in Node; Vite bundles them all the same.

export interface Project {
  slug: string;
  title: string;
  whatItIs: string;
  whatIDid: string;
  tags: string[];
  screenshot?: string;
  visit?: string;
  source?: string;
}

export const projects: Project[] = [
  {
    slug: 'suotar',
    title: 'Suotar',
    whatItIs:
      "The University of Helsinki's tool for registering course completions: teachers send in their course's results, and Suotar turns them into entries in the university's study register. It also checks the completions of the open university's MOOC courses every week.",
    whatIDid:
      'Took sole ownership of it after about three years without active development and with no tests. Wrote integration tests against its existing behaviour, moved it from Node.js 14 to 24 without regressions, and kept building new features.',
    tags: ['JavaScript', 'React', 'Node.js', 'Express', 'PostgreSQL'],
    screenshot: new URL('./suotar.webp', import.meta.url).href,
    source: 'https://github.com/UniversityOfHelsinkiCS/suoritustarkistin',
  },
  {
    slug: 'norppa',
    title: 'Norppa',
    whatItIs:
      "The University of Helsinki's course feedback system. Students give feedback on their courses, teachers tailor and read it, and degree programmes follow it across all their courses.",
    whatIDid:
      "Moved the university-wide survey from fixed questions to versioned ones, so the questions can change every year without altering past years' feedback.",
    tags: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Playwright'],
    screenshot: new URL('./norppa.webp', import.meta.url).href,
    source: 'https://github.com/UniversityOfHelsinkiCS/palaute',
  },
  {
    slug: 'polku',
    title: 'Polku',
    whatItIs:
      "A course finder for the University of Helsinki's Language Centre: students answer a few questions and filter the Centre's courses down to the ones that suit them.",
    whatIDid:
      "Rebuilt the frontend to follow the university's design system, and covered the whole flow with end-to-end tests.",
    tags: ['TypeScript', 'React', 'Node.js', 'Playwright'],
    screenshot: new URL('./polku.webp', import.meta.url).href,
    visit: 'https://polku.helsinki.fi/',
    source: 'https://github.com/UniversityOfHelsinkiCS/apparaatti',
  },
  {
    slug: 'minesweeper',
    title: 'Minesweeper',
    whatItIs:
      'The classic game, with three difficulty levels, boards of any size and a high-score table. My Software Engineering course project.',
    whatIDid:
      'Built the game logic and a Pygame interface, with unit tests, a coverage report, linting, and documentation of the requirements and the architecture.',
    tags: ['Python', 'Pygame', 'pytest'],
    screenshot: new URL('./minesweeper.gif', import.meta.url).href,
    source: 'https://github.com/akskokki/minesweeper-python',
  },
  {
    slug: 'sliding-puzzle-solver',
    title: '15 Puzzle Solver',
    whatItIs:
      'Solves the 15 puzzle in the fewest possible moves, or lets you slide the tiles yourself. My Data Structures and Algorithms course project.',
    whatIDid:
      'Implemented an IDA* search guided by Manhattan distance and linear conflicts, a Pygame interface, and performance tests: over a thousand scrambled boards showed how deep a solution it finds within a minute.',
    tags: ['Python', 'Pygame', 'IDA*'],
    screenshot: new URL('./sliding-puzzle.gif', import.meta.url).href,
    source: 'https://github.com/akskokki/sliding-puzzle-solver',
  },
];
