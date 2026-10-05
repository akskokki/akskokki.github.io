# Art

Every piece of Microsoft placeholder art on the site, and nothing else. Only `index.ts` imports these files. To replace a placeholder, swap the file or change its entry in `index.ts`.

All of it is Microsoft's original Windows XP art, copied from the clones in `../references/` (winXP at 856bb55, web-xp at bc9528d). Files marked _scaled_ were scaled down from the 1024 px originals, or converted from BMP, with a browser canvas; the others are copied as they are.

| File | What it is | Copied from |
| --- | --- | --- |
| `bliss.jpg` | Bliss wallpaper, 1920×1080 | `web-xp/public/wallpaper/Bliss.jpg` |
| `start-flag.png` | Windows flag on the Start button | `web-xp/src/assets/xp/StartFlag.png` |
| `application-16.png`, `-32.png` | Generic program icon (shell32 #2) | `web-xp/src/assets/windowsIcons/shell32-2(16x16).png`, `(32x32)` |
| `computer-16.png`, `-32.png` | My Computer, for the dev-only layout tool | `winXP/src/assets/windowsIcons/676(16x16).png`, `(32x32)` |
| `folder-16.png`, `-32.png` | Folder | `winXP/src/assets/windowsIcons/318(16x16).png`, `(32x32)` |
| `notepad-16.png`, `-32.png` | Notepad | `winXP/src/assets/windowsIcons/327(16x16).png`, `(32x32)` |
| `globe-16.png`, `-32.png` | Internet shortcut | `web-xp/src/assets/xp/InternetShortcut.png` (_scaled_) |
| `picture-viewer-16.png`, `-32.png` | Windows Picture and Fax Viewer | `web-xp/src/assets/xp/WindowsPictureandFaxViewer.png` (_scaled_) |
| `users-16.png`, `-32.png` | User Accounts | `web-xp/src/assets/xp/UserAccounts.png` (_scaled_) |
| `game-controller-16.png`, `-32.png` | Game controller | `web-xp/src/assets/xp/GameController.png` (_scaled_) |
