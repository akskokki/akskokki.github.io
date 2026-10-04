<script lang="ts" module>
  export interface ScrollMetrics {
    top: number;
    left: number;
    width: number;
    height: number;
    scrollWidth: number;
    scrollHeight: number;
  }
</script>

<script lang="ts">
  interface Props {
    axis: 'x' | 'y';
    viewport: HTMLElement;
    metrics: ScrollMetrics;
  }

  let { axis, viewport, metrics }: Props = $props();

  // How far one arrow click scrolls, and when holding an arrow or the track starts repeating.
  const LINE = 40;
  const REPEAT_DELAY = 400;
  const REPEAT_EVERY = 50;
  const MIN_THUMB = 8;

  let trackWidth = $state(0);
  let trackHeight = $state(0);

  const vertical = $derived(axis === 'y');
  const position = $derived(vertical ? metrics.top : metrics.left);
  const visible = $derived(vertical ? metrics.height : metrics.width);
  const maxScroll = $derived((vertical ? metrics.scrollHeight : metrics.scrollWidth) - visible);
  const track = $derived(vertical ? trackHeight : trackWidth);
  const thumbLength = $derived(
    Math.max(MIN_THUMB, Math.round((track * visible) / (visible + maxScroll))),
  );
  const thumbOffset = $derived(
    maxScroll > 0 ? Math.round(((track - thumbLength) * position) / maxScroll) : 0,
  );

  let delay: ReturnType<typeof setTimeout> | undefined;
  let repeat: ReturnType<typeof setInterval> | undefined;
  let drag: { pointer: number; position: number } | null = null;

  $effect(() => stop);

  function scrollBy(delta: number) {
    viewport.scrollBy(vertical ? { top: delta } : { left: delta });
  }

  function pointerAt(event: PointerEvent): number {
    return vertical ? event.clientY : event.clientX;
  }

  /** Runs `step` now, then repeatedly while the pointer stays down, like holding an XP button. */
  function hold(event: PointerEvent & { currentTarget: HTMLElement }, step: () => void) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    stop();
    step();
    delay = setTimeout(() => (repeat = setInterval(step, REPEAT_EVERY)), REPEAT_DELAY);
  }

  function stop() {
    clearTimeout(delay);
    clearInterval(repeat);
    drag = null;
  }

  // Clicking the track pages towards the pointer and stops once the thumb gets there.
  function onTrackPointerDown(event: PointerEvent & { currentTarget: HTMLElement }) {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const at = pointerAt(event) - (vertical ? rect.top : rect.left);
    const direction = at < thumbOffset ? -1 : 1;
    hold(event, () => {
      const pastThumb = direction < 0 ? at < thumbOffset : at > thumbOffset + thumbLength;
      if (pastThumb) scrollBy(direction * Math.max(visible - LINE, LINE));
    });
  }

  function onThumbPointerDown(event: PointerEvent & { currentTarget: HTMLElement }) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag = { pointer: pointerAt(event), position };
  }

  function onThumbPointerMove(event: PointerEvent) {
    if (!drag || track <= thumbLength) return;
    const moved = ((pointerAt(event) - drag.pointer) * maxScroll) / (track - thumbLength);
    if (vertical) viewport.scrollTop = drag.position + moved;
    else viewport.scrollLeft = drag.position + moved;
  }

  // The bar isn't part of the scrolling element, so pass the wheel on to it.
  function onWheel(event: WheelEvent) {
    const scale =
      event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? LINE / 3
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? visible
          : 1;
    viewport.scrollBy({ left: event.deltaX * scale, top: event.deltaY * scale });
  }
</script>

