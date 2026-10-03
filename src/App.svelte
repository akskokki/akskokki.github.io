<script lang="ts">
  import { icons, programs, staged, stagedPhone } from './desktop';
  import Desktop from './shell/Desktop.svelte';
</script>

<Desktop {programs} {icons} {staged} {stagedPhone} />
