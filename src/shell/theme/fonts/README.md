# Fonts

`wine-tahoma.woff2` and `wine-tahoma-bold.woff2` are Wine's free Tahoma (`tahoma.ttf`, `tahomabd.ttf` from `../references/wine-fonts/`), metric-compatible with Microsoft's. They're licensed under the LGPL 2.1 (`COPYING.LIB`) and loaded as the family `Wine Tahoma`, listed after `Tahoma` so systems that have the real font use it.

They're cut down to the Windows-1252 characters and converted to WOFF2 with fontTools, which took them from 140 KB each to 13 KB:

```sh
pyftsubset tahoma.ttf --unicodes="U+0020-007E,U+00A0-00FF,U+0152-0153,U+0160-0161,U+0178,U+017D-017E,U+0192,U+02C6,U+02DC,U+2013-2014,U+2018-201A,U+201C-201E,U+2020-2022,U+2026,U+2030,U+2039-203A,U+20AC,U+2122" \
  --layout-features='*' --flavor=woff2 --recalc-bounds --drop-tables+=BDF,FFTM --output-file=wine-tahoma.woff2
```

Text outside those characters falls back to another font. The embedded bitmaps are left out, as browsers draw the outlines anyway, and recalculating the bounds stops Firefox warning about the originals' glyph boxes.
