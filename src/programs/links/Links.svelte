<script lang="ts">
  import { iconUrl, ScrollArea } from '../../kit';
  import { links } from './links';
</script>

<div class="links">
  <ScrollArea>
    <ul>
      {#each links as link (link.url)}
        <li>
          <img src={iconUrl('globe', 16)} alt="" />
          <span class="label">{link.label}</span>
          <!-- Web links open in a new tab; mailto: links go straight to the mail app. -->
          <a
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : undefined}
            rel="noopener"
          >
            {link.shown}
          </a>
        </li>
      {/each}
    </ul>
  </ScrollArea>
</div>

<style>
  .links {
    height: 100%;
    background: white;
  }

  ul {
    margin: 0;
    padding: 8px;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 4px;
  }

  img {
    width: 16px;
    height: 16px;
  }

  .label {
    width: 64px;
    font-weight: bold;
  }

  a {
    color: #0000ff;
  }
</style>
