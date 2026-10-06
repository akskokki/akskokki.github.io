# Wallpapers

Bliss at nine times of day. Each shows alone at a moment set by how high the sun is, where the visitor's time zone puts them, and in between the wallpaper mixes the two it's between (`sky.ts`). Day is Microsoft's own Bliss, in `src/art/`. The other eight are relit versions of it that the owner made with an image model, each as an edit of the original photo so its clouds stay where they are and the pictures crossfade cleanly, then upscaled to 1920×1080; `PROMPTS.md` has the prompts, for redoing one. As over a real landscape, the morning light comes from the right and the evening light from the left.

| Period            | File                     | Made from                                 |
| ----------------- | ------------------------ | ----------------------------------------- |
| Morning blue hour | `morning-blue-hour.webp` | `bliss-1-morning-blue-hour-1920x1080.png` |
| Predawn           | `predawn.webp`           | `bliss-2-predawn-1920x1080.png`           |
| Morning           | `morning.webp`           | `bliss-3-morning-1920x1080.png`           |
| Golden hour       | `golden-hour.webp`       | `bliss-4-golden-hour-1920x1080.png`       |
| Sunset            | `sunset.webp`            | `bliss-5-sunset-1920x1080.png`            |
| Dusk              | `dusk.webp`              | `bliss-6-dusk-1920x1080.png`              |
| Evening blue hour | `evening-blue-hour.webp` | `bliss-7-evening-blue-hour-1920x1080.png` |
| Night             | `night.webp`             | `bliss-8-night-1920x1080.png`             |

Each is lossy WebP at quality 80, with a 32×18 `-preview.webp` that comes with the page and shows blurred until the picture has loaded. To replace one, make both from the new picture, here with Pillow:

```python
from PIL import Image

image = Image.open('bliss-8-night-1920x1080.png').convert('RGB')
image.save('night.webp', quality=80, method=6)
image.resize((32, 18), Image.LANCZOS).save('night-preview.webp', quality=80, method=6)
```

`zones.ts` places each time zone at its main city, from the tz database; its header says how it was made.
