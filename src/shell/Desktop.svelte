<script lang="ts">
  import { type Component, onMount, tick, untrack } from 'svelte';

  import type { ProgramProps, WindowHandle } from '../kit';
  import { afterLoad } from '../kit/afterLoad';

  import './theme/theme.css';
  import DesktopIcon from './DesktopIcon.svelte';
  import { pickLayout } from './layout';
  import { LAYOUT_TOOL, layoutToolSpec } from './layoutTool';
  import LayoutTool from './LayoutTool.svelte';
  import { labelOf, resolve, titleOf } from './paths';
  import Taskbar from './Taskbar.svelte';
  import TimeTool, { TIME_TOOL, timeToolSpec } from './TimeTool.svelte';
  import type { IconPlacement, Layout, ProgramDefinition } from './types';
  import Wallpaper from './wallpaper/Wallpaper.svelte';
  import Window from './Window.svelte';
  import {
    closeWindow,
    deactivate,
    focusWindow,
    fitWindow,
    moveWindow,
    openWindow,
    replaceWindow,
    setArea,
    setTitle,
    wm,
  } from './windows.svelte';

  interface Props {
    programs: readonly ProgramDefinition[];
    icons: readonly IconPlacement[];
    /** Biggest first; see `pickLayout`. */
    layouts: readonly Layout[];
  }

  let { programs, icons, layouts }: Props = $props();

  // Desktop state, not window state, so it lives here rather than in the window manager.
  let selectedIcon = $state<string | null>(null);

  let area: HTMLElement;
  let areaWidth = $state(window.innerWidth);
  let areaHeight = $state(window.innerHeight);
  $effect(() => setArea(areaWidth, areaHeight));

  // The layout for the screen the site loads on. It's picked once: a browser resized later keeps
  // it, and its windows are only kept on screen; only the dev-only layout tool picks again. This
  // first pick is a stand-in until `restage` measures the area on mount.
  let picked = $state.raw(
    untrack(() => pickLayout(layouts, programs, window.innerWidth, window.innerHeight)),
  );

  // Read before anything rewrites the hash: a link such as #/projects/some-slug opens that window
  // on top of the staged view.
  const linkedPath = pathFromHash();

  // Windows wait for Wine Tahoma, which index.html preloads, so their text doesn't show in another
  // font first, but for a second at most.
  const fonts = Promise.race([
    Promise.all(['13px', 'bold 13px'].map((font) => document.fonts.load(`${font} "Wine Tahoma"`))),
    new Promise((done) => setTimeout(done, 1000)),
  ]).catch(() => {});

  // On load, the staged windows pop in one after another, each with its taskbar button, in taskbar
  // order, and a linked one last. Only while they mount: windows opened later just appear.
  let entering = $state(true);

  function turnOf(path: string): number | undefined {
    if (!entering) return undefined;
    const index = picked.layout.staged.indexOf(path);
    return index === -1 ? picked.layout.staged.length : index;
  }

  onMount(async () => {
    // A linked window's program loads alongside the staged ones, so it opens with them.
    await Promise.all([restage(), linkedPath && preload(programOf(linkedPath))]);
    if (linkedPath) open(linkedPath);
    await tick();
    entering = false;
    // Then every other program, once the page has loaded, so a window opened later doesn't wait on
    // the network, and still opens after a deploy has replaced the files it was loaded from.
    await afterLoad();
    await Promise.all(programs.map(preload));
  });

  // The time the wallpaper shows instead of now, chosen in the dev-only time tool.
  let wallpaperTime = $state<Date | null>(null);

  const layoutToolOpen = $derived(
    import.meta.env.DEV && wm.windows.some((win) => win.id === LAYOUT_TOOL),
  );

  /** Closes every window and opens the staged view of the layout for the area as it is now. */
  let restages = 0;

  async function restage() {
    const run = ++restages;
    // Measured rather than read from the bindings, which only update after the first layout.
    picked = pickLayout(layouts, programs, area.clientWidth, area.clientHeight);
    const { staged, stack = [] } = picked.layout;
    // Every staged program loads, with the fonts, before any window opens, so the view enters in
    // order rather than window by window as each program arrives.
    await Promise.all([fonts, ...staged.map((path) => preload(programOf(path)))]);
    // A newer restage started while this one loaded, so the view is that one's to open.
    if (run !== restages) return;
    for (const { id } of wm.windows) if (id !== LAYOUT_TOOL && id !== TIME_TOOL) closeWindow(id);
    for (const path of staged) open(path);
    for (const path of stack) focusWindow(path);
    if (layoutToolOpen) {
      const { x, y } = layoutToolSpec(
        { width: area.clientWidth, height: area.clientHeight },
        layouts.length,
      );
      moveWindow(LAYOUT_TOOL, x, y);
      // Back in front, unless it's minimized: focusing would restore it.
      if (!wm.windows.find((win) => win.id === LAYOUT_TOOL)?.minimized) focusWindow(LAYOUT_TOOL);
    }
  }

  // While the layout tool is open, a resized browser gets its layout's staged view, once the
  // resizing pauses.
  let restageTimer: ReturnType<typeof setTimeout> | undefined;
  function onResize() {
    if (!layoutToolOpen) return;
    clearTimeout(restageTimer);
    restageTimer = setTimeout(restage, 150);
  }

  // The hash names the window in front, so the address can be shared as a link to it.
  $effect(() => {
    const id = wm.activeId;
    history.replaceState(history.state, '', id ? `#/${id}` : location.pathname + location.search);
  });

  function pathFromHash(): string {
    return location.hash.replace(/^#\/?/, '');
  }

  function open(path: string, over?: Element) {
    if (import.meta.env.DEV && path === LAYOUT_TOOL) {
      openWindow(
        LAYOUT_TOOL,
        layoutToolSpec({ width: areaWidth, height: areaHeight }, layouts.length),
      );
      return;
    }
    if (import.meta.env.DEV && path === TIME_TOOL) {
      openWindow(TIME_TOOL, timeToolSpec({ width: areaWidth, height: areaHeight }));
      return;
    }
    const resolved = resolve(programs, path);
    if (!resolved) {
      console.error(`There's no program for the path "${path}".`);
      return;
    }
    const { program, arg } = resolved;
    const current =
      program.single &&
      wm.windows.find((win) => win.id !== path && resolve(programs, win.id)?.program === program);
    if (current) {
      replaceWindow(current.id, path, titleOf(resolved));
      focusWindow(path);
      return;
    }
    const { layout, dx, dy } = picked;
    const own = layout.windows[path];
    const placement = own ?? layout.windows[program.id];
    // Windows of the same `id/*` program cascade rather than opening on top of each other, unless
    // the layout gives this one its own place.
    const prefix = program.id.slice(0, -1);
    const offset =
      arg && !own ? 24 * wm.windows.filter((win) => win.id.startsWith(prefix)).length : 0;
    const width = placement?.width ?? program.width;
    const fullHeight = placement?.height ?? program.height;
    const height =
      placement?.bottom === undefined
        ? fullHeight
        : Math.min(fullHeight, areaHeight - placement.bottom - (placement.y + dy + offset));
    let x = (placement ? placement.x + dx : Math.round((areaWidth - width) / 2)) + offset;
    let y = (placement ? placement.y + dy : Math.round((areaHeight - height) / 2)) + offset;
    if (over) {
      const box = over.getBoundingClientRect();
      const origin = area.getBoundingClientRect();
      x = Math.round(box.left - origin.left + (box.width - width) / 2);
      y = Math.round(box.top - origin.top + (box.height - height) / 2);
    }
    openWindow(path, { ...program, title: titleOf(resolved), x, y, width, height });
  }

  // Each program once it has loaded, so its windows from then on draw at once rather than a frame
  // later, as when one turns to another argument.
  const loaded = new Map<ProgramDefinition, Component<ProgramProps>>();

  function load(
    program: ProgramDefinition,
  ): Component<ProgramProps> | Promise<Component<ProgramProps>> {
    return (
      loaded.get(program) ??
      program.load().then((module) => {
        // Passing props to a program that ignores them is harmless.
        const component = module.default as Component<ProgramProps>;
        loaded.set(program, component);
        return component;
      })
    );
  }

  /**
   * Loads a program, so its windows draw as soon as they open. A program that fails to load still
   * gets its window, which says so.
   */
  async function preload(program: ProgramDefinition | undefined): Promise<void> {
    if (!program) return;
    try {
      await load(program);
    } catch {
      // Its window shows the failure.
    }
  }

  function programOf(path: string): ProgramDefinition | undefined {
    return resolve(programs, path)?.program;
  }

  function handleFor(id: string): WindowHandle {
    return {
      id,
      setTitle: (title) => setTitle(id, title),
      close: () => closeWindow(id),
      open: (path, over) => open(path, over),
      fit: (by) => fitWindow(id, by),
    };
  }
</script>

<svelte:window
  onhashchange={() => {
    const path = pathFromHash();
    if (path) open(path);
  }}
  onresize={onResize}
/>

<div class="desktop">
  <Wallpaper time={wallpaperTime} />

  <div
    class="area"
    bind:this={area}
    bind:clientWidth={areaWidth}
    bind:clientHeight={areaHeight}
    onpointerdown={(event) => {
      if (event.target !== event.currentTarget) return;
      deactivate();
      selectedIcon = null;
    }}
  >
    {#each icons as { path, x, y } (path)}
      {@const resolved = resolve(programs, path)}
      {#if resolved}
        <DesktopIcon
          icon={resolved.program.icon}
          label={labelOf(resolved)}
          {x}
          {y}
          selected={selectedIcon === path && wm.activeId === null}
          onselect={() => {
            deactivate();
            selectedIcon = path;
          }}
          onopen={() => open(path)}
        />
      {/if}
    {/each}

    {#if import.meta.env.DEV}
      <DesktopIcon
        icon="computer"
        label="Layouts"
        x={areaWidth - 84}
        y={areaHeight - 80}
        selected={selectedIcon === LAYOUT_TOOL && wm.activeId === null}
        onselect={() => {
          deactivate();
          selectedIcon = LAYOUT_TOOL;
        }}
        onopen={() => open(LAYOUT_TOOL)}
      />
      <DesktopIcon
        icon="dateTime"
        label="Time of day"
        x={areaWidth - 84}
        y={areaHeight - 160}
        selected={selectedIcon === TIME_TOOL && wm.activeId === null}
        onselect={() => {
          deactivate();
          selectedIcon = TIME_TOOL;
        }}
        onopen={() => open(TIME_TOOL)}
      />
    {/if}

    {#each wm.windows as win (win.id)}
      {@const resolved = resolve(programs, win.id)}
      {#if import.meta.env.DEV && win.id === LAYOUT_TOOL}
        <Window {win}>
          <LayoutTool
            {layouts}
            {picked}
            area={{ width: areaWidth, height: areaHeight }}
            onreset={restage}
          />
        </Window>
      {:else if import.meta.env.DEV && win.id === TIME_TOOL}
        <Window {win}>
          <TimeTool time={wallpaperTime} onchange={(time) => (wallpaperTime = time)} />
        </Window>
      {:else if resolved}
        <!-- Drawn once its program has loaded, so a window never shows empty, and a program that
             fits its window to its contents does so before it's first seen. -->
        {#await load(resolved.program) then Program}
          <Window {win} turn={turnOf(win.id)}>
            <Program win={handleFor(win.id)} arg={resolved.arg} />
          </Window>
        {:catch}
          <Window {win}>
            <p class="load-error">Couldn't load {resolved.program.title}.</p>
          </Window>
        {/await}
      {/if}
    {/each}
  </div>

  <Taskbar {turnOf} />
</div>

<style>
  .desktop {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: var(--xp-desktop);
  }

  .area {
    position: absolute;
    inset: 0 0 var(--xp-taskbar-height);
    isolation: isolate;
  }

  .load-error {
    margin: 8px;
  }
</style>
