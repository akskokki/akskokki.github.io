<script lang="ts">
  import { type Component, onMount } from 'svelte';

  import { imageUrl } from '../art';
  import type { ProgramProps, WindowHandle } from '../kit';

  import './theme/theme.css';
  import DesktopIcon from './DesktopIcon.svelte';
  import { type PickedLayout, pickLayout } from './layout';
  import Taskbar from './Taskbar.svelte';
  import type { IconPlacement, Layout, ProgramDefinition } from './types';
  import Window from './Window.svelte';
  import { closeWindow, deactivate, openWindow, setArea, setTitle, wm } from './windows.svelte';

  interface Props {
    programs: readonly ProgramDefinition[];
    icons: readonly IconPlacement[];
    /** Biggest first; see `pickLayout`. */
    layouts: readonly Layout[];
  }

  let { programs, icons, layouts }: Props = $props();

  const programsById = $derived(new Map(programs.map((program) => [program.id, program])));

  // Desktop state, not window state, so it lives here rather than in the window manager.
  let selectedIcon = $state<string | null>(null);

  let area: HTMLElement;
  let areaWidth = $state(window.innerWidth);
  let areaHeight = $state(window.innerHeight);
  $effect(() => setArea(areaWidth, areaHeight));

  // The layout for the screen the site loads on. It's picked once: a browser resized later keeps
  // it, and its windows are only kept on screen.
  let picked: PickedLayout;

  // Read before anything rewrites the hash: a link such as #/projects/some-slug opens that window
  // on top of the staged view.
  const linkedPath = pathFromHash();

  onMount(() => {
    // Measured here rather than through the bindings, which only update after the first layout.
    picked = pickLayout(layouts, area.clientWidth, area.clientHeight);
    for (const path of picked.layout.staged) open(path);
    if (linkedPath) open(linkedPath);
  });

  // The hash names the window in front, so the address can be shared as a link to it.
  $effect(() => {
    const id = wm.activeId;
    history.replaceState(history.state, '', id ? `#/${id}` : location.pathname + location.search);
  });

  function pathFromHash(): string {
    return location.hash.replace(/^#\/?/, '');
  }

  /** The program a window path belongs to, and its argument for `id/*` programs. */
  function resolve(path: string): { program: ProgramDefinition; arg?: string } | undefined {
    const program = programsById.get(path);
    // `projects/*` itself names no window, only the pattern for its arguments.
    if (program && !program.id.endsWith('/*')) return { program };
    const slash = path.indexOf('/');
    const withArg = slash > 0 && programsById.get(`${path.slice(0, slash)}/*`);
    if (withArg && slash < path.length - 1) return { program: withArg, arg: path.slice(slash + 1) };
    return undefined;
  }

  function open(path: string) {
    const resolved = resolve(path);
    if (!resolved) {
      console.error(`There's no program for the path "${path}".`);
      return;
    }
    const { program, arg } = resolved;
    const { layout, dx, dy } = picked;
    const placement = layout.windows[program.id];
    const width = placement?.width ?? program.width;
    const height = placement?.height ?? program.height;
    // Windows of the same `id/*` program cascade rather than opening on top of each other.
    const prefix = program.id.slice(0, -1);
    const offset = arg ? 24 * wm.windows.filter((win) => win.id.startsWith(prefix)).length : 0;
    openWindow(path, {
      ...program,
      x: (placement ? placement.x + dx : Math.round((areaWidth - width) / 2)) + offset,
      y: (placement ? placement.y + dy : Math.round((areaHeight - height) / 2)) + offset,
      width,
      height,
    });
  }

  async function load(program: ProgramDefinition): Promise<Component<ProgramProps>> {
    // Passing props to a program that ignores them is harmless.
    return (await program.load()).default as Component<ProgramProps>;
  }

  function handleFor(id: string): WindowHandle {
    return {
      id,
      setTitle: (title) => setTitle(id, title),
      close: () => closeWindow(id),
      open: (path) => open(path),
    };
  }
</script>

<svelte:window
  onhashchange={() => {
    const path = pathFromHash();
    if (path) open(path);
  }}
/>

<div class="desktop" style:background-image="url({imageUrl('bliss')})">
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
      {@const program = resolve(path)?.program}
      {#if program}
        <DesktopIcon
          icon={program.icon}
          label={program.title}
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

    {#each wm.windows as win (win.id)}
      {@const resolved = resolve(win.id)}
      <Window {win}>
        {#if resolved}
          {#await load(resolved.program) then Program}
            <Program win={handleFor(win.id)} arg={resolved.arg} />
          {:catch}
            <p class="load-error">Couldn't load {resolved.program.title}.</p>
          {/await}
        {/if}
      </Window>
    {/each}
  </div>

  <Taskbar />
</div>

<style>
  .desktop {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: var(--xp-desktop) center / cover no-repeat;
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
