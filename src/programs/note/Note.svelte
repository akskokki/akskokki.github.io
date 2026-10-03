<script lang="ts">
  // Editable for fun; nothing is saved, so every visit starts with the same note.
  const text = `back in 5 min — have a look around.

the icons on the left open more windows,
and the taskbar switches between them.
`;
</script>

<textarea class="note" spellcheck="false" value={text}></textarea>

<style>
  .note {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 2px 4px;
    border: none;
    outline: none;
    resize: none;
    background: white;
    font:
      13px 'Lucida Console',
      monospace;
  }
</style>
