<script lang="ts">
  import { iconUrl, type ProgramProps, ScrollArea } from '../../kit';
  import { projects } from './projects';

  let { win, arg }: ProgramProps = $props();

  const project = $derived(projects.find((p) => p.slug === arg));

  $effect(() => {
    if (project) win.setTitle(project.title);
  });
</script>

<div class="project">
  {#if project}
    <!-- Says which kind of project this is, for anyone who came straight from a link. -->
    <div class="kind">
      <img src={project.logo ?? iconUrl('gameController', 16)} alt="" />
      <b>{project.kind === 'work' ? 'Work' : 'Personal'}</b>
      <span>· {project.where}, {project.when}</span>
    </div>
  {/if}
  <div class="scroll">
    <ScrollArea>
      <div class="page">
        {#if project}
          {#if project.video}
            <!-- A video rather than a GIF: browsers share one animation between every use of a
                 GIF, so a reopened window would carry on where the last one was. A video starts
                 over. -->
            <video
              class="screenshot"
              autoplay
              loop
              muted
              playsinline
              aria-label="Recording of {project.title}"
            >
              <source src={project.video.webm} type="video/webm" />
              <source src={project.video.mp4} type="video/mp4" />
            </video>
          {:else if project.screenshot}
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
</div>

<style>
  .project {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
  }

  .kind {
    display: flex;
    flex: none;
    align-items: center;
    gap: 6px;
    height: 24px;
    padding: 0 10px;
    border-bottom: 1px solid #aca899;
    background: #ece9d8;
    white-space: nowrap;
  }

  /* As tall as an icon, and as wide as the logo needs: Toska's is a wordmark. */
  .kind img {
    height: 16px;
  }

  .kind b {
    color: #0c327d;
  }

  .scroll {
    flex: 1;
    min-height: 0;
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
    font-size: 21px;
  }

  h2 {
    margin: 12px 0 4px;
    font-size: inherit;
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
