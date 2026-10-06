<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { fade } from 'svelte/transition';

  import { afterLoad } from '../../kit/afterLoad';
  import { chosen, load, loaded } from './chosen.svelte';
  import { blendAt, here, pictureOf } from './sky';

  const place = $derived(chosen.place ?? here());

  // Checked every half minute, and each change fades in over a couple of seconds, so even the
  // quickest twilight moves without a visible step. Short fades rather than one that never ends,
  // which would keep the screen redrawing all the time. A tab coming back from the background,
  // where timers are slowed, catches up at once.
  let now = $state(new Date());
  $effect(() => {
    const timer = setInterval(() => (now = new Date()), 30_000);
    return () => clearInterval(timer);
  });

  // The two pictures the sky is between, the second showing through the first as much as it's
  // mixed in. It starts as the tiny pictures, blurred, which are in the script, and the full ones
  // come in over them once they've loaded, after the first view.
  const time = $derived(chosen.time);
  const blend = $derived(blendAt(time ?? now, place));
  const shown = $derived(blend.from === blend.to ? [blend.from] : [blend.from, blend.to]);

  let ready = $state(false);
  void afterLoad().then(() => (ready = true));

  $effect(() => {
    if (!ready) return;
    // The pictures it's between first, then the one after, so it's there when it's needed.
    for (const period of [...shown, blend.next]) if (period) void load(period);
  });
</script>

<svelte:document
  onvisibilitychange={() => {
    if (document.visibilityState === 'visible') now = new Date();
  }}
/>

{#each shown as period, index (period)}
  <div
    class="wallpaper preview"
    class:easing={time === null}
    style:background-image="url({pictureOf(period).preview})"
    style:opacity={index === 0 ? 1 : blend.mix}
  ></div>
{/each}
{#each shown as period, index (period)}
  {#if loaded.has(period)}
    <div
      class="wallpaper"
      class:easing={time === null}
      style:background-image="url({pictureOf(period).url})"
      style:opacity={index === 0 ? 1 : blend.mix}
      in:fade={{ duration: 300, easing: cubicOut }}
    ></div>
  {/if}
{/each}

<style>
  .wallpaper {
    position: absolute;
    inset: 0;
    background: center / cover no-repeat;
  }

  /* Following the clock; a time chosen in the dev tool shows at once. */
  .easing {
    transition: opacity 2s linear;
  }

  /* Reaching past the screen's edges, where the blur would otherwise fade to the colour beneath. */
  .preview {
    inset: -40px;
    filter: blur(24px);
  }
</style>
