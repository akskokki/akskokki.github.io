<script lang="ts">
  import { imageUrl } from '../art';

  import './theme/theme.css';
</script>

<div class="desktop" style:background-image="url({imageUrl('bliss')})"></div>

<style>
  .desktop {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: var(--xp-desktop) center / cover no-repeat;
  }
</style>
