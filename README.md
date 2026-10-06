# akskokki.github.io

A personal homepage that looks like a Windows XP desktop, live at <https://akskokki.github.io/>.

A few windows are already open when you arrive, desktop icons open more, and the taskbar switches between them. Besides the usual homepage things (about, projects, links), it's a home for small toy programs, each in its own window. Every window has its own link, such as [`#/projects/minesweeper`](https://akskokki.github.io/#/projects/minesweeper). Smaller screens get their own layouts with fewer windows, phones included.

Everything on it is real apart from the XP art, which is Microsoft's, standing in.

## Running it

You need Node 26 (see `.nvmrc`) and pnpm, whose version is pinned in `package.json`.

```sh
pnpm install
pnpm dev       # http://localhost:5173
```

Other commands:

```sh
pnpm build     # static site into dist/
pnpm preview   # serve dist/ at http://localhost:4173
pnpm test      # end-to-end tests in Chromium, desktop and phone sizes
pnpm format && pnpm lint && pnpm check   # formatting, lint and types
```

## How it's built

Svelte 5, Vite and TypeScript, built as a static site. Hash routes keep it working at any address.

- `src/shell/`: the desktop, windows, taskbar and the XP look.
- `src/programs/`: one folder per program (About, Projects, Links, Notepad, a photo viewer, a Magic 8-Ball).
- `src/kit/`: what programs may use, such as XP scrollbars and buttons.
- `src/desktop.ts`: the hand-written list of programs, desktop icons, and the layouts: which windows open on load, and where, for each size of screen. In `pnpm dev`, the Layouts icon in the bottom-right corner opens a tool for arranging them: while it's open, resizing the browser resets to the layout for the new size, and it copies the windows' positions to hand to an agent.
- `src/art/`: the placeholder art.

The shell and the programs never import each other; only `desktop.ts` knows both. `AGENTS.md` has the details: architecture rules, conventions, and how to add a program.

## Deploying

Every push to `main` runs the checks and tests on GitHub Actions and deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## Credits

- The wallpaper, icons and Start flag are Microsoft's original Windows XP art, used as placeholders. `src/art/README.md` lists where each file came from.
- The wallpaper's other times of day are Bliss relit with an image model (`src/shell/wallpaper/`).
- The bundled Tahoma is [Wine](https://www.winehq.org/)'s free version, under the LGPL 2.1 (`src/shell/theme/fonts/`).
- Colours and sizes come from [XP.css](https://github.com/botoxparty/XP.css), [winXP](https://github.com/ShizukuIchi/winXP) and [web-xp](https://github.com/aduncandev/web-xp).
