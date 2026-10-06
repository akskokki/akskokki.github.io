<script lang="ts" module>
  import type { WindowSpec } from './windows.svelte';

  /** The tool's window id, and its path: #/time-tool reopens it. */
  export const TIME_TOOL = 'time-tool';

  export function timeToolSpec(area: { width: number; height: number }): WindowSpec {
    const width = 300;
    const height = 384;
    // In the bottom-right corner, beside its desktop icon.
    return {
      title: 'Time of day',
      icon: 'dateTime',
      x: area.width - width - 92,
      y: area.height - height - 88,
      width,
      height,
    };
  }
</script>

<script lang="ts">
  // For `pnpm dev` only: shows the wallpaper at any time today, where this browser's time zone
  // says it is, and when each picture shows alone.
  import '../kit/xp.css';
  import { chosen } from './wallpaper/chosen.svelte';
  import {
    blendAt,
    clockAt,
    here,
    keyframesAround,
    midnightOf,
    minutesOfDay,
    pictureOf,
  } from './wallpaper/sky';

  const time = $derived(chosen.time);

  function onchange(to: Date | null) {
    chosen.time = to;
  }

  const place = $derived(chosen.place ?? here());

  let now = $state(new Date());
  $effect(() => {
    const timer = setInterval(() => (now = new Date()), 60_000);
    return () => clearInterval(timer);
  });

  const shown = $derived(time ?? now);
  const midnight = $derived(midnightOf(shown, place));
  const minute = $derived(Math.round(minutesOfDay(shown, place)));

  const blend = $derived(blendAt(shown, place));
  const mix = $derived(
    blend.from === blend.to
      ? pictureOf(blend.from).name
      : `${pictureOf(blend.from).name} ${percent(1 - blend.mix)} · ${pictureOf(blend.to).name} ${percent(blend.mix)}`,
  );

  // Today's moments, when each picture shows alone.
  const moments = $derived(
    keyframesAround(new Date(midnight + 12 * 3_600_000), place).filter(
      ({ at }) => at >= midnight && at < midnight + 24 * 3_600_000,
    ),
  );

  function percent(share: number): string {
    return `${Math.round(share * 100)}%`;
  }

  function clock(at: number): string {
    return clockAt(new Date(at), place);
  }

  const where = $derived(
    `${Math.abs(place.latitude)}°${place.latitude < 0 ? 'S' : 'N'} ${Math.abs(place.longitude)}°${place.longitude < 0 ? 'W' : 'E'}`,
  );
</script>

<div class="tool">
  <p>{place.zone}: {where}{place.guessed ? ', guessed from the offset' : ''}.</p>
  <div class="time">
    <input
      type="range"
      min="0"
      max={24 * 60 - 1}
      value={minute}
      oninput={(event) => onchange(new Date(midnight + Number(event.currentTarget.value) * 60_000))}
    />
    <b>{clock(shown.getTime())}</b>
    <button class="xp-button" disabled={time === null} onclick={() => onchange(null)}>Now</button>
  </div>
  <p>{mix}</p>
  <ul>
    {#each moments as { period, at } (at)}
      <li onclick={() => onchange(new Date(at))}>
        {pictureOf(period).name}
        <span>{clock(at)}</span>
      </li>
    {/each}
  </ul>
</div>

<style>
  .tool {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
    padding: 10px;
  }

  p {
    margin: 0;
    line-height: 1.4;
  }

  .time {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  input {
    flex: 1;
    min-width: 0;
  }

  /* A list box, as in the layout tool. */
  ul {
    flex: 1;
    margin: 0;
    padding: 1px;
    border: 1px solid #7f9db9;
    background: white;
    list-style: none;
  }

  li {
    display: flex;
    justify-content: space-between;
    padding: 2px 6px;
    cursor: default;
  }

  li:hover {
    background: #316ac5;
    color: white;
  }

  li span {
    opacity: 0.7;
  }
</style>
