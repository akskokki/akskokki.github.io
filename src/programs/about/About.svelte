<script lang="ts">
  import { imageUrl, type ProgramProps, ScrollArea } from '../../kit';

  import '../../kit/xp.css';

  let { win }: ProgramProps = $props();
</script>

<ScrollArea>
  <div class="about">
    <img class="photo" src={imageUrl('astronaut')} alt="" />
    <div class="text">
      <h1>Hi, I'm [Name]</h1>
      <p>
        I'm a [placeholder job] based in [placeholder city]. This is placeholder text: a couple of
        lines about who I am, what I like working on and what I'm looking for.
      </p>
      <p>
        When I'm not at a computer I'm probably [placeholder hobby]. Have a look around, open some
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
