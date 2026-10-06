# Wallpaper prompts

The prompts that made the eight time-of-day pictures in this folder, kept for redoing one or making the set again. They were sent to ChatGPT, whose image model relit the original Bliss for each time of day; its upscaling then took each to 1920×1080. An earlier set, generated more freely, added clouds and moved others, which showed as double images in the crossfades. These prompts fixed that by making every picture an edit of the original photo.

## How

- **A fresh chat,** with no earlier pictures in its context for the model to build on.
- **Attach only the original Bliss** (`../references/web-xp/public/wallpaper/Bliss.jpg`), and none of the generated pictures.
- **One picture per message,** each an edit of the original, never of the previous result, so drift doesn't compound.
- **In the order below,** not the order of the day: the smallest edit first, so the chat's first result sets a faithful tone; pictures that crossfade with each other one after another, so their looks match; morning second, so the light from the right is established before a run of left-lit pictures makes it a habit; and night, the biggest change, last.
- **Check each picture's clouds against the original** before using it, and redo any that drift. The check compares only the clouds' shapes, not their colours: in the sky above the hill, at 480×270, each picture minus a 6 px blur of itself, normalised, correlated with the same for Bliss. 1.00 means the same cloud shapes; re-rendering differences cost a little, added or reshaped clouds a lot. This set scored 0.88–0.96. The earlier one scored 0.30–0.86.

## The order

| Step | Picture              | Light from |
| ---- | -------------------- | ---------- |
| 1    | 4. Golden hour       | left       |
| 2    | 3. Morning           | right      |
| 3    | 5. Sunset            | left       |
| 4    | 6. Dusk              | left       |
| 5    | 7. Evening blue hour | left       |
| 6    | 2. Predawn           | right      |
| 7    | 1. Morning blue hour | right      |
| 8    | 8. Night             | none       |

The numbers are the pictures' places in the day, which their file names keep.

## Step 1: setup and golden hour

Attach the original Bliss, then send:

```
The attached photo is the original Windows XP "Bliss" wallpaper. I need eight versions of it at different times of day, for a desktop wallpaper that crossfades smoothly between them as the day goes by. Because they'll be crossfaded, every version must be the same photograph with different lighting: the same scene, the same framing, and above all the same clouds.

Rules for every picture:

1. Always start from the original photo attached here. Never start from a picture you made earlier in this chat.
2. Keep the composition identical: the hill and its crest line, the distant hills on the right and on the far left of the horizon, the dark strip of shrubs across the lower left, and the scattered small yellow flowers in the foreground.
3. Keep the same clouds. This is the most important rule. Every cloud in the original should still be there, in the same place and with the same shape, and there should be no new ones: no added wisps, streaks or bands, even where a real sunset or dawn sky would usually have them. Small differences from re-rendering are fine, such as slightly softer or sharper edges, fine detail redrawn, or a cloud a few pixels off, as long as each cloud still clearly looks like the same cloud. What must not happen is a cloud added, removed, moved noticeably, merged, split or reshaped. Beyond that, only the colour and brightness of the clouds change. The clouds in the original are:
   - a cluster of puffy white clouds in the top-left corner;
   - a large, thin, feathery streak sweeping from the top centre down towards the right, ending around the middle of the sky;
   - a big bright mass of cumulus along the top edge in the right third;
   - two small puffs in a row in the upper left, left of centre;
   - one long, thin wispy cloud on the left, halfway down the sky;
   - a row of puffy cumulus running from the centre to the right edge, in the middle of the sky;
   - a small cumulus cluster at the right edge, a little above the middle;
   - a band of low, flat clouds just above the horizon, from the centre to the right;
   - a few tiny scattered puffs, and plenty of open, clear sky, especially in the left half.
4. The sun rises on the right and sets on the left, as it would over a real landscape: in the three morning pictures (1 to 3) the light and any glow come from the right, and in the evening pictures (4 to 7) from the left. When the sun is at or below the horizon, its glow is low on that side's horizon. The night picture has no glow. Never show the sun's disc or the moon themselves; they're always just out of frame.
5. It must look like a real photograph: the same lens and sharpness as the original, no painterly look, no lens flare, no text or watermarks.
6. After making each picture, upscale it to exactly 1920×1080 and give it to me as a PNG with the name I give.

The eight pictures, in the order of a day:

1. Morning blue hour (sun 8° below the horizon, rising): deep blue sky darkening upwards; a thin, faint band of pale pink and lavender low on the right horizon; clouds dim blue-grey; grass dark, desaturated green; no stars, or only one or two very faint ones. Name: bliss-1-morning-blue-hour-1920x1080.png
2. Predawn (sun 4° below, rising): cool pastel light; blue-violet sky overhead turning soft pink and peach towards the right horizon; cloud undersides pink and lavender; grass dim, cool green. Name: bliss-2-predawn-1920x1080.png
3. Morning (sun 5° up, low on the right, just out of frame): soft, clear early light; a lighter, paler blue sky with a gentle warm tint near the right horizon; white clouds with soft warm edges on their right sides; fresh green grass, the hill lit from the right with long, soft shadows. Name: bliss-3-morning-1920x1080.png
4. Golden hour (sun 10° up, late afternoon, on the left): warm golden light; blue sky fading to warm gold towards the left horizon; clouds golden-cream, lit from the left; warm yellow-green grass with long shadows. Name: bliss-4-golden-hour-1920x1080.png
5. Sunset (sun right at the horizon, on the left, just out of frame): orange and gold near the left horizon, through pink to blue-violet at the top; clouds glowing orange and pink from below; the grass in shade, a darker green, with warm light along the hill's crest. Name: bliss-5-sunset-1920x1080.png
6. Dusk (sun 5° below): warm afterglow; an orange band low on the left horizon fading through pink to blue-violet; clouds pink and mauve; dark green grass with no direct light. Name: bliss-6-dusk-1920x1080.png
7. Evening blue hour (sun 8° below): deep blue sky darkening upwards; a thin, faint band of fading warm orange low on the left horizon; clouds dim blue-grey, the lowest with the faintest warm tint; grass dark, desaturated green; no stars, or only one or two very faint ones. Name: bliss-7-evening-blue-hour-1920x1080.png
8. Night (moonlight, the moon out of frame): deep navy sky with a few stars; clouds lit silver-grey by the moon; grass very dark blue-green, with the hill's outline still readable against the sky. Name: bliss-8-night-1920x1080.png

We'll do them one at a time, in an order I'll give. Start with picture 4 (Golden hour). Before you answer, check your picture against the cloud list in rule 3, and redo it if any cloud is added, missing or clearly reshaped.
```

