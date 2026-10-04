# AGENTS.md

A personal homepage that looks like a Windows XP desktop: a few windows open on load (about,
projects, a photo, a note), desktop icons that open more, and a taskbar. Besides the homepage
content, it's a home for small toy programs the owner makes for fun, each in its own window.

Stack: Svelte 5 (runes) + Vite + TypeScript, pnpm, deployed to GitHub Pages as a static site.

`README.md` is the overview for people; this file holds the standing rules. Reference material (XP
CSS, React XP recreations, screenshots of real XP, placeholder art, fonts) is in `../references/`;
its `README.md` says where to look for what.

## Principles

- **A homepage, not an OS simulator.** Build only what's useful or delightful on a personal homepage.
  When something would just recreate more of Windows, leave it out. Check the "Not now" list below
  before adding anything.
- **Pseudo-XP.** Recognisably Windows XP, but clean and consistent rather than pixel-perfect. Don't
  match pixels against screenshots.
- **Minimal stylesheet.** Add a style or value only when the piece that needs it is being built. Take
  values from `../references/`; copy values, not files. No CSS library dependency.
- **Prototype content.** Text, photos and projects are placeholders. Keep content in data or in the
  program's own folder so it's trivial to replace.
- **The shell and the programs stay separate.** Only `src/desktop.ts` knows both. A program's window
  contents are entirely its own.
- **Phones get the same site, simplified.** Below 640 px every window fills the screen and the
  taskbar switches between them. Each program handles a small window its own way; a toy that can't
  work on a phone may just say "best on a computer".
- **Ordinary HTML, no accessibility work beyond it:** no screen-reader or keyboard work for the
  desktop, and a11y lint warnings are off.

## Not now

Out of scope unless the owner asks for it. Don't build these, and don't build hooks "for later"
either:

- Start menu contents, and any menu that opens from the Start button.
- Right-click menus.
- Sound of any kind.
- Boot, login, shutdown or welcome screens; screensavers; BSOD jokes.
- System programs and dialogs: Run, Control Panel, Display Properties, Task Manager, file dialogs,
  message boxes.
- A file system, Explorer, the Recycle Bin as a working program, dragging icons, saved icon positions.
- Saving any state between visits (window positions, settings). Every visit starts from the staged
  view.
- Programs that live outside windows (such as desktop pets).
- Embedding other sites in windows.
- Window animations (minimize/maximize effects).
- Dark mode, themes, other Luna colour schemes.
- A separate mobile design, gestures, or app-style navigation.

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

Before finishing a change, run `pnpm format && pnpm lint && pnpm check && pnpm build && pnpm test`.
For UI changes, also look at the result in a browser at desktop (~1280 px) and phone (~390 px)
widths.

## Architecture rules

- `src/shell/` is the desktop, windows, taskbar and XP look. It never imports `src/programs/` or
  `src/desktop.ts`; it gets the desktop configuration as props.
- `src/programs/<name>/` is one program per folder. It imports only `src/kit/`, its own files and npm
  packages, never the shell, `src/art/` or another program. Keep its files directly in its folder:
  the lint rule bans every `../` import except `../../kit`.
- `src/kit/` is everything a program may import, and nothing in it imports the shell, programs or
  `desktop.ts`.
- `src/desktop.ts` is the single, hand-written list of programs, icon positions and the staged first
  view. Nothing is auto-discovered.
- `src/art/` holds every piece of Microsoft placeholder art. Only `src/art/index.ts` imports those
  files (plus `index.html`, for the favicon); everything else asks for art by name. Each file's
  origin is listed in `src/art/README.md`.
- Window state lives only in the shell's window manager module. Components call its functions rather
  than changing window state themselves.
- No global element styles that leak into windows. Programs opt into XP widgets with `kit/xp.css`
  classes.
- Content that scrolls goes inside kit's `ScrollArea`, which draws XP scrollbars in every browser,
  rather than `overflow: auto`, whose native scrollbars Firefox can't style.
- oxlint's `no-restricted-imports` enforces these boundaries and bans `svelte/store`.

### How it fits together

- **Windows are named by path,** and the path is also the link: window `about` is `#/about`. A
  program whose id ends in `/*`, such as `projects/*`, opens one window per argument:
  `projects/tiny-weather` opens `Project.svelte` with `arg` set to `tiny-weather`. `Desktop.svelte`
  resolves paths to programs, opens the staged view (or `stagedPhone` below 640 px), then any window
  linked in the hash, and keeps the hash naming the window in front.
