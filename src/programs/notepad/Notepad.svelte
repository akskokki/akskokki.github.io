<script lang="ts">
  import { type ProgramProps, ScrollArea } from '../../kit';

  let { arg }: ProgramProps = $props();

  // Every .txt file in this folder, by name: notepad/now.txt opens now.txt. Add a file here and
  // it opens at its own link, or from a desktop icon for its path.
  const files: Record<string, string> = import.meta.glob('./*.txt', {
    query: '?raw',
    import: 'default',
    eager: true,
  });

  // Editable for fun; nothing is saved, so every visit starts with the file as it is.
  const text = $derived(files[`./${arg}`] ?? `Cannot find the ${arg} file.`);
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
