# AGENTS.md

A personal homepage that looks like a Windows XP desktop: windows already open on load, desktop icons that open more, and a taskbar. Besides the homepage content, it's a home for small toy programs the owner makes for fun, each in its own window. Svelte 5 + Vite + TypeScript with pnpm, a static site on GitHub Pages.

`README.md` is the overview for people; this file holds the standing rules. XP reference material (XP.css, two React XP recreations with Microsoft's art, Wine's Tahoma) is in `../references/`; its `README.md` says where to look for what.

If a request conflicts with these rules or with what the references show, ask rather than guess.

## Principles

- **A homepage, not an OS simulator.** Build only what's useful or delightful on a personal homepage. When something would just recreate more of Windows, leave it out, and check "Not now" below.
- **Pseudo-XP.** Recognisably Windows XP, but clean and consistent rather than pixel-perfect. Copy values (colours, gradients, sizes) from `../references/`, not files; no CSS library. Add styles only for what's being built.
- **The owner decides the content.** Text, photos, projects and the desktop layout are placeholders the owner will replace. Keep content in data or in the program's own folder so that's trivial, and leave `[Name]`-style placeholders alone rather than inventing details.
- **The shell and the programs stay separate.** Only `src/desktop.ts` knows both. A program's window contents are entirely its own, and needn't look like XP.
- **Phones get the same desktop,** with floating windows, just smaller and fewer (see layouts below). Each program handles a small window its own way; a toy that can't work on a phone may just say "best on a computer".
- **Ordinary HTML, no accessibility work beyond it:** no screen-reader or keyboard work for the desktop. Svelte's a11y warnings are filtered out in `svelte.config.js` on purpose.

## Not now

Out of scope unless the owner asks for it. Don't build these, and don't build hooks "for later" either:

- Start menu contents, and any menu that opens from the Start button.
- Right-click menus.
- Sound of any kind.
- Boot, login, shutdown or welcome screens; screensavers; BSOD jokes.
- System programs and dialogs: Run, Control Panel, Display Properties, Task Manager, file dialogs, message boxes.
- A file system, Explorer, the Recycle Bin as a working program, dragging icons, saved icon positions.
- Saving any state between visits (`localStorage`, window positions, settings). Every visit starts from the staged view.
- Programs that live outside windows (such as desktop pets).
- Embedding other sites in windows.
- Window animations (minimize/maximize effects).
- Dark mode, themes, other Luna colour schemes.
- A separate mobile design, gestures, or app-style navigation.

## Architecture

- `src/shell/` is the desktop, windows, taskbar and XP look. It never imports `src/programs/` or `src/desktop.ts`; `App.svelte` passes it the desktop configuration as props.
- `src/programs/<name>/` is one program per folder. It imports only `src/kit/`, its own files and npm packages, never the shell, `src/art/` or another program. Keep its files directly in its folder: the lint rule bans every `../` import except `../../kit`.
- `src/kit/` is everything a program may import (the program contract, art by name, `ScrollArea`, `xp.css`), and nothing in it imports the shell, programs or `desktop.ts`.
- `src/desktop.ts` is the single, hand-written list of programs, desktop icons and layouts. Nothing is auto-discovered.
- `src/art/` holds the Microsoft placeholder art and nothing else. Only `src/art/index.ts` imports those files; everything else asks for art by name. Each file's origin is listed in `src/art/README.md`.
- oxlint's `no-restricted-imports` enforces these boundaries.

### How it fits together

