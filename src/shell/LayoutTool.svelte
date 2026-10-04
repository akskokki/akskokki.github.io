<script lang="ts">
  import '../kit/xp.css';
  import type { PickedLayout } from './layout';
  import { copyText, layoutInfo } from './layoutTool';
  import type { Layout } from './types';

  interface Props {
    layouts: readonly Layout[];
    picked: PickedLayout;
    area: { width: number; height: number };
    /** Back to the staged view of the layout for the area as it is now. */
    onreset: () => void;
  }

  let { layouts, picked, area, onreset }: Props = $props();

  let copyLabel = $state('Copy layout');

  async function copy() {
    copyLabel = (await copyText(layoutInfo(picked, area))) ? 'Copied' : "Couldn't copy";
    setTimeout(() => (copyLabel = 'Copy layout'), 1500);
  }
</script>

<div class="tool">
  <p>While this window is open, resizing the browser resets the windows to its layout.</p>
  <p>Area above the taskbar: <b>{area.width}×{area.height}</b></p>
  <ul>
    {#each layouts as layout, index (index)}
      <li class:current={layout === picked.layout}>
        {layout.width}×{layout.height}
        <span>{layout.staged.length} open</span>
      </li>
    {/each}
  </ul>
  <div class="buttons">
    <button class="xp-button" onclick={onreset}>Reset</button>
    <button class="xp-button" onclick={copy}>{copyLabel}</button>
  </div>
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

  /* A list box, its current row selected as in XP. */
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
  }

  li span {
    color: #595959;
  }

  .current,
  .current span {
    background: #316ac5;
    color: white;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
  }
</style>
