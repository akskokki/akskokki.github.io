/**
 * The entrance on load, in which the staged windows pop in one after another, each with its taskbar
 * button: an action given the element's turn, or undefined for none. It plays once, as the element
 * mounts, and not at all for someone who'd rather have less motion.
 */
export function entrance(node: HTMLElement, turn: number | undefined): void {
  if (turn === undefined || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  node.animate(
    [
      { opacity: 0, transform: 'scale(0.96)' },
      { opacity: 1, transform: 'none' },
    ],
    { duration: 220, delay: turn * 70, easing: 'ease-out', fill: 'backwards' },
  );
}
