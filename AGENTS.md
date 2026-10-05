# AGENTS.md

A personal homepage that looks like a Windows XP desktop: windows already open on load, desktop icons that open more, and a taskbar. It's also a home for small toy programs the owner makes for fun, each in its own window. Svelte 5 + Vite + TypeScript with pnpm, a static site on GitHub Pages.

`README.md` is the overview for people; this file holds the standing rules. XP reference material (XP.css, two React XP recreations with Microsoft's art, Wine's Tahoma) is in `../references/`, whose `README.md` says where to look for what. If a request conflicts with these rules or the references, ask rather than guess.

## Principles

- **A homepage, not an OS simulator.** Build only what's useful or delightful on a personal homepage. When something would just recreate more of Windows, leave it out (see "Not now").
- **Pseudo-XP.** Recognisably Windows XP, but clean and consistent rather than pixel-perfect. Copy values (colours, gradients, sizes) from `../references/`, not files; no CSS library. Add styles only for what's being built.
- **The owner writes the content:** text, photos, projects and layouts. Don't invent details. Keep content in data or in the program's own folder.
- **Phones get the same desktop,** floating windows and all, just smaller and fewer. Each program handles a small window its own way; a toy that can't work on a phone may just say "best on a computer".
- **Ordinary HTML, no accessibility work beyond it:** no screen-reader or keyboard work for the desktop. That's why `svelte.config.js` filters out Svelte's a11y warnings.

## Not now

Out of scope unless the owner asks for it. Don't build these, or hooks "for later":

- The Start menu or any other menu, right-click menus included.
- Sound of any kind.
- Boot, login, shutdown or welcome screens; screensavers; BSOD jokes.
- System programs and dialogs (Run, Control Panel, Task Manager, file dialogs, message boxes), a file system or Explorer, a working Recycle Bin, dragging icons.
- Saving any state between visits (`localStorage`, window positions, settings). Every visit starts from the staged view.
- Programs that live outside windows (such as desktop pets), and other sites embedded in windows.
- Window animations beyond the entrance on load and XP's own minimize and maximize.
- Dark mode, themes, other Luna colour schemes, or a separate mobile design with gestures or app-style navigation.

## Architecture

- `src/shell/` is the desktop, windows, taskbar and XP look. It never imports `src/programs/` or `src/desktop.ts`; `App.svelte` passes it the desktop configuration as props.
- `src/programs/<name>/` is one program per folder, with its files directly in it. It imports only `src/kit/` (as `../../kit`), its own files and npm packages. Its window contents are entirely its own, and needn't look like XP.
- `src/kit/` is everything a program may import: the program contract, art by name, `ScrollArea`, `afterLoad` and `xp.css`. It imports nothing from the shell, programs or `desktop.ts`.
- `src/desktop.ts` is the single, hand-written list of programs, desktop icons and layouts. Nothing is auto-discovered.
- `src/art/` holds the Microsoft art and nothing else. Only `src/art/index.ts` imports those files; everything else asks for art by name. Each file's origin is in `src/art/README.md`.
- oxlint's `no-restricted-imports` enforces these boundaries.

### How it fits together

- **Windows are named by path, and the path is also the link:** window `about` is `#/about`. `shell/types.ts` documents programs opened with an argument (`projects/*`). `shell/paths.ts` titles windows and labels icons, for the site and the tests alike. Keep the hash routing and `base: './'`, which keep the build working at any address.
- **Layouts** in `desktop.ts`, one per screen size, decide which windows open on load and where every window opens; `shell/types.ts` documents them. The owner arranges windows by hand in the layout tool (the Layouts icon, in `pnpm dev` only) and pastes what its Copy layout button gives to have a layout updated: read the paste as the intent, not as exact numbers.
- **Only `shell/windows.svelte.ts` changes window state.** Components read `wm` and call its functions.
- **The program contract** is `ProgramProps` in `kit/index.ts`. Grow its `WindowHandle` only when a program needs more.
- **The first view loads first.** The programs a layout stages come with the page, through `withPage`'s glob in `desktop.ts`; the rest load once the page has, or when their window opens if that's sooner. Anything else that might be wanted later loads after kit's `afterLoad()`, as Projects preloads its pictures and recordings.
- **A window is drawn once its program has loaded,** so a program that fits its window with `win.fit` does it as it mounts. A minimized window stays mounted, so its timers keep running; closing it destroys the program, so clean up in `$effect` teardowns.
- **Styles:** shell chrome uses scoped styles and the custom properties in `shell/theme/theme.css`, whose page basics are the only global rules: global element styles would leak into every program. Programs opt into XP widgets with `kit/xp.css` classes (`xp-button`); add a class there when a program needs a new widget. Scrolling content goes in kit's `ScrollArea`, which draws XP scrollbars in every browser, Firefox included.