## Steps 2 to 8

Send each once the previous picture is done and looks right.

### Step 2: morning

```
Next, picture 3 (Morning). Start again from the original photo attached at the top, not from any picture you've made, and follow every rule from my first message. Note that this one is lit from the right, unlike golden hour: the low sun is just out of frame on the right, the warm tint is near the right horizon, the clouds' warm edges are on their right sides, and the hill is lit from the right.
```

### Step 3: sunset

```
Next, picture 5 (Sunset). Start again from the original photo attached at the top, and follow every rule from my first message. The light is from the left again. Sunset skies usually come with extra streaks of coloured cloud; don't add any. Colour only the clouds that are in the original.
```

### Step 4: dusk

```
Next, picture 6 (Dusk). Start again from the original photo attached at the top, and follow every rule from my first message. The glow is low on the left horizon. As with sunset, colour only the clouds in the original, with no added streaks or bands.
```

### Step 5: evening blue hour

```
Next, picture 7 (Evening blue hour). Start again from the original photo attached at the top, and follow every rule from my first message. The faint warm band is low on the left horizon. The clouds are dim, but every one of them should still be there and recognisable, not dissolved into the sky or redrawn.
```

### Step 6: predawn

```
Next, picture 2 (Predawn). Start again from the original photo attached at the top, and follow every rule from my first message. This one is lit from the right: the pink and peach are towards the right horizon. Keep it cooler and paler than the dusk picture, and as with sunset and dusk, colour only the clouds in the original, with no added streaks.
```

### Step 7: morning blue hour

```
Next, picture 1 (Morning blue hour). Start again from the original photo attached at the top, and follow every rule from my first message. It's lit like the evening blue hour, but with the faint band of pale pink and lavender low on the right horizon instead of orange on the left. The clouds are dim, but every one of them should still be there and recognisable.
```

### Step 8: night

```
Next, picture 8 (Night), the last one. Start again from the original photo attached at the top, and follow every rule from my first message. No glow on either side, and no moon in the sky: the clouds are lit silver-grey by a moon out of frame. Keep the stars few and small, and every cloud from the original in place and recognisable.
```

## If a picture changes the clouds anyway

```
There are extra clouds compared to the original (or a cloud is missing or clearly reshaped). Redo it from the original photo, keeping the clouds as they were and changing only the lighting.
```
