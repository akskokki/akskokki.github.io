<script lang="ts">
  import { HIDEOUT, kurkkumopo, kurkkumopoUrl } from './kurkkumopo.svelte';

  // Rendered in every project window, under its picture; it only shows itself in its hideout.
  let { slug }: { slug: string } = $props();

  // Cartoon physics, in px, seconds and degrees.
  const WIND_UP = { time: 0.12, back: 6, squash: 0.88 };
  const ACCELERATION = 4200;
  /** How much speed stretches it, per px/s, up to `max`. */
  const STRETCH = { perSpeed: 0.00012, max: 0.22 };
  /** Flattened against the wall; the bounce starts from the flattest point. */
  const IMPACT = { time: 0.05, squash: 0.5 };
  /** Springing back out of the squash once it's flying, past its normal shape and back. */
  const RELEASE = { time: 0.16 };
  const BOUNCE = { up: 720, back: 0.4, minBack: 280, spin: 1000 };
  const GRAVITY = 3200;
  /** Cartoon hang time: gravity eases off near the top of the arc, below this speed. */
  const HANG = { speed: 220, gravity: 0.35 };

  let phase = $state<'parked' | 'driving' | 'flying' | 'gone'>('parked');
  let frame = 0;
  $effect(() => () => cancelAnimationFrame(frame));

  /** Calls `step` every frame with the seconds since the last one, until it returns false. */
  function animate(step: (dt: number) => boolean) {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      if (step(dt)) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  }

  /**
   * Moves the kurkkumopo by (x, y) and scales it by (sx, sy) about its centre, keeping its wheels
   * on the ground, and with `pinLeft` its nose against the wall.
   */
  function draw(button: HTMLElement, { x = 0, y = 0, sx = 1, sy = 1, angle = 0, pinLeft = false }) {
    const pinX = pinLeft ? (-(1 - sx) * button.offsetWidth) / 2 : 0;
    const pinY = ((1 - sy) * button.offsetHeight) / 2;
    button.style.transform = `translate(${x + pinX}px, ${y + pinY}px) rotate(${angle}deg) scale(${sx}, ${sy})`;
  }

  function drive(button: HTMLButtonElement) {
    phase = 'driving';
    const wall = wallOf(button);
    const x0 = new DOMMatrix(getComputedStyle(button).transform).m41;
    let x = x0;
    let vx = 0;
    let time = 0;
    animate((dt) => {
      time += dt;
      // Anticipation: a quick crouch backwards before it sets off.
      if (time < WIND_UP.time) {
        const t = Math.sin((time / WIND_UP.time) * Math.PI);
        const sx = 1 - (1 - WIND_UP.squash) * t;
        draw(button, { x: x0 + WIND_UP.back * t, sx, sy: 1 / sx });
        return true;
      }
      vx -= ACCELERATION * dt;
      x += vx * dt;
      const sx = 1 + Math.min(-vx * STRETCH.perSpeed, STRETCH.max);
      draw(button, {
        x,
        y: -Math.abs(Math.sin(time * 38)) * 2,
        sx,
        sy: 1 / Math.sqrt(sx),
        angle: Math.sin(time * 50) * 2,
      });
      if (button.getBoundingClientRect().left > wall) return true;
      crash(button, wall, -vx, sx);
      return false;
    });
  }

  function crash(button: HTMLButtonElement, wall: number, speed: number, stretch: number) {
    kurkkumopo.find();
    // Where it's laid out, measured untransformed, as it's moved from there.
    button.style.transform = 'none';
    const { left, top } = button.getBoundingClientRect();
    // It can't go through the wall: back to touching it, drawn at once so no frame shows it
    // untransformed.
    let x = wall - left;
    draw(button, { x, sx: stretch, sy: 1 / Math.sqrt(stretch), pinLeft: true });

    let y = 0;
    let angle = 0;
    const vx = Math.max(BOUNCE.minBack, speed * BOUNCE.back);
    let vy = -BOUNCE.up;
    let time = 0;
    animate((dt) => {
      time += dt;
      if (time < IMPACT.time) {
        const p = time / IMPACT.time;
        const sx = stretch + (IMPACT.squash - stretch) * Math.sin(p * (Math.PI / 2));
        draw(button, { x, sx, sy: 1 + (1 - sx) * 0.6, pinLeft: true });
        return true;
      }
      if (phase !== 'flying') {
        // The bounce starts: fixed from here, at the same spot, so it comes out in front of the
        // picture and the window no longer clips it, and it can fall out over the desktop.
        Object.assign(button.style, {
          position: 'fixed',
          left: `${left}px`,
          top: `${top}px`,
          bottom: 'auto',
        });
        phase = 'flying';
      }
      vy += GRAVITY * (Math.abs(vy) < HANG.speed ? HANG.gravity : 1) * dt;
      x += vx * dt;
      y += vy * dt;
      angle += BOUNCE.spin * dt;
      // Springing out of the squash: past round and back, like a spring settling. Its nose stays
      // where it left the wall at first, so the first frame matches the last of the impact.
      const p = Math.min((time - IMPACT.time) / RELEASE.time, 1);
      const rx = 1 + (IMPACT.squash - 1) * Math.cos(1.5 * Math.PI * p) * (1 - p);
      const ry = 1 + (1 - rx) * 0.6;
      const pinX = (-(1 - rx) * button.offsetWidth) / 2;
      const pinY = ((1 - ry) * button.offsetHeight) / 2;
      // Stretched along the way it's flying, whichever way it's spun.
      const heading = Math.atan2(vy, vx);
      const s = 1 + Math.min(Math.hypot(vx, vy) * STRETCH.perSpeed * 0.6, STRETCH.max);
      button.style.transform =
        `translate(${x + pinX}px, ${y + pinY}px) rotate(${heading}rad) scale(${s}, ${1 / s}) ` +
        `rotate(${-heading}rad) rotate(${angle}deg) scale(${rx}, ${ry})`;
      if (button.getBoundingClientRect().top < window.innerHeight) return true;
      phase = 'gone';
      return false;
    });
  }

  /** The left edge of the nearest box that clips the kurkkumopo: the window it crashes into. */
  function wallOf(element: HTMLElement): number {
    for (let box = element.parentElement; box; box = box.parentElement) {
      if (getComputedStyle(box).overflowX !== 'visible') {
        return box.getBoundingClientRect().left + box.clientLeft;
      }
    }
    return 0;
  }
</script>

<!-- Once found, it stays gone, apart from the one whose crash found it, until that one is off the
     screen. -->
{#if slug === HIDEOUT && phase !== 'gone' && (phase !== 'parked' || !kurkkumopo.found)}
  <!-- Parked behind the picture with only its nose and antennae showing. -->
  <button
    class="mopo"
    class:moving={phase !== 'parked'}
    class:flying={phase === 'flying'}
    aria-label="Kurkkumopo"
    onclick={(event) => {
      if (phase === 'parked') drive(event.currentTarget);
    }}
  >
    <img src={kurkkumopoUrl} alt="" draggable="false" />
  </button>
{/if}

<style>
  /* Positioned against the picture's box, which isolates it, so z-index -1 puts it behind. */
  .mopo {
    position: absolute;
    bottom: 5px;
    left: 0;
    z-index: -1;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    transform: translateX(-20px);
    transition: transform 0.2s ease-out;
  }

  .mopo:hover {
    transform: translateX(-26px);
  }

  /* Moved frame by frame from here: out from behind the picture, then over everything. */
  .moving {
    transition: none;
    pointer-events: none;
  }

  .flying {
    z-index: 1;
  }

  img {
    display: block;
    width: 56px;
  }
</style>
