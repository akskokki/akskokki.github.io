<script lang="ts">
  import { icons, layouts, programs } from './desktop';
  import Desktop from './shell/Desktop.svelte';
</script>

<Desktop {programs} {icons} {layouts} />
