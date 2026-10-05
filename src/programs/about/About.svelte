<script lang="ts">
  import { type ProgramProps, ScrollArea } from '../../kit';
  import knight from './knight.webp';

  let { win }: ProgramProps = $props();

  // The photo is a close-up of one eye of Chubby Knight, a bit of my pixel art: clicking it zooms
  // out to the whole knight, and back in.
  /** The knight is 26×26 pixels; the eye is the 5×5 from (13, 9). */
  const KNIGHT = 26;
  const EYE = { x: 13, y: 9 };
  /** The photo's inside, within its border. */
  const FRAME = 90;
  /** Screen px per art pixel: up close the eye fills the frame, zoomed out the whole knight fits. */
  const CLOSE = 18;
  const FAR = 3;
  /** The whole zoom, in ms. */
  const DURATION = 700;

  let size = $state(CLOSE);
  let out = $state(false);

  // The size changes at a steady rate, which feels slow up close and ever faster further out, as
  // each step is a smaller part of a big size than of a small one: zooming out speeds up, and
  // zooming in slows to a finish. A click partway through turns it around from where it is.
  let frame = 0;
  $effect(() => () => cancelAnimationFrame(frame));

  function toggle() {
    out = !out;
    const from = size;
    const to = out ? FAR : CLOSE;
    const duration = (DURATION * Math.abs(to - from)) / (CLOSE - FAR);
    const start = performance.now();
    cancelAnimationFrame(frame);
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      size = from + (to - from) * t;
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  // From the eye in the corner to the whole knight centred.
  const zoom = $derived((CLOSE - size) / (CLOSE - FAR));
  const far = (FRAME - KNIGHT * FAR) / 2;
  const left = $derived(-EYE.x * CLOSE + (far + EYE.x * CLOSE) * zoom);
  const top = $derived(-EYE.y * CLOSE + (far + EYE.y * CLOSE) * zoom);
</script>

<ScrollArea>
  <div class="about">
    <button class="photo" class:out aria-label="Chubby Knight" onclick={toggle}>
      <img
        src={knight}
        alt=""
        draggable="false"
        style:left="{left}px"
        style:top="{top}px"
        style:width="{KNIGHT * size}px"
      />
    </button>
    <div class="text">
      <h1>Hi, I'm Akseli</h1>
      <p>
        I'm a software engineer based in Helsinki. I work at Toska, the University of Helsinki's own
        development team. We build the open-source systems the university runs on, mostly in
        TypeScript, React, Node.js and PostgreSQL. Before that I was at Bought, an early-stage
        startup, building its secondhand fashion app. I also did my BSc in Computer Science at the
        university.
      </p>
      <p>Feel free to look around here and open whatever looks interesting.</p>
      <p class="buttons">
        <button class="xp-button" onclick={() => win.open('projects')}>My projects</button>
        <button class="xp-button" onclick={(event) => win.open('links', event.currentTarget)}>
          Links
        </button>
      </p>
    </div>
  </div>
</ScrollArea>

<style>
  .about {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 16px;
    padding: 16px;
  }

  /* Beside the photo when there's room, below it in a narrow window. */
  .text {
    flex: 1 1 240px;
  }

  .photo {
    position: relative;
    flex: none;
    width: 96px;
    height: 96px;
    overflow: hidden;
    padding: 0;
    border: 3px solid white;
    border-radius: 6px;
    background: #161124;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    cursor: zoom-out;
  }

  .photo.out {
    cursor: zoom-in;
  }

  /* Placed and sized by the zoom above. */
  .photo img {
    position: absolute;
    image-rendering: pixelated;
  }

  h1 {
    margin: 0 0 10px;
    color: #0c327d;
    font-size: 24px;
  }

  p {
    margin: 0 0 10px;
    line-height: 1.5;
  }

  .buttons {
    display: flex;
    gap: 6px;
    margin-top: 16px;
  }
</style>
