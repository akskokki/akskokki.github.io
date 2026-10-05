// The entrance on load, in which the staged windows pop in one after another, each with its
// taskbar button sliding open. Each is an action given the element's turn, or undefined for none.
// It plays once, as the element mounts, and not at all for someone who'd rather have less motion.

/** Between one window's turn and the next, in ms. */
const STAGGER = 70;

/** A window fades in from a little smaller. */
export function popIn(node: HTMLElement, turn: number | undefined): void {
  play(node, turn, { opacity: 0, transform: 'scale(0.96)' }, 220);
}

/** A taskbar button slides open from nothing, as with XP's "Slide taskbar buttons" effect. */
export function slideIn(node: HTMLElement, turn: number | undefined): void {
  play(node, turn, { flexBasis: '0px', paddingLeft: '0px', paddingRight: '0px' }, 200);
}

// From one keyframe to however the element is styled. A lone keyframe would be taken as the end,
// hence its offset.
function play(node: HTMLElement, turn: number | undefined, from: Keyframe, duration: number) {
  if (turn === undefined || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  node.animate([{ ...from, offset: 0 }], {
    duration,
    delay: turn * STAGGER,
    easing: 'ease-out',
    fill: 'backwards',
  });
}
