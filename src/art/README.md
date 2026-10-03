# Art

Every piece of Microsoft placeholder art on the site, and nothing else. Only `index.ts` imports these
files (plus `index.html`, which links the favicon). To replace a placeholder, swap the file or change
its entry in `index.ts`.

All of it is Microsoft's original Windows XP art, copied from the clones in `../references/`:

| File             | What it is                              | Copied from                                    |
| ---------------- | --------------------------------------- | ---------------------------------------------- |
| `bliss.jpg`      | Bliss wallpaper, 1920×1080              | `web-xp/public/wallpaper/Bliss.jpg` (bc9528d)  |
| `favicon.ico`    | Windows flag, 16×16                     | `winXP/public/favicon.ico` (856bb55)           |
| `start-flag.png` | Windows flag on the Start button, 25×20 | `web-xp/src/assets/xp/StartFlag.png` (bc9528d) |
