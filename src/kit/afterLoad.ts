let loaded: Promise<void> | undefined;

/**
 * Resolves once the page has loaded and the browser is idle: the moment to fetch what may be
 * wanted later, such as a program's pictures, as it then holds up nothing the first view needs.
 */
export function afterLoad(): Promise<void> {
  loaded ??= new Promise((resolve) => {
    const idle = () => {
      // Safari has no idle callbacks.
      if ('requestIdleCallback' in window) requestIdleCallback(() => resolve());
      else setTimeout(resolve, 100);
    };
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
  });
  return loaded;
}