- **Windows are named by path,** and the path is also the link: window `about` is `#/about`. A program whose id ends in `/*`, such as `projects/*`, opens one window per argument: `projects/minesweeper` opens `Project.svelte` with `arg` set to `minesweeper`. With `single: true` in `desktop.ts`, as Projects has, it has one window instead, which opening another argument turns to that one where it is, starting the program over. `shell/paths.ts` names windows the XP way: a window with an argument is titled `now.txt - Notepad` until its program sets a title, or just `clouds.png` if the program's title is empty, and its desktop icon is labelled with the argument. Notepad (`notepad/*`) opens the `.txt` files in its folder by name, and the photo viewer (`photos/*`) the pictures in its, so another file needs only the file, plus an icon or a staged spot if it should have one. `Desktop.svelte` resolves paths to programs, opens the staged view, then any window linked in the hash, and keeps the hash naming the window in front. Hash routing and `base: './'` keep the build working at any address; don't switch to history-API routing or absolute paths.
- **Layouts decide where windows open.** `layouts` in `desktop.ts` holds one per screen size, biggest first, each drawn for an area (the screen above the taskbar) of a given size. On load the site picks the first that fits (`shell/layout.ts`), or the last, and opens its `staged` windows. A bigger area centres it: down, the whole layout; across, the staged windows on the screen, as far as that doesn't push them left into the icons or off the right edge. Its `windows` say where each program opens, then and later, at the program's own size unless the layout gives one. A window placed with `bottom` shrinks on a screen too short for its height, to stay that many px above the taskbar, so one layout covers a range of heights instead of needing another for shorter screens; a taller area gives it its full height before centring the layout. A program can still fit its window to its contents as it opens (`win.fit`), as a project does. A program a layout leaves out opens in the middle. The layout is picked once: resizing the browser afterwards only keeps windows on screen. In `pnpm dev` only, a Layouts icon in the desktop's bottom-right corner opens the layout tool (`shell/LayoutTool.svelte`, `shell/layoutTool.ts`), a window of the shell's own rather than a program. While it's open, resizing the browser restages the layout for the new size, and it lists the layouts with the one in use selected. Its Copy layout button copies the screen size, that layout and every window's position in its coordinates: the owner arranges windows by hand and pastes that in to have a layout updated. None of it reaches the production build.
- **The window manager, `shell/windows.svelte.ts`,** is the only place window state lives. Components read `wm` and call its functions; they never change window state themselves. On a touch screen windows have no resize edges, too fine for a finger; maximize fills the screen instead.
- **The program contract** is `ProgramProps` in `kit/index.ts`: a `WindowHandle` (`id`, `setTitle`, `close`, `open(path)`, `fit(height)`) and the optional `arg`. A program that needs neither can leave its props out. Keep the handle small, and grow it only when a program needs more.
- **A program's lifetime:** it loads lazily, as its own chunk, when its window first opens, and the window is drawn once it has: a program that fits its window to its contents should do it as it mounts, before it's first seen. A minimized window stays mounted, only hidden, so its timers and animation loops keep running; closing the window destroys the program, so clean up in `$effect` teardowns.
- **Styles:** shell chrome uses scoped styles plus custom properties from `shell/theme/theme.css` (fonts, colours, taskbar height). The only global rules are that file's page basics: border-box sizing and the body font. Don't add global element styles; they would leak into every program. Programs opt into XP widgets with `kit/xp.css` classes (`xp-button`); add a class there when a program needs a new widget.
- **Scrolling content goes inside kit's `ScrollArea`,** which draws XP scrollbars in every browser, rather than `overflow: auto`, whose native scrollbars Firefox can't style.

### Adding a program

1. Make `src/programs/<name>/` with its component. Start from the closest existing one: `eight-ball` for a self-contained toy, `links` or `notepad` for a scrolling page.
2. The window body is a box of definite size: give the component's root `height: 100%`. A `ScrollArea` fills its parent. The program inherits Tahoma 13 px (XP's Large Fonts size) and border-box sizing, on XP's beige window background unless it paints its own (most set `background: white`).
3. Add an entry to `programs` in `desktop.ts`. Its `width` and `height` are the whole window, frame and title bar included; `fixedSize: true` stops resizing and maximizing. Give it a place in each layout's `windows`, or it opens in the middle of the screen.
4. Add an icon placement to `icons` if it should be on the desktop. The test that opens every desktop icon then covers it, finding the window by the title `shell/paths.ts` gives it, so a program on the desktop or in a staged view keeps that title rather than calling `setTitle`.
5. For an `id/*` program, `arg` is whatever is in the link, so handle one that matches nothing, as `Project.svelte` does. Its `desktop.ts` title is only a stand-in: set the real one with `win.setTitle`.
6. New Microsoft art goes in `src/art/` with a line in `index.ts` and `README.md`. The program's own images go in its own folder.

