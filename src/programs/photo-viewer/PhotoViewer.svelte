<script lang="ts">
  import { onMount } from 'svelte';

  import type { ProgramProps } from '../../kit';

  let { win, arg }: ProgramProps = $props();

  // How each picture opens: its file's size in px, so the window can fit it before it loads, and
  // the scale it's shown at. These are pixel art scaled up 8 and 10 times, so their scales keep
  // every pixel a whole number of screen pixels: 4 and 2.
  const sizes: Record<string, { width: number; height: number; scale: number }> = {
    'clouds.png': { width: 800, height: 480, scale: 0.5 },
    'clouds2.png': { width: 1000, height: 1000, scale: 0.2 },
  };

  /** The border around the picture, in px. */
  const BORDER = 8;

  // Every picture in this folder, by name: photos/clouds.png opens clouds.png. Add one here and
  // it opens at its own link, or from a desktop icon for its path.
  const pictures: Record<string, string> = import.meta.glob('./*.{png,jpg,gif,webp}', {
    query: '?url',
    import: 'default',
    eager: true,
  });

  const src = $derived(pictures[`./${arg}`]);

  // Opens just big enough for the picture at its scale, with an even border; one without a size
  // here keeps the layout's window and is fitted inside it.
  let viewer = $state<HTMLDivElement>();
  onMount(() => {
    const size = sizes[arg ?? ''];
    if (!viewer || !size) return;
    win.fit({
      width: size.width * size.scale + 2 * BORDER - viewer.clientWidth,
      height: size.height * size.scale + 2 * BORDER - viewer.clientHeight,
    });
  });
</script>

<div class="viewer" bind:this={viewer} style:padding="{BORDER}px">
  {#if src}
    <img {src} alt={arg} />
  {:else}
    <p>Cannot find the {arg} file.</p>
  {/if}
</div>

<style>
  .viewer {
    height: 100%;
    background: white;
  }

  /* Fitted to the window. The pictures are pixel art, so they keep sharp pixels at any size. */
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }

  p {
    margin: 0;
  }
</style>
