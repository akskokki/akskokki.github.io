<script lang="ts">
  import type { WindowHandle } from '../../kit';

  let { win }: { win: WindowHandle } = $props();

  let renames = 0;
</script>

<div class="test">
  <p>This is <b>{win.id}</b>, a test program for the window manager.</p>
  <p>
    <button onclick={() => win.open('test-a')}>Open A</button>
    <button onclick={() => win.open('test-b')}>Open B</button>
    <button onclick={() => win.open('test-fixed')}>Open fixed</button>
  </p>
  <p>
    <button onclick={() => win.setTitle(`Renamed ${++renames}×`)}>Rename</button>
    <button onclick={() => win.close()}>Close</button>
  </p>
</div>

<style>
  .test {
    height: 100%;
    padding: 4px 10px;
    overflow: auto;
  }
</style>
