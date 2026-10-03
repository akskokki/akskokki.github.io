# Homepage: plan

This is the plan for the first version of this site. It's written for whoever builds it, assuming no
earlier context. `AGENTS.md` holds the standing rules (commands, conventions, git); this file holds
what to build and why. Reference material lives outside the repo, in `../references/` (see its
`README.md`).

## What this is

A personal homepage that looks like a Windows XP desktop. Visitors land on a desktop with a few windows
already open, showing who the owner is and what they've made. Desktop icons open more windows.

- **Two sides:**
  - **Homepage:** about, projects and links, for employers, collaborators and friends.
  - **Playful hobby:** little toy programs the owner makes for fun, such as small games, gadgets, and
    one day maybe a desktop pet. Expect lots of these over time; the architecture exists mainly to make
    adding one easy and contained.
- **Why XP:** it's the operating system of the owner's childhood, and that nostalgia is the emotional
  core of the site. The reaction to aim for on first load is "oh, this is cool".
- **It is not an operating system simulator.** Every feature has to earn its place by being useful or
  delightful _on a personal homepage_. Simulating more of Windows is not a goal, and the "Not now"
  list below is as important as the build list.

**This first version is a prototype.**

- Placeholder text, photos and projects everywhere. The owner will fill in real content and decide the
  final layout later.
- So build the structure well, keep the content trivially replaceable, and don't polish what's
  likely to change.

## The look

- **Pseudo-XP:** it should read as Windows XP (Luna Blue) at a glance.
  - It's not a pixel-perfect copy: clean and consistent beats accurate.
  - Match XP closely where people notice and remember it:
    - the blue title bars and frames;
    - the red close button;
    - the green Start button and blue taskbar;
    - Bliss;
    - Tahoma;
    - the beige window body (`#ECE9D8`).
  - Elsewhere, simplify freely.
  - Never spend time matching pixels against screenshots.
- **Fonts:** as close to XP as possible.
  - Interface text: `Tahoma`, 11 px.
  - Title bars: `'Trebuchet MS'` bold, 13 px, falling back to Tahoma bold.
  - Bundle Wine's free Tahoma (`../references/wine-fonts/`, LGPL, keep its licence alongside) under a
    different family name. List it after `Tahoma`, so systems without Tahoma (macOS, Linux, phones)
    still get the right look.
- **Our own minimal stylesheet.** No CSS library dependency.
  - Write only the styles the site uses, and add a value only when building the piece that needs it.
  - Get values (colours, gradients, sizes) from the references, listed in `../references/README.md`.
    `XP.css/themes/XP/` is the simplest place to start; the winXP and web-xp taskbar code covers the
    taskbar and Start button.
  - Copy values, not files.
- **Microsoft's original art as placeholders.** For now the site uses genuine XP art from the
  references:
  - the Bliss wallpaper;
  - XP icons;
  - the Start button flag.

  The site isn't public yet, and the owner may replace any of it with their own later. So the art must
  be **easy to swap and tangled with nothing** (see `src/art/` under Architecture).

- **No sound** anywhere.
- **No custom accessibility work.** Window contents are ordinary HTML, but don't spend effort on screen
  readers, keyboard navigation of the desktop, or a11y lint warnings (turn those off; see Tooling).

## The first version (milestone 1)

### The desktop

