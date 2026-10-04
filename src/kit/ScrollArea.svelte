<script lang="ts">
  import type { Snippet } from 'svelte';

  import ScrollBar, { type ScrollMetrics } from './ScrollBar.svelte';

  // Scrolling stays native (wheel, touch, keyboard); only the bars are drawn here, so they look
  // like XP's in every browser. Fills its parent, which needs a definite height. Children stack in
  // a column; give one flex: 1 to make it fill the visible area.
  let { children }: { children: Snippet } = $props();

  let viewport = $state<HTMLDivElement>();
  let content = $state<HTMLDivElement>();
  let metrics = $state<ScrollMetrics>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    scrollWidth: 0,
    scrollHeight: 0,
  });

  const vertical = $derived(metrics.scrollHeight > metrics.height);
  const horizontal = $derived(metrics.scrollWidth > metrics.width);

  function measure() {
    if (!viewport) return;
    metrics = {
      top: viewport.scrollTop,
      left: viewport.scrollLeft,
      width: viewport.clientWidth,
      height: viewport.clientHeight,
      scrollWidth: viewport.scrollWidth,
      scrollHeight: viewport.scrollHeight,
    };
  }

  $effect(() => {
    if (!viewport || !content) return;
    // The viewport changes size with the window; the content when it reflows or loads images.
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(content);
    return () => observer.disconnect();
  });
</script>

<div class="scroll-area">
  <div class="viewport" bind:this={viewport} onscroll={measure}>
    <div class="content" bind:this={content}>
      {@render children()}
    </div>
  </div>
  {#if viewport && vertical}
    <ScrollBar axis="y" {viewport} {metrics} />
  {/if}
  {#if viewport && horizontal}
    <ScrollBar axis="x" {viewport} {metrics} />
  {/if}
  {#if vertical && horizontal}
    <div class="corner"></div>
  {/if}
</div>

<style>
  .scroll-area {
    display: grid;
    grid-template: minmax(0, 1fr) auto / minmax(0, 1fr) auto;
    height: 100%;
  }

  .viewport {
    grid-area: 1 / 1;
    overflow: auto;
    scrollbar-width: none;
  }

  .viewport::-webkit-scrollbar {
    display: none;
  }

  /* At least as tall as the viewport, so a child with flex: 1 fills it. A flex container also
     keeps its children's margins inside, where they count towards the scroll height. */
  .content {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .corner {
    grid-area: 2 / 2;
    background: var(--xp-window-body);
  }
</style>
