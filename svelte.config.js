import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/vite-plugin-svelte').SvelteConfig} */
export default {
  preprocess: vitePreprocess(),
  compilerOptions: {
    runes: true,
    // Accessibility work is out of scope (see AGENTS.md), so a11y warnings would only be noise.
    // A compiler option rather than `onwarn`, because svelte-check ignores `onwarn`.
    warningFilter: (warning) => !warning.code.startsWith('a11y'),
  },
};