- **Wallpaper:** Bliss, covering the screen.
- **Desktop icons:** XP style, with an icon and a white label with a text shadow.
  - A click selects one (XP's blue highlight), and a double click opens it. On touch screens a single
    tap opens it.
  - Positions are set by hand in `src/desktop.ts`. Start with XP's default column down the left; the
    owner will rearrange them later.
- **The staged first view:** on load, a few windows are already open and arranged by hand, like a
  lived-in desktop. Placeholders for now:
  - **About me**, in front: a placeholder photo, "Hi, I'm [Name]", a few lines of placeholder text,
    and buttons that open Projects and Links.
  - **Projects:** a folder-style window listing placeholder projects as icons. Opening one opens a
    project window (below).
  - **A photo:** a picture-viewer window showing a placeholder image.
  - **A note:** a small Notepad-style window with a casual line such as "back in 5 min — have a look
    around".
- **Taskbar:** XP's blue taskbar along the bottom.
  - **Start button:** green and XP-styled, but inert: it does nothing when clicked.
  - **One button per open window:** clicking a window's button focuses it, minimizes it if it's
    already active, and restores it if it's minimized.
  - **Clock:** tray area on the right, showing local time as `HH:MM`.

### Windows

- XP-style frame and title bar, with a 16 px icon, title, and minimize, maximize and close buttons.
- What the window manager does:
  - **Drag** by the title bar, kept on screen.
  - **Focus and order:** clicking a window brings it to the front. The active window has the bright
    title bar; inactive ones are paler, as in XP.
  - **Minimize** to the taskbar, **maximize/restore** (also by double-clicking the title bar), and
    **close**.
  - **Resize** from the edges and corners, unless the program says its window has a fixed size (many
    toys will).
- **No animations** needed in this version.
- **The inside of a window belongs entirely to the program.** It can be anything: a page of text, a
  canvas game, something that looks nothing like XP. The window only provides a frame and a box of a
  given size.

### Programs in this version (all placeholder content)

- **About me**, as above.
- **Projects:** the folder window, plus one **project window** per project, opened with that project's
  data. A project window has:
  - a screenshot placeholder;
  - a title;
  - "What it is" and "What I did";
  - tech tags;
  - "Visit" and "Source" links that open in a new tab.

  Three to five placeholder projects, kept as data in the program's folder.

- **Links:** placeholder links (GitHub, email, …) that open in a new tab.
- **Photo viewer:** shows a placeholder image.
- **Note:** shows a few lines of text.
- **One placeholder toy:** something small and silly that proves a program can be anything. Draw it on
  a `<canvas>` or otherwise make it look unlike XP. A few ideas:
  - a Magic 8-Ball;
  - a "catch the button that runs away" game;
  - a bouncing-ball thing.

  Aim for well under 200 lines; it's a proof of concept, not a good game.

### Links to windows

Each program has a URL-safe id, and the URL hash names the window in front:

- `#/about` opens About.
- `#/projects/<slug>` opens that project's window.
- Opening a link focuses or opens that window on top of the staged view.
- Focusing a window updates the hash with `history.replaceState`, so links can be shared.
- Use hash routing only, so the site works under any path on GitHub Pages.

### Phones and small screens

Design this in from the start: it's cheap now and expensive to add later.

- **Below 640 px wide:**
  - every window opens maximized, filling the screen above the taskbar;
  - there's no dragging or resizing;
  - the taskbar switches between open windows.
- **The staged view on phones:** only About is open, maximized. Closing it shows the desktop icons.
- **Pointer events:** use them for every drag, so mouse and touch share one code path (tablets get
  dragging for free).
- **Small windows:** each program handles a small window its own way. A toy that can't work on a phone
  may simply say "best on a computer".
- **Not on phones:** no separate mobile design, gestures, or app-style navigation.

## Not now

Out of scope for this version. Don't build these, and don't build hooks "for later" either:

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
- Accessibility work beyond ordinary HTML.

## Architecture

The core idea: the **shell** (desktop, windows, taskbar, the XP look) and the **programs** (what's
inside windows) are cleanly separate. **One hand-written file**, `src/desktop.ts`, connects them.
Nothing is auto-discovered. The owner decides by hand what appears where.

```
src/
  main.ts               mounts App
  App.svelte            renders the shell with the desktop configuration
  desktop.ts            THE one file that knows both sides (see below)
  shell/                the "operating system"
    windows.svelte.ts   window manager: the only place window state lives
    Desktop.svelte, Window.svelte, Taskbar.svelte, DesktopIcon.svelte, ...
    theme/              the XP stylesheet and fonts
  kit/                  everything a program may import
    index.ts            window handle type, art lookup, shared helpers
    xp.css              opt-in XP widget classes (buttons, fields, …) for programs that want them
  art/                  every piece of Microsoft placeholder art, and nothing else
    index.ts            looks art up by name; the only file that imports art files
    README.md           where each file came from
  programs/
    about/  projects/  links/  photo/  note/  <toy>/
      each holds its component(s) plus anything else it needs (data, helpers, assets)
```

### `src/desktop.ts`, the single join point

It lists, by hand:

- every program: its id, title, icon name, and default window size and position;
- whether a program's window has a fixed size;
- how to load its component, lazily, as `() => import('./programs/about/About.svelte')`, so each
  program ships as its own download, fetched when first opened;
- desktop icon positions;
- which windows the staged view opens on load, where they sit, and which is in front;
- the phone variant of the staged view.

Adding a program means creating its folder and adding an entry here, nothing else.

### The program contract

- A program is a Svelte component that receives two props:
  - `win`, a small window handle (set the title, close, open another program, the window's id);
  - for programs opened with data (a project window), that data.
- The handle is the program's entire interface to the shell. Keep it small, so that shell changes
  rarely break programs.
- Inside its window a program may do anything.

### Import boundaries, enforced by oxlint's `no-restricted-imports`

- `shell/` never imports `programs/` or `desktop.ts`; it receives the configuration as props from
  `App.svelte`.
- `programs/<x>/` imports only `kit/`, its own folder and npm packages. It never imports `shell/`,
  `art/` directly, or another program.
- Only `art/index.ts` imports files from `art/`. Everything else asks for art by name, through `kit`
  in programs. To replace a placeholder, swap the file or change its entry there; no other code
  changes.

### Styles

- **Shell chrome** (frames, title bars, taskbar, icons) is styled inside shell components with Svelte's
  scoped styles, plus shared values (colours, fonts) as CSS custom properties from `shell/theme/`.
- **No global element styles** that leak into windows (no bare `button { … }`), because programs must be
  free to look like anything.
- **Programs that want XP widgets** opt in with classes from `kit/xp.css` (for example
  `class="xp-button"`).
- The global stylesheet only sets the page basics: fonts, box sizing, the full-screen layout.

### State

- Window state lives in one `.svelte.ts` module using runes: open windows, their positions and sizes,
  z-order, the active window, and minimized and maximized flags.
- Components read it and call its functions; they never change window state directly.

## Tooling

- **Stack:**
  - Svelte 5 with runes only;
  - Vite;
  - TypeScript, strict;
  - pnpm, as a single package (no workspaces);
  - a static build deployed to GitHub Pages.
- **Versions:**
  - **Node 26:** add a `.nvmrc` with `26`.
  - **pnpm:** set by the `packageManager` field in `package.json`, e.g. `"packageManager": "pnpm@12.9.1"`.
  - **TypeScript 6.x:** check svelte-check's peer dependencies when installing, and use TypeScript 7
    only if svelte-check supports it. oxlint's type-aware rules (`oxlint-tsgolint`) bundle their own
    TypeScript, so they don't care.

**Dev dependencies:**

- `svelte`
- `vite`
- `@sveltejs/vite-plugin-svelte`
- `typescript`
- `@tsconfig/svelte`
- `svelte-check`
- `oxlint`
- `oxlint-tsgolint`
- `oxfmt`
- `knip`

**Scripts** in `package.json`:

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "check": "svelte-check --tsconfig ./tsconfig.json --fail-on-warnings",
  "lint": "oxlint && node scripts/check-ignore-reasons.js && knip",
  "format": "oxfmt",
  "format:check": "oxfmt --check"
}
```

**Configuration:**

- **`tsconfig.json`:**
  - extends `@tsconfig/svelte/tsconfig.json`;
  - `target` `ES2023`, `module` `ESNext`, `moduleResolution` `bundler`, `types: ["vite/client"]`;
  - `strict`, `noEmit`, `skipLibCheck`, `noUnusedLocals`, `noUnusedParameters`;
  - includes `src/**/*.ts` and `src/**/*.svelte`.
- **`svelte.config.js`:**
  - `vitePreprocess()` and `compilerOptions: { runes: true }`;
  - filter out a11y warnings (codes starting with `a11y`), so neither `vite` nor `svelte-check` reports
    them. Check that svelte-check honours the filter; if not, pass the codes to its
    `--compiler-warnings` option instead.
- **`vite.config.ts`:** the Svelte plugin and `base: './'`. Together with hash routing, that keeps the
  build host-agnostic: it works at a domain root or under `/repo/`.
- **`.oxfmtrc.json`:**
  ```json
  { "singleQuote": true, "printWidth": 100, "sortImports": true, "svelte": true }
  ```
  plus `$schema` pointing into `node_modules/oxfmt`.
- **`.oxlintrc.json`:**
  - **Plugins:** `eslint`, `typescript`, `unicorn`, `oxc`, `import`, `promise`.
  - **Categories as errors:** `correctness`, `suspicious` and `perf`.
  - **Options:** `typeAware: true`, `denyWarnings: true`, `reportUnusedDisableDirectives: "error"`.
  - **Ignored paths:** `dist/**` and `.svelte-check/**`.
  - **Rules:**
    - `no-console`: error, allowing `warn` and `error`.
    - `import/no-unassigned-import`: allow `**/*.css`.
    - `unicorn/consistent-function-scoping`: off.
    - As errors: `typescript/no-explicit-any`, `no-non-null-assertion`, `no-floating-promises`,
      `no-misused-promises`, `await-thenable`, `no-unsafe-argument`, `no-unsafe-assignment`,
      `no-unsafe-call`, `no-unsafe-member-access`, `no-unsafe-return`, `switch-exhaustiveness-check`,
      `no-unnecessary-type-assertion`, `restrict-template-expressions`, `no-base-to-string`,
      `only-throw-error`, `no-deprecated`.
    - `typescript/ban-ts-comment`: `ts-expect-error` allowed with a description of at least 10
      characters.
    - `no-restricted-imports`:
      - bans `svelte/store` everywhere (use runes);
      - `overrides` per folder enforce the import boundaries above (`src/shell/**`,
        `src/programs/*/**`, and everything except `src/art/index.ts` for `src/art/`).
  - **An override for `scripts/**`:**
    - allow `console` and `no-await-in-loop`;
    - turn off the `no-unsafe-*` rules: plain Node scripts have no types.
- **`scripts/check-ignore-reasons.js`:**
  - Every lint or Svelte warning suppression must give a reason after `--`, as in
    `// oxlint-disable-next-line rule -- why` or `<!-- svelte-ignore code -- why -->`.
  - The script scans `src/` for `oxlint-disable`, `eslint-disable` and `svelte-ignore` comments
    without ` -- <reason>`, prints each with file and line, and exits 1 if any are found.
- **knip** reports unused files, exports and dependencies. Configure it for Svelte and Vite, and leave
  `art/` files to its normal unused-file check, since they're referenced from `art/index.ts`.
- **`.gitignore`:** `node_modules`, `dist`, `.DS_Store`.
- **`index.html`:**
  - the viewport meta tag;
  - a title of `[Name]` (a placeholder);
  - a favicon from the art folder;
  - `<div id="app">`.

**Deploy** with `.github/workflows/deploy.yml`:

- runs on a push to `main`, plus `workflow_dispatch`;
- permissions: `contents: read`, `pages: write`, `id-token: write`; a concurrency group `pages`;
- **build job:**
  - checkout, `pnpm/action-setup` (reads `packageManager`), `actions/setup-node` with
    `node-version-file: .nvmrc` and `cache: pnpm`;
  - `pnpm install --frozen-lockfile`, then `pnpm format:check`, `pnpm lint`, `pnpm check`,
    `pnpm build`;
  - `actions/configure-pages` and `actions/upload-pages-artifact` with `path: dist`;
- **deploy job:** `actions/deploy-pages`;
- use the current major version of each action.

The repo isn't on GitHub yet, and the owner will create it. Write the workflow anyway; it does nothing
until the repo is pushed.

## Order of work

Commit after each step that leaves the site working.

1. **Scaffold the tooling** above: install, configure, and an empty Svelte app that passes
   `pnpm format && pnpm lint && pnpm check && pnpm build`.
2. **Art and theme:**
   - copy the placeholder art from `../references/` into `src/art/` with its `README.md` and the
     by-name lookup;
   - add the fonts (Wine Tahoma);
   - set the page basics and the Bliss desktop.
3. **The window manager and `Window.svelte`:** drag, focus, minimize, maximize, close, resize, the
   fixed-size option and the small-screen rule. Test it with a dummy program.
4. **Taskbar:** the inert Start button, window buttons and the clock.
5. **Desktop icons**, and **`desktop.ts`** with the staged view.
6. **The placeholder programs:** About, Projects with its project windows, Links, Photo and Note.
7. **The placeholder toy.**
8. **Window links** (`#/…`) and the phone version of the staged view.
9. **Look at the result** in a browser at desktop width (around 1280 px) and phone width (around
   390 px), fix what's off, and update `AGENTS.md` with the architecture as built.

## Open questions (the owner's to decide later; don't decide them in code)

- The final desktop layout and icon arrangement.
- Real content: about text, photos, the project list.
- Whether the Start menu ever does something, and what.
- Which art to replace with the owner's own, and when.
- A signature personal touch for first-time visitors, if any.
- More toys, and eventually programs outside windows (desktop pets).
- The GitHub repo name and the address the site is served at.
