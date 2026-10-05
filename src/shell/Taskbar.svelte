<script lang="ts">
  import { iconUrl, imageUrl } from '../art';
  import { entrance } from './entrance';
  import { toggleWindow, wm } from './windows.svelte';

  /** A window's turn in the entrance on load, which its button pops in with. */
  let { turnOf }: { turnOf: (id: string) => number | undefined } = $props();

  let time = $state(now());

  $effect(() => {
    // Ticks every second so the minute changes on time; the DOM only updates when the text does.
    const timer = setInterval(() => (time = now()), 1000);
    return () => clearInterval(timer);
  });

  function now(): string {
    const date = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
</script>

<div class="taskbar">
  <!-- Inert on purpose: the Start menu is on AGENTS.md's "Not now" list. -->
  <button class="start">
    <img src={imageUrl('startFlag')} alt="" draggable="false" />
    start
  </button>

  <div class="tasks">
    {#each wm.windows as win (win.id)}
      <button
        class="task"
        class:active={wm.activeId === win.id && !win.minimized}
        title={win.title}
        onclick={() => toggleWindow(win.id)}
        use:entrance={turnOf(win.id)}
      >
        <img src={iconUrl(win.icon, 16)} alt="" draggable="false" />
        <span>{win.title}</span>
      </button>
    {/each}
  </div>

  <div class="tray">{time}</div>
</div>

<style>
  /* Values from winXP's Footer; the Start button's greens are sampled from XP's start bitmap. */
  .taskbar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    height: var(--xp-taskbar-height);
    background: linear-gradient(
      to bottom,
      #1f2f86 0,
      #3165c4 3%,
      #3682e5 6%,
      #4490e6 10%,
      #3883e5 12%,
      #2b71e0 15%,
      #2663da 18%,
      #235bd6 20%,
      #2258d5 23%,
      #2157d6 38%,
      #245ddb 54%,
      #2562df 86%,
      #245fdc 89%,
      #2158d4 92%,
      #1d4ec0 95%,
      #1941a5 98%
    );
    color: white;
    user-select: none;
  }

  button {
    border: none;
    color: inherit;
    font: inherit;
  }

  img {
    flex: none;
  }

  .start {
    display: flex;
    flex: none;
    align-items: center;
    gap: 4px;
    height: 100%;
    margin-right: 10px;
    padding: 0 20px 2px 10px;
    border-radius: 0 10px 10px 0;
    background: linear-gradient(
      to bottom,
      #367e33 0%,
      #69ad69 12%,
      #3f9740 24%,
      #3b973c 35%,
      #42a442 55%,
      #43a743 70%,
      #419c42 82%,
      #388739 92%,
      #2f7546 100%
    );
    box-shadow: inset -4px 0 4px rgba(0, 0, 0, 0.25);
    font:
      italic bold 17px 'Franklin Gothic Medium',
      'Trebuchet MS',
      var(--xp-font);
    text-shadow: 1px 1px 1px #454c10;
  }

  .start:hover {
    filter: brightness(110%);
  }

  .start:active {
    filter: brightness(85%);
  }

  .start img {
    width: 25px;
    height: 20px;
  }

  .tasks {
    display: flex;
    flex: 1;
    gap: 3px;
    align-items: center;
    min-width: 0;
  }

  .task {
    display: flex;
    flex: 0 1 150px;
    align-items: center;
    gap: 6px;
    min-width: 0;
    height: 22px;
    padding: 0 8px;
    border-radius: 2px;
    background: #3c81f3;
    box-shadow:
      inset -1px 0 rgba(0, 0, 0, 0.3),
      inset 1px 1px 1px rgba(255, 255, 255, 0.2);
  }

  .task:hover {
    background: #53a3ff;
  }

  .task.active {
    background: #1e52b7;
    box-shadow:
      inset 0 0 1px 1px rgba(0, 0, 0, 0.2),
      inset 1px 0 1px rgba(0, 0, 0, 0.7);
  }

  .task.active:hover {
    background: #3576f3;
  }

  .task img {
    width: 16px;
    height: 16px;
  }

  .task span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* Too narrow for a readable title (many windows, or a phone): just the icon. */
  .task {
    container-type: inline-size;
  }

  @container (width < 64px) {
    .task span {
      display: none;
    }
  }

  .tray {
    display: flex;
    flex: none;
    align-items: center;
    margin-left: 10px;
    padding: 0 15px;
    border-left: 1px solid #1042af;
    background: linear-gradient(
      to bottom,
      #0c59b9 1%,
      #139ee9 6%,
      #18b5f2 10%,
      #139beb 14%,
      #1290e8 19%,
      #0d8dea 63%,
      #0d9ff1 81%,
      #0f9eed 88%,
      #119be9 91%,
      #1392e2 94%,
      #137ed7 97%,
      #095bc9 100%
    );
    box-shadow: inset 1px 0 1px #18bbff;
  }
</style>
