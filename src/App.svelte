<script lang="ts">
  import { icons, programs, staged } from './desktop';
  import Desktop from './shell/Desktop.svelte';
</script>

<Desktop {programs} {icons} {staged} />
