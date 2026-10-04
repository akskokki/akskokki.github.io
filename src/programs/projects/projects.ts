// Each project's slug is its window's address: #/projects/<slug>. The screenshots are from
// toska.dev and bought.app, the recordings from the student projects' repos, and the University of
// Helsinki's logo, the course projects' marker, from helsinki.fi. Media are
// `new URL`s rather than imports, which the tests can't load when they read this file in Node;
// Vite bundles them all the same.

export const toskaLogo = new URL('./toska-logo.svg', import.meta.url).href;
const helsinkiLogo = new URL('./helsinki-logo.svg', import.meta.url).href;

export interface Project {
  slug: string;
  title: string;
  /** Work and personal projects are listed apart, and each project window says which it is. */
  kind: 'work' | 'personal';
  where: string;
  when: string;
  /** A few words under the title in the folder. */
  summary: string;
  /** Fitted into a 32 px square, and 16 px in the project window. Without one, the game controller. */
  logo?: string;
  whatItIs: string;
  whatIDid: string;
  tags: string[];
  picture?: Picture;
  visit?: string;
  source?: string;
}

/**
 * A screenshot or a looping recording, above the text. Its size in px lets the window make room
 * for it before it loads.
 */
type Picture = { width: number; height: number } & (
  | { screenshot: string }
  | { video: { webm: string; mp4: string } }
);

export const projects: Project[] = [
  {
    slug: 'suotar',
    title: 'Suotar',
    kind: 'work',
    where: 'Toska',
    when: '2026–present',
    summary: 'Registers course completions',
    logo: toskaLogo,
    whatItIs:
      "The University of Helsinki's tool for registering course completions: teachers send in their course's results, and Suotar turns them into entries in the university's study register. It also checks the completions of the open university's MOOC courses every week.",
    whatIDid:
      'Took sole ownership of it after about three years without active development and with no tests. Wrote integration tests against its existing behaviour, moved it from Node.js 14 to 24 without regressions, and kept building new features.',
    tags: ['JavaScript', 'React', 'Node.js', 'Express', 'PostgreSQL'],
    picture: {
      screenshot: new URL('./suotar.webp', import.meta.url).href,
      width: 880,
      height: 738,
    },
    source: 'https://github.com/UniversityOfHelsinkiCS/suoritustarkistin',
  },
  {
    slug: 'norppa',
    title: 'Norppa',
    kind: 'work',
    where: 'Toska',
    when: '2026–present',
    summary: 'Course feedback system',
    logo: toskaLogo,
    whatItIs:
      "The University of Helsinki's course feedback system. Students give feedback on their courses, teachers tailor and read it, and degree programmes follow it across all their courses.",
    whatIDid:
      "Moved the university-wide survey from fixed questions to versioned ones, so the questions can change every year without altering past years' feedback.",
    tags: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Playwright'],
    picture: {
      screenshot: new URL('./norppa.webp', import.meta.url).href,
      width: 880,
      height: 758,
    },
    source: 'https://github.com/UniversityOfHelsinkiCS/palaute',
  },
  {
    slug: 'polku',
    title: 'Polku',
    kind: 'work',
    where: 'Toska',
    when: '2026–present',
    summary: 'Language Centre course finder',
    logo: toskaLogo,
    whatItIs:
      "A course finder for the University of Helsinki's Language Centre: students answer a few questions and filter the Centre's courses down to the ones that suit them.",
    whatIDid:
      "Rebuilt the frontend to follow the university's design system, and covered the whole flow with end-to-end tests.",
    tags: ['TypeScript', 'React', 'Node.js', 'Playwright'],
    picture: {
      screenshot: new URL('./polku.webp', import.meta.url).href,
      width: 617,
      height: 372,
    },
    visit: 'https://polku.helsinki.fi/',
    source: 'https://github.com/UniversityOfHelsinkiCS/apparaatti',
  },
  {
    slug: 'bought',
    title: 'Bought',
    kind: 'work',
    where: 'Bought',
    when: '2025–2026',
    summary: 'Secondhand fashion app',
    logo: new URL('./bought-logo.png', import.meta.url).href,
    whatItIs:
      'A marketplace app for secondhand fashion that turns your past online purchases into ready-made listings, and delivers from nearby sellers within hours. I was one of five engineers at the startup.',
    whatIDid:
      'Owned the onboarding flow through the expansion into the Baltics, including its localisation and measuring it with PostHog. Found that Baltic users were dropping off at the location step, because the form rejected their postal codes, and shipped a geolocation option that raised completion from about 60% to over 90%.',
    tags: ['TypeScript', 'React Native', 'Node.js', 'PostgreSQL', 'PostHog'],
    picture: {
      screenshot: new URL('./bought.webp', import.meta.url).href,
      width: 880,
      height: 800,
    },
    visit: 'https://bought.app/en/',
  },
  {
    slug: 'sliding-puzzle-solver',
    title: '15 Puzzle Solver',
    kind: 'personal',
    where: 'Course project',
    when: '2023',
    summary: 'IDA* search, in Pygame',
    logo: helsinkiLogo,
    whatItIs:
      'Solves the 15 puzzle in the fewest possible moves, or lets you slide the tiles yourself. My Data Structures and Algorithms course project.',
    whatIDid:
      'Implemented an IDA* search guided by Manhattan distance and linear conflicts, a Pygame interface, and performance tests: over a thousand scrambled boards showed how deep a solution it finds within a minute.',
    tags: ['Python', 'Pygame', 'IDA*'],
    picture: {
      video: {
        webm: new URL('./sliding-puzzle.webm', import.meta.url).href,
        mp4: new URL('./sliding-puzzle.mp4', import.meta.url).href,
      },
      width: 790,
      height: 452,
    },
    source: 'https://github.com/akskokki/sliding-puzzle-solver',
  },
  {
    slug: 'minesweeper',
    title: 'Minesweeper',
    kind: 'personal',
    where: 'Course project',
    when: '2022',
    summary: 'The classic game, in Pygame',
    logo: helsinkiLogo,
    whatItIs:
      'The classic game, with three difficulty levels, boards of any size and a high-score table. My Software Engineering course project.',
    whatIDid:
      'Built the game logic and a Pygame interface, with unit tests, a coverage report, linting, and documentation of the requirements and the architecture.',
    tags: ['Python', 'Pygame', 'pytest'],
    picture: {
      video: {
        webm: new URL('./minesweeper.webm', import.meta.url).href,
        mp4: new URL('./minesweeper.mp4', import.meta.url).href,
      },
      width: 456,
      height: 308,
    },
    source: 'https://github.com/akskokki/minesweeper-python',
  },
];
