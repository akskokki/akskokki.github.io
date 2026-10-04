<script lang="ts">
  import { iconUrl, type ProgramProps, ScrollArea } from '../../kit';
  import { projects } from './projects';

  let { win }: ProgramProps = $props();

  let selected = $state<string | null>(null);

  // A mouse selects with a click and opens with a double click; touch and pens open with one tap.
  let pointerType = '';
</script>

<div class="folder">
  <ScrollArea>
    <div
      class="items"
      onpointerdown={(event) => {
        if (event.target === event.currentTarget) selected = null;
      }}
    >
      {#each projects as project (project.slug)}
        <button
          class="item"
          class:selected={selected === project.slug}
          onpointerdown={(event) => {
            pointerType = event.pointerType;
            selected = project.slug;
          }}
          onclick={() => {
            if (pointerType !== 'mouse') win.open(`projects/${project.slug}`);
          }}
          ondblclick={() => {
            if (pointerType === 'mouse') win.open(`projects/${project.slug}`);
          }}
        >
          <img src={iconUrl('application', 32)} alt="" draggable="false" />
          <span>{project.title}</span>
        </button>
      {/each}
    </div>
  </ScrollArea>
</div>

<style>
  .folder {
    height: 100%;
    background: white;
  }

  /* Fills the visible area, so a click on empty space lands here and clears the selection. */
  .items {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 16px 8px;
    padding: 12px;
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    width: 76px;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    user-select: none;
  }

  img {
    width: 32px;
    height: 32px;
  }

  span {
    padding: 0 2px 1px;
    text-align: center;
  }

  .selected img {
    opacity: 0.6;
  }

  .selected span {
    background: #316ac5;
    color: white;
  }
</style>
