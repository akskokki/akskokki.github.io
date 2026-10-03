# AGENTS.md

A personal homepage that looks like a Windows XP desktop: a few windows open on load (about,
projects, a photo, a note), desktop icons that open more, and a taskbar. Besides the homepage
content, it's a home for small toy programs the owner makes for fun, each in its own window.

Stack: Svelte 5 (runes) + Vite + TypeScript, pnpm, deployed to GitHub Pages as a static site.

**Read `PLAN.md` first.** It describes what to build, the architecture and the "Not now" list.
Reference material (XP CSS, React XP recreations, screenshots of real XP, placeholder art, fonts) is in
`../references/`; its `README.md` says where to look for what.

## Principles

- **A homepage, not an OS simulator.** Build only what's useful or delightful on a personal homepage.
  When something would just recreate more of Windows, leave it out. Check the "Not now" list in
  `PLAN.md` before adding anything.
- **Pseudo-XP.** Recognisably Windows XP, but clean and consistent rather than pixel-perfect. Don't
  match pixels against screenshots.
- **Minimal stylesheet.** Add a style or value only when the piece that needs it is being built. Take
  values from `../references/`; copy values, not files. No CSS library dependency.
- **Prototype content.** Text, photos and projects are placeholders. Keep content in data or in the
  program's own folder so it's trivial to replace.
- **The shell and the programs stay separate.** Only `src/desktop.ts` knows both. A program's window
  contents are entirely its own.

## Commands

```sh
pnpm dev           # dev server, http://localhost:5173
pnpm check         # svelte-check (types), fails on any error or warning
pnpm lint          # oxlint (incl. type-aware rules) + suppression reasons + knip
pnpm format        # oxfmt: format everything, sorts imports (format:check only reports)
pnpm build         # production build into dist/
pnpm preview       # serve dist/, http://localhost:4173
```

Before finishing a change, run `pnpm format && pnpm lint && pnpm check && pnpm build`. For UI changes,
also look at the result in a browser at desktop (~1280 px) and phone (~390 px) widths.

## Architecture rules

(Expand this section as the code takes shape; `PLAN.md` has the full design.)

- `src/shell/` is the desktop, windows, taskbar and XP look. It never imports `src/programs/` or
  `src/desktop.ts`; it gets the desktop configuration as props.
- `src/programs/<name>/` is one program per folder. It imports only `src/kit/`, its own files and npm
  packages, never the shell, `src/art/` or another program.
- `src/desktop.ts` is the single, hand-written list of programs, icon positions and the staged first
  view. Nothing is auto-discovered.
- `src/art/` holds every piece of Microsoft placeholder art. Only `src/art/index.ts` imports those
  files; everything else asks for art by name. Each file's origin is listed in `src/art/README.md`.
- Window state lives only in the shell's window manager module. Components call its functions rather
  than changing window state themselves.
- No global element styles that leak into windows. Programs opt into XP widgets with `kit/xp.css`
  classes.
- oxlint's `no-restricted-imports` enforces these boundaries and bans `svelte/store`.

## Conventions

- **Svelte 5 runes only** (`$state`, `$derived`, `$effect`, `$props`): no `export let`, no stores.
  Shared reactive modules use the `.svelte.ts` extension.
- **No unused code:** unused imports, variables and parameters are type errors. In `.svelte` markup
  only svelte-check sees them, because oxlint reads `<script>` blocks only.
- **Fix rather than suppress.** Keep svelte-check and oxlint free of warnings. If a suppression is
  truly needed, make it targeted and give the reason after `--`:
  `// oxlint-disable-next-line rule -- why`, `<!-- svelte-ignore code -- why -->`. `pnpm lint` fails on
  suppressions without a reason.
- **Accessibility warnings are switched off** on purpose (see `PLAN.md`); don't add suppressions for
  them.
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

## Git & deploy

- **Commit messages:** Conventional Commits with lowercase subjects (`feat: add taskbar clock`,
  `fix: keep windows on screen`), and no body unless something important can't fit in the subject.
- **One concern per commit:** separate concerns go in separate commits.
- **Linear history:** rebase or fast-forward, never merge commits.
- **Commit and push only when asked.** Small local commits during a task the owner asked for are
  fine; never push without being asked.
- **Deploy:** `.github/workflows/deploy.yml` runs format check, lint, check and build, then deploys to
  GitHub Pages on a push to `main`. The repo isn't on GitHub yet.
