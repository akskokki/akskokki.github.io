<script lang="ts">
  import { ScrollArea } from '../../kit';

  // Editable for fun; nothing is saved, so every visit starts with the same note.
  const text = `back in 5 min — have a look around.

the icons on the left open more windows,
and the taskbar switches between them.
`;
</script>

<!-- An editable element rather than a textarea: it grows with its text, so the scroll area around
     it does the scrolling and shows XP's scrollbars. -->
<div class="note">
  <ScrollArea>
    <div class="text" contenteditable="plaintext-only" spellcheck="false">{text}</div>
  </ScrollArea>
</div>

<style>
  .note {
    height: 100%;
    background: white;
  }

  .text {
    flex: 1;
    padding: 2px 4px;
    outline: none;
    font:
      13px 'Lucida Console',
      monospace;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
</style>
