<script lang="ts">
  import { type ProgramProps, ScrollArea } from '../../kit';
  import { projects } from './projects';

  let { win, arg }: ProgramProps = $props();

  const project = $derived(projects.find((p) => p.slug === arg));

  $effect(() => {
    if (project) win.setTitle(project.title);
  });
</script>

<div class="project">
  <ScrollArea>
    <div class="page">
      {#if project}
        {#if project.screenshot}
          <img class="screenshot" src={project.screenshot} alt="Screenshot of {project.title}" />
        {/if}
        <h1>{project.title}</h1>
        <h2>What it is</h2>
        <p>{project.whatItIs}</p>
        <h2>What I did</h2>
        <p>{project.whatIDid}</p>
        <ul class="tags">
          {#each project.tags as tag (tag)}
            <li>{tag}</li>
          {/each}
        </ul>
        <p class="links">
          {#if project.visit}
            <a class="xp-button" href={project.visit} target="_blank" rel="noopener">Visit</a>
          {/if}
          {#if project.source}
            <a class="xp-button" href={project.source} target="_blank" rel="noopener">Source</a>
          {/if}
        </p>
      {:else}
        <p>There's no project called “{arg}”.</p>
      {/if}
    </div>
  </ScrollArea>
</div>

<style>
  .project {
    height: 100%;
    background: white;
  }

  .page {
    padding: 12px 16px;
  }

  .screenshot {
    display: block;
    max-width: 100%;
    max-height: 220px;
    margin: 0 auto 12px;
    border: 1px solid #919b9c;
  }

  h1 {
    margin: 0 0 8px;
    color: #0c327d;
    font-size: 18px;
  }

  h2 {
    margin: 12px 0 4px;
    font-size: 11px;
  }

  p {
    margin: 0;
    line-height: 1.5;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin: 12px 0;
    padding: 0;
    list-style: none;
  }

  .tags li {
    padding: 1px 6px;
    border: 1px solid #7f9db9;
    border-radius: 2px;
    background: #eef3fa;
  }

  .links {
    display: flex;
    gap: 6px;
  }
</style>
