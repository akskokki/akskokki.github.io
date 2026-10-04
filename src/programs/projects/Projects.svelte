<script lang="ts">
  import { iconUrl, type ProgramProps, ScrollArea } from '../../kit';
  import { projects } from './projects';

  let { win }: ProgramProps = $props();

  // Explorer's "Show in Groups" view: a heading per kind, the projects as tiles under it.
  const groups = [
    { name: 'Work', projects: projects.filter((p) => p.kind === 'work') },
    { name: 'Personal', projects: projects.filter((p) => p.kind === 'personal') },
  ];

  let selected = $state<string | null>(null);

  // A mouse selects with a click and opens with a double click; touch and pens open with one tap.
  let pointerType = '';
</script>

<div class="folder">
  <ScrollArea>
    <div
      class="groups"
      onpointerdown={(event) => {
        if (event.target === event.currentTarget) selected = null;
      }}
    >
      {#each groups as group (group.name)}
        <h2>{group.name}</h2>
        <div class="tiles">
          {#each group.projects as project (project.slug)}
            <button
              class="tile"
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
              <img src={project.logo ?? iconUrl('gameController', 32)} alt="" draggable="false" />
              <span class="text">
                <span class="title">{project.title}</span>
                <span class="detail">{project.where} · {project.when}</span>
                <span class="detail">{project.summary}</span>
              </span>
            </button>
          {/each}
        </div>
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
  .groups {
    flex: 1;
    padding: 10px 12px;
  }

  /* XP's group heading: bold blue text over a rule that fades out. */
  h2 {
    margin: 0 0 4px;
    padding-bottom: 3px;
    background: linear-gradient(to right, #7a9bd8, transparent) left bottom / 320px 1px no-repeat;
    color: #0c327d;
    font-size: 11px;
  }

  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2px 10px;
    margin-bottom: 12px;
  }

  .tile {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 4px;
    border: none;
    background: none;
    font: inherit;
    text-align: left;
    user-select: none;
  }

  img {
    flex: none;
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    line-height: 1.3;
  }

  .title {
    align-self: flex-start;
    padding: 0 2px;
    margin-left: -2px;
  }

  .detail {
    color: #595959;
  }

  .selected img {
    opacity: 0.6;
  }

  .selected .title {
    background: #316ac5;
    color: white;
  }
</style>
