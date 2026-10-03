<script lang="ts">
  import { onMount } from 'svelte';

  import { imageUrl } from '../art';
  import type { WindowHandle } from '../kit';

  import './theme/theme.css';
  import Taskbar from './Taskbar.svelte';
  import type { ProgramDefinition, StagedWindow } from './types';
  import Window from './Window.svelte';
  import { closeWindow, deactivate, openWindow, setArea, setTitle, wm } from './windows.svelte';

  interface Props {
    programs: readonly ProgramDefinition[];
    /** Opened on load, back to front. */
    staged: readonly StagedWindow[];
  }

  let { programs, staged }: Props = $props();

  const programsById = $derived(new Map(programs.map((program) => [program.id, program])));

  let areaWidth = $state(window.innerWidth);
  let areaHeight = $state(window.innerHeight);
  $effect(() => setArea(areaWidth, areaHeight));

  onMount(() => {
    for (const { program, x, y } of staged) open(program, x, y);
  });

  function open(programId: string, x?: number, y?: number) {
    const program = programsById.get(programId);
    if (!program) {
      console.error(`There's no program with the id "${programId}".`);
      return;
    }
    openWindow({
      id: program.id,
      title: program.title,
      icon: program.icon,
      x: x ?? program.x,
      y: y ?? program.y,
      width: program.width,
      height: program.height,
      fixedSize: program.fixedSize ?? false,
    });
  }

  function handleFor(id: string): WindowHandle {
    return {
      id,
      setTitle: (title) => setTitle(id, title),
      close: () => closeWindow(id),
      open: (programId) => open(programId),
    };
  }
</script>

<div class="desktop" style:background-image="url({imageUrl('bliss')})">
  <div
    class="windows"
    bind:clientWidth={areaWidth}
    bind:clientHeight={areaHeight}
    onpointerdown={(event) => {
      if (event.target === event.currentTarget) deactivate();
    }}
  >
    {#each wm.windows as win (win.id)}
      {@const program = programsById.get(win.id)}
      <Window {win}>
        {#if program}
          {#await program.load() then { default: Program }}
            <Program win={handleFor(win.id)} />
          {:catch}
            <p class="load-error">Couldn't load {program.title}.</p>
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

  .windows {
    position: absolute;
    inset: 0 0 var(--xp-taskbar-height);
    isolation: isolate;
  }

  .load-error {
    margin: 8px;
  }
</style>