<div class="bar {axis}" onwheel={onWheel}>
  <div
    class="knob arrow start"
    onpointerdown={(event) => hold(event, () => scrollBy(-LINE))}
    onpointerup={stop}
    onpointercancel={stop}
  ></div>
  <div
    class="track"
    bind:clientWidth={trackWidth}
    bind:clientHeight={trackHeight}
    onpointerdown={onTrackPointerDown}
    onpointerup={stop}
    onpointercancel={stop}
  >
    <!-- XP hides the thumb when the track is too short to hold it. -->
    {#if thumbLength < track}
      <div
        class="knob thumb"
        style:top={vertical ? `${thumbOffset}px` : null}
        style:left={vertical ? null : `${thumbOffset}px`}
        style:height={vertical ? `${thumbLength}px` : null}
        style:width={vertical ? null : `${thumbLength}px`}
        onpointerdown={onThumbPointerDown}
        onpointermove={onThumbPointerMove}
        onpointerup={stop}
        onpointercancel={stop}
      >
        {#if thumbLength >= 20}<span class="grip"></span>{/if}
      </div>
    {/if}
  </div>
  <div
    class="knob arrow end"
    onpointerdown={(event) => hold(event, () => scrollBy(LINE))}
    onpointerup={stop}
    onpointercancel={stop}
  ></div>
</div>

<style>
  /* Colours sampled from XP's own scrollbar bitmaps (web-xp's crops of luna.msstyles). */
  .bar {
    display: flex;
    user-select: none;
    touch-action: none;
  }

  .y {
    grid-area: 1 / 2;
    flex-direction: column;
    width: 17px;
    background: linear-gradient(to right, #eeede5 1px, #f3f1ec 1px, #fefefb 16px, #eeede5 16px);
  }

  .x {
    grid-area: 2 / 1;
    height: 17px;
    background: linear-gradient(to bottom, #eeede5 1px, #f3f1ec 1px, #fefefb 16px, #eeede5 16px);
  }

  .track {
    position: relative;
    flex: 1;
  }

  /* The raised blue face shared by the arrows and the thumb: 15 px across, a white edge and a
     one-pixel shadow on the far side. */
  .knob {
    position: relative;
    flex: none;
    border: 1px solid white;
    border-radius: 3px;
    box-shadow: 1px 1px #8fadd9;
  }

  .y .knob {
    width: 15px;
    margin-left: 1px;
    background:
      linear-gradient(to bottom, rgb(255 255 255 / 0.4), transparent 4px),
      linear-gradient(to right, #c8d6fb, #c6d5fd 40%, #bad0fc 75%, #b9cbf3);
  }

  .x .knob {
    height: 15px;
    margin-top: 1px;
    background:
      linear-gradient(to right, rgb(255 255 255 / 0.4), transparent 4px),
      linear-gradient(to bottom, #c8d6fb, #c6d5fd 40%, #bad0fc 75%, #b9cbf3);
  }

  /* Each arrow sits in a 17 px cell, its shadow filling the last pixel. */
  .y .arrow {
    height: 16px;
    margin-bottom: 1px;
  }

  .x .arrow {
    width: 16px;
    margin-right: 1px;
  }

  .knob:hover {
    filter: brightness(1.06);
  }

  .arrow:active {
    filter: brightness(0.92);
  }

  /* The arrow glyph: two sides of a rotated square, in XP's dark slate blue. */
  .arrow::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    border: solid #4d6185;
    border-width: 2px 0 0 2px;
  }

  .y .start::before {
    transform: translate(-50%, -25%) rotate(45deg);
  }

  .y .end::before {
    transform: translate(-50%, -75%) rotate(225deg);
  }

  .x .start::before {
    transform: translate(-25%, -50%) rotate(-45deg);
  }

  .x .end::before {
    transform: translate(-75%, -50%) rotate(135deg);
  }

  .thumb {
    position: absolute;
  }

  .y .thumb {
    left: 0;
  }

  .x .thumb {
    top: 0;
  }

  .grip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .y .grip {
    width: 7px;
    height: 8px;
    background: repeating-linear-gradient(to bottom, #eef4fe 0 1px, #8cb0f8 1px 2px);
  }

  .x .grip {
    width: 8px;
    height: 7px;
    background: repeating-linear-gradient(to right, #eef4fe 0 1px, #8cb0f8 1px 2px);
  }
</style>
