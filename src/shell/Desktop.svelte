<script lang="ts">
  import { type Component, onMount } from 'svelte';

  import { imageUrl } from '../art';
  import type { ProgramProps, WindowHandle } from '../kit';

  import './theme/theme.css';
  import DesktopIcon from './DesktopIcon.svelte';
  import Taskbar from './Taskbar.svelte';
  import type { IconPlacement, ProgramDefinition, StagedWindow } from './types';
  import Window from './Window.svelte';
  import { closeWindow, deactivate, openWindow, setArea, setTitle, wm } from './windows.svelte';

  interface Props {
    programs: readonly ProgramDefinition[];
    icons: readonly IconPlacement[];
    /** Opened on load, back to front. */
    staged: readonly StagedWindow[];
    /** Opened on load instead of `staged` on a small screen. */
    stagedPhone: readonly StagedWindow[];
  }

  let { programs, icons, staged, stagedPhone }: Props = $props();

  const programsById = $derived(new Map(programs.map((program) => [program.id, program])));

  // Desktop state, not window state, so it lives here rather than in the window manager.
  let selectedIcon = $state<string | null>(null);

  let areaWidth = $state(window.innerWidth);
  let areaHeight = $state(window.innerHeight);
  $effect(() => setArea(areaWidth, areaHeight));

  // Read before anything rewrites the hash: a link such as #/projects/some-slug opens that window
  // on top of the staged view.
  const linkedPath = pathFromHash();

  onMount(() => {
    for (const { path, x, y } of wm.compact ? stagedPhone : staged) open(path, x, y);
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
    if (program) return { program };
    const slash = path.indexOf('/');
    const withArg = slash > 0 && programsById.get(`${path.slice(0, slash)}/*`);
    if (withArg && slash < path.length - 1) return { program: withArg, arg: path.slice(slash + 1) };
    return undefined;
  }

  function open(path: string, x?: number, y?: number) {
    const resolved = resolve(path);
    if (!resolved) {
      console.error(`There's no program for the path "${path}".`);
      return;
    }
    const { program, arg } = resolved;
    // Windows of the same `id/*` program cascade rather than opening on top of each other.
    const prefix = program.id.slice(0, -1);
    const offset = arg ? 24 * wm.windows.filter((win) => win.id.startsWith(prefix)).length : 0;
    openWindow({
      id: path,
      title: program.title,
      icon: program.icon,
      x: (x ?? program.x) + offset,
      y: (y ?? program.y) + offset,
      width: program.width,
      height: program.height,
      fixedSize: program.fixedSize ?? false,
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
