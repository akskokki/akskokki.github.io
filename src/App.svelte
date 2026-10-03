<script lang="ts">
  import { programs, staged } from './desktop';
  import Desktop from './shell/Desktop.svelte';
</script>

<Desktop {programs} {staged} />
