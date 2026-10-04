<script lang="ts">
  import { backOut } from 'svelte/easing';

  interface Props {
    src: string;
    height: number;
    /** A fixed box the logo is fitted into. Without one, as wide as the logo needs. */
    width?: number;
    /** Before the swap when the logo changes, in ms: tiles side by side can take turns. */
    delay?: number;
  }

  let { src, height, width, delay = 0 }: Props = $props();

  // A logo as wide as it needs eases from one width to the next, so whatever's beside it slides
  // rather than jumps. Unset until the first logo loads, when the box just fits it.
  const natural = $state({ width: 0, height: 0 });
  const boxWidth = $derived(
    width ?? (natural.height ? (natural.width / natural.height) * height : undefined),
  );

  // When the logo changes, the old one spins away and the new one pops in.
  function out(_: Element) {
    return {
      delay,
      duration: 200,
      css: (t: number) => `transform: scale(${t}) rotate(${(1 - t) * -120}deg); opacity: ${t}`,
    };
  }

  function into(_: Element) {
    return {
      delay: delay + 140,
      duration: 450,
      easing: backOut,
      css: (t: number) => `transform: scale(${t}) rotate(${(1 - t) * 90}deg)`,
    };
  }
</script>

<span
  class="logo"
  style:width={boxWidth === undefined ? undefined : `${boxWidth}px`}
  style:height="{height}px"
  style:transition-delay="{delay + 140}ms"
>
  <!-- Keyed by the picture, so a new one replaces the old with the transitions above, while the
       first one simply appears. -->
  {#key src}
    <img
      {src}
      alt=""
      draggable="false"
      style:width={width === undefined ? undefined : `${width}px`}
      style:height="{height}px"
      bind:naturalWidth={natural.width}
      bind:naturalHeight={natural.height}
      in:into
      out:out
    />
  {/key}
</span>

<style>
  /* One grid cell, so the old logo and the new one overlap while they swap. */
  .logo {
    display: inline-grid;
    flex: none;
    place-items: center;
    transition: width 0.4s ease-in-out;
  }

  /* Sized on the element itself: a percentage of a grid cell sized by its contents would be
     ignored. */
  img {
    grid-area: 1 / 1;
    object-fit: contain;
  }
</style>
