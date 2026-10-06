<script lang="ts">
  import { onDestroy } from 'svelte';

  import { iconUrl } from '../../art';

  import '../../kit/xp.css';
  import { chosen, loadAll } from './chosen.svelte';
  import {
    blendAt,
    clockAt,
    here,
    midnightOf,
    minutesOfDay,
    pictureOf,
    places,
    sun,
    tour,
  } from './sky';

  // The taskbar clock's balloon, where visitors play with the time-of-day wallpaper: drag the sun
  // through today, play the whole day, or see the sky somewhere else. Closing it goes back to now
  // and home, so the wallpaper never keeps showing another time or place once it's gone.
  let { onclose }: { onclose: () => void } = $props();

  const home = here();
  const elsewhere = places.filter(({ name }) => name !== home.name);
  const place = $derived(chosen.place ?? home);

  function go(name: string) {
    stop(true);
    chosen.place = elsewhere.find((each) => each.name === name) ?? null;
  }

  let now = $state(new Date());
  $effect(() => {
    const timer = setInterval(() => (now = new Date()), 30_000);
    return () => clearInterval(timer);
  });

  const time = $derived(chosen.time ?? now);
  const midnight = $derived(midnightOf(now, place));
  const blend = $derived(blendAt(time, place));
  const what = $derived(
    blend.from === blend.to
      ? pictureOf(blend.from).name
      : `${pictureOf(blend.from).name} → ${pictureOf(blend.to).name}`,
  );

  // The sun's path through today, as a curve over the horizon: 0 to 24 h across, 90° up to 90°
  // down from top to bottom.
  const WIDTH = 240;
  const HEIGHT = 80;
  const x = (at: number) => ((at - midnight) / 86_400_000) * WIDTH;
  const y = (altitude: number) => HEIGHT / 2 - (altitude / 90) * (HEIGHT / 2 - 4);
  const path = $derived(
    Array.from({ length: 145 }, (_, step) => {
      const at = midnight + step * 600_000;
      return `${step ? 'L' : 'M'}${x(at).toFixed(1)},${y(sun(new Date(at), place)).toFixed(1)}`;
    }).join(''),
  );
  const altitude = $derived(sun(time, place));
  // By the time of day, as playing the day carries on into tomorrow.
  const sunX = $derived((minutesOfDay(time, place) / 1440) * WIDTH);

  // Dragging the sun, anywhere on the chart, to a time today.
  let dragging = false;

  function drag(event: PointerEvent & { currentTarget: SVGSVGElement }) {
    const box = event.currentTarget.getBoundingClientRect();
    const share = Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1);
    stop(false);
    chosen.time = new Date(midnight + Math.min(share * 1440, 1439) * 60_000);
  }

  // Playing the day: from the time shown, all the way round to it again, then back to now.
  let playing = $state(false);
  let loading = $state(false);
  let frame = 0;

  async function play() {
    loading = true;
    await loadAll();
    loading = false;
    const timeAt = tour(chosen.time ?? new Date(), place);
    const start = performance.now();
    playing = true;
    const step = (at: number) => {
      const shown = timeAt(at - start);
      if (shown) {
        chosen.time = shown;
        frame = requestAnimationFrame(step);
      } else stop(true);
    };
    frame = requestAnimationFrame(step);
  }

  function stop(toNow: boolean) {
    cancelAnimationFrame(frame);
    playing = false;
    if (toNow) chosen.time = null;
  }

  onDestroy(() => {
    stop(true);
    chosen.place = null;
  });
</script>

