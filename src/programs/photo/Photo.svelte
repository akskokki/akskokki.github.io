<script lang="ts">
  import placeholder from './placeholder.svg';
</script>

<div class="viewer">
  <img src={placeholder} alt="Placeholder: mountains at sunset" />
</div>

<style>
  .viewer {
    height: 100%;
    padding: 8px;
    background: white;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
