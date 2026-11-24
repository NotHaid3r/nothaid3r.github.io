# SmallAUTO website

Static, dependency-free site (HTML + one CSS file + ~100 lines of JS). Host it on any static host.

## Preview locally
    npx serve .        # or: python3 -m http.server

## Before going live (2 settings)
1. Set your real domain so canonical tags, og tags, og-image and sitemap.xml are generated:
       SITE_URL=https://your-domain.com node src/build.mjs
2. Real form delivery (optional but recommended). Without it, forms open the visitor's email app:
       SITE_URL=https://your-domain.com FORM_ENDPOINT=https://formspree.io/f/xxxx node src/build.mjs

## Editing content
All copy, prices and contact details are in the DATA section at the top of `src/build.mjs`.
Edit, then re-run the build command. Styles: `styles.css` (design tokens at the top).
