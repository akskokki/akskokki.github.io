import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// A relative base plus hash routing lets the build work at a domain root or under a sub-path.
export default defineConfig({
  plugins: [svelte()],
  base: './',
});