## Conventions

- **Svelte 5 syntax only:** runes (`$state`, `$derived`, `$effect`, `$props`), event attributes (`onclick`), and snippets with `{@render}`. Shared reactive modules use the `.svelte.ts` extension.
- **Give every component a `<script lang="ts">` block.** svelte-check treats a component without one as JavaScript, and importing it from TypeScript fails with "Could not find a declaration file".
- **Fix rather than suppress.** Keep svelte-check and oxlint free of warnings. If a suppression is truly needed, make it targeted and give the reason after `--`: `// oxlint-disable-next-line rule -- why` or `<!-- svelte-ignore code -- why -->`.
- **Comments say why,** not what. Match the surrounding code's density and style.
- **Use pointer events** for anything dragged, so mouse and touch share one path.
- **Tests:** a few Playwright end-to-end tests, each guarding a behaviour that could break by accident (window management, links, the phone layout). No tests for simple or visual things like scrollbars: checking those by hand is enough. There's no unit test setup; don't add one unless asked. Select program contents by role and text, and the shell's elements through the helpers in `tests/fixtures.ts`.

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

Before finishing a change, run `pnpm format && pnpm lint && pnpm check && pnpm build`. Don't run `pnpm test` locally unless the owner asks: CI runs the end-to-end tests on every push.

For UI changes, also look at the result at desktop (~1280 px) and phone (~390 px) widths. Playwright's headless Chromium is installed: a throwaway script, run from the repo so it resolves `@playwright/test`, can screenshot the dev server; delete it afterwards. The owner often has `pnpm dev` running already, so check port 5173 before starting another. The machine is short on memory: run one browser at a time.

## Gotchas

- **TypeScript stays on the major version svelte-check supports** (6.x as of writing). Don't upgrade until svelte-check's peer dependencies allow it.
- **oxlint only sees `<script>` blocks** in `.svelte` files, and its type-aware rules skip `.svelte` files entirely. svelte-check covers markup and component types, including unused variables.
- **oxlint's `no-restricted-imports` regexes don't support lookahead,** and fail silently by never matching. Use `group` globs with `!` exceptions instead.
- **A folder override's `no-restricted-imports` replaces the top-level one** rather than adding to it, so each override in `.oxlintrc.json` repeats the `svelte/store` ban (and the art ban where it applies). A new top-level restriction has to be copied into every override.
- **The import rules only see imports.** Art reached through `url()` in a `<style>` block or `new URL(…, import.meta.url)` slips past them, so ask `art/index.ts` for it instead.
- **The tests read `desktop.ts` and the projects data** for titles, icons and each viewport's staged view, so rearranging content shouldn't break them. They work out titles and icon labels with `shell/paths.ts`, as the site does, so a path with an argument can be staged or on the desktop only if its program keeps that title: `notepad/now.txt` can, but not `projects/some-slug`, whose title only the program knows.
- **`pnpm test` reuses a server already on port 4173** outside CI, and then skips the build: stop a stray `pnpm preview` first or it tests an old `dist/`.

## Git & deploy

- **Commit messages:** Conventional Commits with lowercase subjects (`feat: add taskbar clock`, `fix: keep windows on screen`), and no body unless something important can't fit in the subject.
- **One concern per commit,** and a linear history: rebase or fast-forward, never merge commits.
- **Commit and push only when asked.** Small local commits during a task the owner asked for are fine; never push without being asked, because a push to `main` deploys.
- **Deploy:** `.github/workflows/deploy.yml` runs the same checks and tests as above, then deploys `akskokki/akskokki.github.io` to GitHub Pages, served at https://akskokki.github.io/.
