<script lang="ts">
  import { imageUrl, type ProgramProps, ScrollArea } from '../../kit';

  let { win }: ProgramProps = $props();
</script>

<ScrollArea>
  <div class="about">
    <img class="photo" src={imageUrl('astronaut')} alt="" />
    <div class="text">
      <h1>Hi, I'm Akseli</h1>
      <p>
        I'm a software engineer in Helsinki. I work at Toska, the University of Helsinki's own
        development team, on the open-source systems the university runs on: full-stack TypeScript,
        React, Node.js and PostgreSQL. Before that I built a marketplace app at Bought, an
        early-stage startup, and I have a BSc in Computer Science from the University of Helsinki.
      </p>
      <p>
        This site is also where I keep small things I make for fun. Have a look around, open some
        windows, and say hello.
      </p>
      <p class="buttons">
        <button class="xp-button" onclick={() => win.open('projects')}>My projects</button>
        <button class="xp-button" onclick={() => win.open('links')}>Links</button>
      </p>
    </div>
  </div>
</ScrollArea>

<style>
  .about {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 16px;
    padding: 16px;
  }

  /* Beside the photo when there's room, below it in a narrow window. */
  .text {
    flex: 1 1 240px;
  }

  .photo {
    flex: none;
    width: 96px;
    height: 96px;
    border: 3px solid white;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }

  h1 {
    margin: 0 0 10px;
    color: #0c327d;
    font-size: 20px;
  }

  p {
    margin: 0 0 10px;
    line-height: 1.5;
  }

  .buttons {
    display: flex;
    gap: 6px;
    margin-top: 16px;
  }
</style>