### Adding a program

1. Make `src/programs/<name>/`, starting from the closest existing program: `eight-ball` for a self-contained toy, `links` or `notepad` for a scrolling page. Give the component's root `height: 100%`, as the window body has a definite size.
2. Add it to `programs` in `desktop.ts` and give it a place in each layout. Its `load` imports it as its own file, or through `withPage` if a layout stages it.
3. Add it to `icons` if it belongs on the desktop. The test that opens every icon finds the window by the title `shell/paths.ts` gives it, so such a program keeps that title.
4. For an `id/*` program, handle an `arg` that matches nothing, as `Project.svelte` does, and set the real title with `win.setTitle`.

## Conventions

- **Svelte 5 only:** runes, event attributes (`onclick`) and snippets. Give every component a `<script lang="ts">` block, or svelte-check treats it as JavaScript and importing it from TypeScript fails.
- **Fix warnings rather than suppress them.** A suppression that's truly needed is targeted and gives its reason after `--`, which `pnpm lint` checks.
- **Comments say why,** not what, matching the surrounding code's density and style.
- **Use pointer events** for anything dragged, so mouse and touch share one path.
- **Images are WebP:** lossless for icons, pixel art and logos, lossy for photos. Logos can be SVG; recordings are WebM and MP4 with a WebP still. The tab icons stay PNG, and the cloud pictures keep their `.png` names, which are also their window titles.
- **Tests** are a few Playwright end-to-end tests, each guarding a behaviour that could break by accident; nothing purely visual, and no unit tests unless asked. Select program contents by role and text, and the shell's elements through the helpers in `tests/fixtures.ts`.

## Commands

```sh
pnpm dev           # dev server, http://localhost:5173
pnpm check         # svelte-check (types) + tsc for tests/, fails on any error or warning
pnpm lint          # oxlint (incl. type-aware rules) + suppression reasons + knip
pnpm format        # oxfmt: format everything, sorts imports (format:check only reports)
pnpm build         # production build into dist/
pnpm preview       # serve dist/, http://localhost:4173
pnpm test          # Playwright end-to-end tests against the build (desktop + phone)
```

Before finishing a change, run `pnpm format && pnpm lint && pnpm check && pnpm build`. Don't run `pnpm test` locally unless the owner asks: CI runs it on every push.

For UI changes, look at the result at desktop (~1280 px) and phone (~390 px) widths: a throwaway Playwright script, run from the repo so it resolves `@playwright/test`, can screenshot the dev server; delete it afterwards. The owner often has `pnpm dev` running, so check port 5173 before starting another. The machine is short on memory: run one browser at a time.

## Gotchas

- **TypeScript stays on the major version svelte-check supports** (6.x as of writing).
- **oxlint only sees `<script>` blocks** in `.svelte` files, and its type-aware rules skip them entirely; svelte-check covers the rest.
- **oxlint's `no-restricted-imports`:** regexes with lookahead silently never match, so use `group` globs with `!` exceptions. A folder override replaces the top-level rule rather than adding to it, so each override in `.oxlintrc.json` repeats the shared bans.
- **The import rules only see imports.** Art reached through `url()` in a `<style>` block or `new URL(…, import.meta.url)` slips past them, so ask `art/index.ts` for it instead.
- **The tests read `desktop.ts` and the projects data in Node** for titles, icons and each viewport's staged view, so neither may import `.svelte` files or media at its top level: programs come through `load`, media through `new URL`. `pnpm exec playwright test --list` checks they still load without running anything. A path with an argument can be staged or on the desktop only if its program keeps the `paths.ts` title: `notepad/now.txt` can, `projects/some-slug` can't.
- **`pnpm test` outside CI reuses a server already on port 4173** and skips the build, so stop a stray `pnpm preview` first or it tests an old `dist/`.

## Git & deploy

- **Commit messages:** Conventional Commits with lowercase subjects (`feat: add taskbar clock`), and no body unless something important doesn't fit.
- **One concern per commit,** and a linear history: rebase or fast-forward, never merge commits.
- **Commit and push only when asked.** Small local commits during a task the owner asked for are fine. Never push unasked: a push to `main` deploys.
- **Deploy:** `.github/workflows/deploy.yml` runs the checks and tests, then deploys to GitHub Pages at https://akskokki.github.io/.
