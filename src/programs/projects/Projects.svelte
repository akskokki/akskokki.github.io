<script lang="ts">
  import { onMount } from 'svelte';

  import { iconUrl, type ProgramProps, ScrollArea } from '../../kit';
  import { logoOf } from './kurkkumopo.svelte';
  import Logo from './Logo.svelte';
  import { projects } from './projects';

  let { win }: ProgramProps = $props();

  // Loads every project's picture while the folder is open, so a project window shows it straight
  // away rather than a moment after opening. Hidden elements rather than plain fetches, so the
  // images are decoded and the videos buffered; kept here so the browser doesn't drop them.
  const preloaded: HTMLElement[] = [];
  onMount(() => {
    for (const { picture } of projects) {
      if (!picture) continue;
      if ('video' in picture) {
        const element = document.createElement('video');
        element.preload = 'auto';
        element.src = element.canPlayType('video/webm') ? picture.video.webm : picture.video.mp4;
        preloaded.push(element);
      } else {
        const image = new Image();
        image.src = picture.screenshot;
        image.decode().catch(() => {});
        preloaded.push(image);
      }
    }
  });

  // Explorer's "Show in Groups" view: a heading per kind, the projects as tiles under it.
  const groups = [
    { name: 'Work', projects: projects.filter((p) => p.kind === 'work') },
    { name: 'Personal', projects: projects.filter((p) => p.kind === 'personal') },
  ];
</script>

<div class="folder">
  <ScrollArea>
    <div class="groups">
      {#each groups as group (group.name)}
        <h2>{group.name}</h2>
        <div class="tiles">
          {#each group.projects as project, index (project.slug)}
            <!-- One click opens, as in XP's single-click mode: a website's visitors expect that, and
                 the hover highlight shows what will open. -->
            <button class="tile" onclick={() => win.open(`projects/${project.slug}`)}>
              <Logo
                src={logoOf(project) ?? iconUrl('gameController', 32)}
                width={32}
                height={32}
                delay={index * 90}
              />
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

  .groups {
    padding: 10px 12px;
  }

  /* XP's group heading: bold blue text over a rule that fades out. */
  h2 {
    margin: 0 0 4px;
    padding-bottom: 3px;
    background: linear-gradient(to right, #7a9bd8, transparent) left bottom / 320px 1px no-repeat;
    color: #0c327d;
    font-size: inherit;
  }

  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 2px 10px;
    margin-bottom: 12px;
  }

  .tile {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    border: 1px solid transparent;
    border-radius: 2px;
    background: none;
    font: inherit;
    text-align: left;
    cursor: pointer;
    user-select: none;
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    line-height: 1.3;
  }

  .title {
    align-self: flex-start;
  }

  .detail {
    color: #595959;
  }

  .tile:hover {
    border-color: rgb(49 106 197 / 60%);
    background: rgb(49 106 197 / 10%);
  }

  .tile:hover .title {
    color: #0c327d;
    text-decoration: underline;
  }

  .tile:active {
    border-color: #316ac5;
    background: rgb(49 106 197 / 22%);
  }
</style>