- **The program contract** is `ProgramProps` in `kit/index.ts`: a `WindowHandle` (`id`, `setTitle`,
  `close`, `open(path)`) and the optional `arg`. A program that needs neither can leave its props
  out. Programs load lazily, one chunk each.
- **`shell/windows.svelte.ts`** is the window manager: read `wm`, call its functions. It fits windows
  into the desktop area when drawing them, so stored positions survive a smaller browser window.
  Below 640 px (`wm.compact`) every window fills the area and nothing is dragged or resized.
- **Shell components:** `Desktop.svelte` (wallpaper, icons, windows, routing), `Window.svelte`
  (frame, drag, resize), `Taskbar.svelte` (inert Start button, window buttons, clock),
  `DesktopIcon.svelte`, and `theme/` (page basics, shared custom properties, Wine Tahoma).
- **Adding a program:** make `src/programs/<name>/` with its component, add an entry to `programs`
  in `desktop.ts`, and an icon placement if it should be on the desktop. New Microsoft art goes in
  `src/art/` with a line in `index.ts` and `README.md`.

## Conventions

- **Svelte 5 runes only** (`$state`, `$derived`, `$effect`, `$props`): no `export let`, no stores.
  Shared reactive modules use the `.svelte.ts` extension.
- **No unused code:** unused imports, variables and parameters are type errors. In `.svelte` markup
  only svelte-check sees them, because oxlint reads `<script>` blocks only.
- **Fix rather than suppress.** Keep svelte-check and oxlint free of warnings. If a suppression is
  truly needed, make it targeted and give the reason after `--`:
  `// oxlint-disable-next-line rule -- why`, `<!-- svelte-ignore code -- why -->`. `pnpm lint` fails on
  suppressions without a reason.
- **Accessibility warnings are switched off** on purpose (see Principles); don't add suppressions
  for them.
- **Comments say why,** not what. Match the surrounding code's density and style.
- **Use pointer events** for anything dragged, so mouse and touch share one path.
- **No sound,** and no `localStorage` state in this version: every visit starts fresh.

## Gotchas

- **TypeScript stays on the major version svelte-check supports** (6.x as of writing). Don't upgrade
  until svelte-check's peer dependencies allow it. oxlint's type-aware rules bundle their own
  TypeScript.
- **oxlint only sees `<script>` blocks** in `.svelte` files, and its type-aware rules skip `.svelte`
  files entirely. svelte-check covers markup and component types.
- **`base: './'` plus hash routing** keeps the build working at a domain root or under a sub-path.
  Don't switch to absolute paths or history-API routing.
- **Give every component a `<script lang="ts">` block.** svelte-check treats a component without
  one as JavaScript, and importing it from TypeScript fails with "Could not find a declaration file".
- **svelte-check ignores `onwarn`,** so the a11y filter is `compilerOptions.warningFilter` in
  `svelte.config.js`, which both Vite and svelte-check apply.
- **oxlint's `no-restricted-imports` regexes don't support lookahead,** and fail silently by never
  matching. Use `group` globs with `!` exceptions instead.
- **oxfmt formats Markdown too,** including these docs.
- **The tests read `desktop.ts` and the projects data** for titles, icons and the staged view, so
  rearranging content shouldn't break them. Keep them few: each guards a behaviour that could break
  by accident. Select program contents by role and text, not by their internal classes.
- **`pnpm test` reuses a server already on port 4173** outside CI, and then skips the build: stop a
  stray `pnpm preview` first or it tests an old `dist/`. Workers are capped at two because each
  runs its own Chromium.

## Git & deploy

- **Commit messages:** Conventional Commits with lowercase subjects (`feat: add taskbar clock`,
  `fix: keep windows on screen`), and no body unless something important can't fit in the subject.
- **One concern per commit:** separate concerns go in separate commits.
- **Linear history:** rebase or fast-forward, never merge commits.
- **Commit and push only when asked.** Small local commits during a task the owner asked for are
  fine; never push without being asked.
- **Deploy:** `.github/workflows/deploy.yml` runs format check, lint, check, build and the tests,
  then deploys to GitHub Pages on a push to `main`. The repo is `akskokki/akskokki.github.io`,
  served at https://akskokki.github.io/.
