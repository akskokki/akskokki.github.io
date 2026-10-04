<script lang="ts">
  import type { Snippet } from 'svelte';

  import { iconUrl } from '../art';
  import {
    closeWindow,
    type Edge,
    focusWindow,
    minimizeWindow,
    moveWindow,
    type Rect,
    rectOf,
    resizeWindow,
    toggleMaximize,
    type WindowState,
    wm,
  } from './windows.svelte';

  interface Props {
    win: Readonly<WindowState>;
    children: Snippet;
  }

  let { win, children }: Props = $props();

  const EDGES: Edge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

  const rect = $derived(rectOf(win));
  const active = $derived(wm.activeId === win.id);
  const canResize = $derived(!win.fixedSize && !win.maximized);

  // Plain variables, not state: only the pointer handlers read them.
  let dragOffset: { x: number; y: number } | null = null;
  let resizing: { edge: Edge; start: Rect; pointerX: number; pointerY: number } | null = null;

  function onTitlePointerDown(event: PointerEvent & { currentTarget: HTMLElement }) {
    if (event.button !== 0 || win.maximized || isOnButton(event)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOffset = { x: event.clientX - rect.x, y: event.clientY - rect.y };
  }

  function onTitlePointerMove(event: PointerEvent) {
    if (dragOffset) moveWindow(win.id, event.clientX - dragOffset.x, event.clientY - dragOffset.y);
  }

  function onTitleDoubleClick(event: MouseEvent) {
    if (!isOnButton(event)) toggleMaximize(win.id);
  }

  function onEdgePointerDown(event: PointerEvent & { currentTarget: HTMLElement }, edge: Edge) {
    if (event.button !== 0) return;
    // The edges overlap the window's contents, and a press there could start the browser's own
    // drag of a link underneath, which cancels this one.
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizing = { edge, start: rect, pointerX: event.clientX, pointerY: event.clientY };
  }

  function onEdgePointerMove(event: PointerEvent) {
    if (!resizing) return;
    const { edge, start, pointerX, pointerY } = resizing;
    resizeWindow(win.id, edge, start, event.clientX - pointerX, event.clientY - pointerY);
  }

  function isOnButton(event: Event): boolean {
    return event.target instanceof Element && event.target.closest('button') !== null;
  }
</script>

<div
  class="window"
  class:active
  class:maximized={win.maximized}
  hidden={win.minimized}
  style:left="{rect.x}px"
  style:top="{rect.y}px"
  style:width="{rect.width}px"
  style:height="{rect.height}px"
  style:z-index={win.z}
  onpointerdowncapture={() => focusWindow(win.id)}
>
  <div
    class="title-bar"
    onpointerdown={onTitlePointerDown}
    onpointermove={onTitlePointerMove}
    onpointerup={() => (dragOffset = null)}
    onpointercancel={() => (dragOffset = null)}
    ondblclick={onTitleDoubleClick}
  >
    <img class="icon" src={iconUrl(win.icon, 16)} alt="" draggable="false" />
    <span class="title">{win.title}</span>
    <button class="minimize" title="Minimize" onclick={() => minimizeWindow(win.id)}></button>
    <button
      class={win.maximized ? 'restore' : 'maximize'}
      title={win.maximized ? 'Restore' : 'Maximize'}
      disabled={win.fixedSize}
      onclick={() => toggleMaximize(win.id)}
    ></button>
    <button class="close" title="Close" onclick={() => closeWindow(win.id)}></button>
  </div>

  <div class="body">
    {@render children()}
  </div>

  {#if canResize}
    {#each EDGES as edge (edge)}
      <div
        class="edge {edge}"
        onpointerdown={(event) => onEdgePointerDown(event, edge)}
        onpointermove={onEdgePointerMove}
        onpointerup={() => (resizing = null)}
        onpointercancel={() => (resizing = null)}
      ></div>
    {/each}
  {/if}
</div>

<style>
  /* Values from winXP (frame, title gradients, buttons) and XP.css (frame shading, title text). */
  .window {
    position: absolute;
    display: flex;
    flex-direction: column;
    padding: 0 3px 3px;
    border-radius: 8px 8px 0 0;
    background: #6582f5;
  }

  .window.active {
    background: #0831d9;
    box-shadow:
      inset -1px -1px #00138c,
      inset 1px 1px #0831d9,
      inset -2px -2px #001ea0,
      inset 2px 2px #166aee,
      inset -3px -3px #003bda,
      inset 3px 3px #0855dd;
  }

  .window.maximized {
    padding: 0;
    border-radius: 0;
  }

  .window[hidden] {
    display: none;
  }

  .title-bar {
    display: flex;
    flex: none;
    align-items: center;
    gap: 2px;
    height: 30px;
    margin: 0 -3px;
    padding: 0 5px 0 6px;
    border-radius: 8px 8px 0 0;
    background: linear-gradient(
      to bottom,
      #7697e7 0%,
      #7e9ee3 3%,
      #94afe8 6%,
      #97b4e9 8%,
      #82a5e4 14%,
      #7c9fe2 17%,
      #7996de 25%,
      #7b99e1 56%,
      #82a9e9 81%,
      #80a5e7 89%,
      #7b96e1 94%,
      #7a93df 97%,
      #abbae3 100%
    );
    color: #d8e4f8;
    font: bold 15px var(--xp-font-title);
    user-select: none;
    touch-action: none;
  }

  .active .title-bar {
    background: linear-gradient(
      to bottom,
      #0058ee 0%,
      #3593ff 4%,
      #288eff 6%,
      #127dff 8%,
      #036ffc 10%,
      #0262ee 14%,
      #0057e5 20%,
      #0054e3 24%,
      #0055eb 56%,
      #005bf5 66%,
      #026afe 76%,
      #0062ef 86%,
      #0052d6 92%,
      #0040ab 94%,
      #003092 100%
    );
    color: white;
    text-shadow: 1px 1px #0f1089;
  }

  .maximized .title-bar {
    margin: 0;
    border-radius: 0;
  }

  .icon {
    flex: none;
    width: 16px;
    height: 16px;
    margin-right: 3px;
  }

  .title {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .title-bar button {
    position: relative;
    flex: none;
    width: 21px;
    height: 21px;
    padding: 0;
    border: 1px solid white;
    border-radius: 3px;
    box-shadow: inset 0 -1px 2px 1px #4646ff;
    background: radial-gradient(
      circle at 90% 90%,
      #0054e9 0%,
      #2263d5 55%,
      #4479e4 70%,
      #a3bbec 90%,
      white 100%
    );
    opacity: 0.6;
  }

  .active .title-bar button {
    opacity: 1;
  }

  .title-bar button:hover {
    filter: brightness(120%);
  }

  .title-bar button:hover:active {
    filter: brightness(90%);
  }

  .title-bar button:disabled {
    opacity: 0.5;
    filter: none;
  }

  .title-bar button::before,
  .title-bar button::after {
    content: '';
    position: absolute;
  }

  .minimize::before {
    left: 4px;
    top: 12px;
    width: 8px;
    height: 3px;
    background: white;
  }

  .maximize::before {
    left: 3px;
    top: 3px;
    width: 13px;
    height: 13px;
    box-shadow:
      inset 0 3px white,
      inset 0 0 0 1px white;
  }

  .restore::before {
    left: 7px;
    top: 3px;
    width: 9px;
    height: 9px;
    box-shadow:
      inset 0 2px white,
      inset 0 0 0 1px white;
  }

  .restore::after {
    left: 3px;
    top: 7px;
    width: 9px;
    height: 9px;
    background: #136dff;
    box-shadow:
      inset 0 2px white,
      inset 0 0 0 1px white;
  }

  .title-bar .close {
    box-shadow: inset 0 -1px 2px 1px #da4600;
    background: radial-gradient(
      circle at 90% 90%,
      #cc4600 0%,
      #dc6527 55%,
      #cd7546 70%,
      #ffccb2 90%,
      white 100%
    );
  }

  .close::before,
  .close::after {
    left: 8.5px;
    top: 2px;
    width: 2px;
    height: 15px;
    background: white;
    transform: rotate(45deg);
  }

  .close::after {
    transform: rotate(-45deg);
  }

  /* The program's box: a definite size, so its contents can fill it with height: 100%. */
  .body {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    background: var(--xp-window-body);
  }

  .edge {
    position: absolute;
    touch-action: none;
  }

  /* Edges a few pixels wide are too fine for a finger: on a touch screen, maximize instead. */
  @media (pointer: coarse) {
    .edge {
      display: none;
    }
  }

  .n,
  .s {
    left: 8px;
    right: 8px;
    height: 6px;
    cursor: ns-resize;
  }

  .e,
  .w {
    top: 8px;
    bottom: 8px;
    width: 6px;
    cursor: ew-resize;
  }

  .ne,
  .nw,
  .se,
  .sw {
    width: 12px;
    height: 12px;
  }

  .n,
  .ne,
  .nw {
    top: -3px;
  }

  .s,
  .se,
  .sw {
    bottom: -3px;
  }

  .e,
  .ne,
  .se {
    right: -3px;
  }

  .w,
  .nw,
  .sw {
    left: -3px;
  }

  .nw,
  .se {
    cursor: nwse-resize;
  }

  .ne,
  .sw {
    cursor: nesw-resize;
  }
</style>
