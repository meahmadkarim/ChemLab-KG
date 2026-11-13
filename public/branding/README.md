# ChemLab KG — logo asset kit

This kit is prepared from the **approved AI-generated logo**, with the lower duplicate flask removed. Assets preserve the existing dark navy and blue styling and superscript KG wordmark.

## Suggested usage
- Navigation and footer: `chemlab-kg-horizontal-transparent.png` or `.webp`.
- Social/brand graphics: `chemlab-kg-horizontal-white.jpg` (white backdrop).
- Browser favicon: `favicon.ico`; or `chemlab-icon-32.png`.
- Apple touch: `apple-touch-icon.png`.
- PWA icons: `android-chrome-192x192.png`, `android-chrome-512x512.png`.
- Profiles, placeholders and social avatars: `chemlab-icon-512.png`.
- SVG files are **SVG wrappers containing the transparent PNG**, not true editable vector outlines. They scale as raster images; use the PNGs for best predictable results.

## Integration notes
1. Add assets to a suitable Next.js `public/branding/` directory.
2. Use the **horizontal image** in the site header and footer, with descriptive `alt="ChemLab KG"` and dimensions to avoid layout shift.
3. Use the standalone flask mark for favicons, apple touch icon and app icons.
4. Update Next.js metadata/icons and any manifest routes; check locale-specific layouts and login pages.
5. Keep text-only fallback brand rendering with KG superscript via semantic HTML/CSS, not Unicode superscripts, where image loading fails.
6. Preserve aspect ratios and transparent backgrounds; never stretch or recolor assets.
7. Do not change unrelated authentication, routing, or website behavior.

## Note on transparency
Background removal was derived from the white AI-rendered original; examine results over navy and warm white backgrounds before use. If you need production-grade infinitely scalable vectors, the artwork should be professionally traced/redrawn as native SVG.