<div class="balloon">
  <div class="title">
    <img src={iconUrl('dateTime', 16)} alt="" draggable="false" />
    <b>Time of day</b>
    <button class="close" title="Close" onclick={onclose}></button>
  </div>
  <p>
    {#if chosen.place}
      Showing the sky over {place.name}, on the clock there.
    {:else}
      The wallpaper follows the sun {home.guessed ? 'roughly' : `over ${home.name}`}, going by your
      time zone.
    {/if}
    Drag the sun, play the whole day, or see it somewhere else.
  </p>
  <label class="where">
    Sky over
    <span class="xp-select">
      <select value={chosen.place?.name ?? ''} onchange={(event) => go(event.currentTarget.value)}>
        <option value="">{home.guessed ? 'Your time zone' : `${home.name} (yours)`}</option>
        {#each elsewhere as { name } (name)}
          <option value={name}>{name}</option>
        {/each}
      </select>
    </span>
  </label>
  <svg
    viewBox="0 0 {WIDTH} {HEIGHT}"
    onpointerdown={(event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      dragging = true;
      drag(event);
    }}
    onpointermove={(event) => dragging && drag(event)}
    onpointerup={() => (dragging = false)}
    onpointercancel={() => (dragging = false)}
  >
    <rect class="sky" width={WIDTH} height={HEIGHT / 2} />
    <rect class="ground" y={HEIGHT / 2} width={WIDTH} height={HEIGHT / 2} />
    <path d={path} />
    <circle class:up={altitude > 0} cx={sunX} cy={y(altitude)} r="6" />
  </svg>
  <div class="hours">
    <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
  </div>
  <p class="now"><b>{clockAt(time, place)}</b> {what}</p>
  <div class="buttons">
    <button
      class="xp-button"
      disabled={loading}
      onclick={() => (playing ? stop(true) : void play())}
    >
      {loading ? 'Loading the day…' : playing ? 'Stop' : '▶ Play the day'}
    </button>
    <button class="xp-button" disabled={chosen.time === null} onclick={() => stop(true)}>
      Back to now
    </button>
  </div>
</div>

<style>
  /* XP's tray balloon: pale yellow, a black outline, rounded, with a tail to what it's about. */
  .balloon {
    position: absolute;
    right: 6px;
    bottom: calc(100% + 12px);
    width: 268px;
    padding: 8px 10px 10px;
    border: 1px solid black;
    border-radius: 8px;
    background: #ffffe1;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.35);
    color: black;
    cursor: default;
  }

  .balloon::after {
    content: '';
    position: absolute;
    right: 24px;
    bottom: -12px;
    width: 12px;
    height: 12px;
    border-right: 1px solid black;
    background: linear-gradient(to bottom left, #ffffe1 50%, transparent 50%);
  }

  .title {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .title b {
    flex: 1;
  }

  .close {
    position: relative;
    width: 15px;
    height: 15px;
    padding: 0;
    border: 1px solid #b4b4a0;
    border-radius: 2px;
    background: #ffffe1;
  }

  .close:hover {
    border-color: #7a7a68;
    background: #fff;
  }

  .close::before,
  .close::after {
    content: '';
    position: absolute;
    left: 6px;
    top: 2px;
    width: 1px;
    height: 9px;
    background: black;
    transform: rotate(45deg);
  }

  .close::after {
    transform: rotate(-45deg);
  }

  p {
    margin: 8px 0 0;
    line-height: 1.4;
  }

  .where {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
  }

  .xp-select {
    flex: 1;
  }

  svg {
    display: block;
    width: 100%;
    margin-top: 8px;
    border: 1px solid #7f9db9;
    touch-action: none;
  }

  .sky {
    fill: #c3dcf7;
  }

  .ground {
    fill: #27355e;
  }

  path {
    fill: none;
    stroke: #e8a317;
    stroke-width: 2;
  }

  circle {
    fill: #e6e9f5;
    stroke: #7a84a8;
    stroke-width: 1.5;
  }

  circle.up {
    fill: #ffd23f;
    stroke: #b97800;
  }

  .hours {
    display: flex;
    justify-content: space-between;
    margin-top: 2px;
    color: #6e6e5a;
    font-size: 11px;
  }

  .now {
    margin-top: 6px;
  }

  .buttons {
    display: flex;
    gap: 6px;
    margin-top: 8px;
  }
</style>
