# Bloede Feainne Games

**Independent Games. Infinite Worlds.**

Static website for `bloede-feainne-games/bloede-feainne-games.github.io`, intended for **https://bloede-feainne-games.github.io/**.

Plain HTML5, CSS3, and a small vanilla JavaScript navigation enhancement. No frameworks, build tools, packages, backend, databases, analytics, cookies, tracking, external fonts, or runtime dependencies.

## Structure

```text
index.html                          Home and featured games
games/index.html                    Merge Planets and Proletarian Runner
contact/index.html                  Studio contact and public email
privacy/merge-planets/index.html    Merge Planets privacy policy
404.html                            Custom error page
assets/css/site.css                 Shared styles and responsive layouts
assets/js/site.js                   Mobile navigation only
assets/images/                     Studio splash, concept art, mark, favicon, social card
robots.txt                          Crawler settings and sitemap location
sitemap.xml                         Indexable canonical URLs
.nojekyll                           Disable Jekyll processing
```

Privacy URL: **https://bloede-feainne-games.github.io/privacy/merge-planets/**

## Before launch

1. The public studio email is **bloedefeainne.games@outlook.com**. It is linked from Contact, the privacy policy, and every page footer. Keep these copies consistent if the address changes; do not add private contact details.
2. The local policy now describes the Google Play Games update for `com.feainne.mergeplanets`. Publish it only with authorization and resolve the documented native-SDK/Console questions before Data safety submission. See the [Data safety guide](docs/google-play-data-safety.md) and [current implementation evidence](docs/advertising-privacy-audit-2026-11-05.md).
3. Replace screenshot and game-icon placeholders when real assets are ready. Original concept artwork is explicitly labeled **not gameplay** and may remain as decoration.
4. Keep the Google Play placeholder inactive until the game is published. Find `GOOGLE_PLAY_URL_HERE` in `games/index.html`; replace `.store-placeholder` with an ordinary anchor to the verified listing, update the adjacent note, and update Home's publication status.

The audited Alpha uses **optional Google rewarded ads and UMP with separate adult and restricted age routes**. Yandex/AppMetrica are excluded from its Android runtime. The policy conditionally describes a planned adult-only Yandex route in Russia; enabling it requires implementation and verification of consent and safe native lifecycle. Production ads and real purchases remain disabled. See the [updated audit](docs/advertising-privacy-audit-2026-11-05.md) and [Data Safety changes](docs/google-play-data-safety.md). Proletarian Runner is labeled **In Development**, without an invented platform or release date.

## Preview

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000/** and stop with Ctrl+C. Python is an optional preview tool, not a deployment dependency or backend. HTTP preview handles directory URLs; opening individual files directly will not reproduce all routing, particularly the custom 404.

Check desktop, tablet, mobile, keyboard focus, menu dismissal with Escape, reduced motion, and operation without JavaScript. Navigation stays visible when JavaScript is unavailable.

## Deploy to GitHub Pages

1. Commit and push the site to this repository's `main` branch, including `.nojekyll`, nested pages, and assets.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select **main** and **/ (root)**, then **Save**.
5. Wait for the deployment, then visit **https://bloede-feainne-games.github.io/**. Verify the four pages and a nonexistent path for the custom 404.

This is an organization site: do not append a repository name to the URL. No custom Actions workflow, build command, or secrets are needed. GitHub Pages on GitHub Free supports public repositories. The deployed files are public.

For an implementation committed only locally, authenticate through your normal GitHub workflow, then run `git push origin main`.

For subsequent updates:

```sh
git add .
git commit -m "Update studio website"
git push origin main
```

Pages automatically republishes pushes to the selected branch. For another domain or a project subdirectory, update canonicals, social-image URLs, `robots.txt`, `sitemap.xml`, and the root-relative paths in `404.html`.

Official references: [publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [creating a Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), and [Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Maintain and extend

Design tokens live at the top of `assets/css/site.css`. The visual identity follows the supplied studio splash: black, crimson, warm gold, serif headings, and fine ornamental dividers. Typography uses system sans-serif fonts and local serif fallbacks. All assets are hosted locally; no fonts or images are downloaded from other services.

Headers and footers are ordinary HTML repeated across all five pages. Update all copies when navigation or branding changes. Nested pages use relative paths. The custom 404 uses root-relative paths so it works at any missing URL on this organization site.

The small `site.js` script only manages the mobile menu: `aria-expanded`, Escape, outside-click dismissal, and viewport changes. It performs no network requests and stores nothing. Content and navigation remain usable without it.

### Screenshots and icons

Put optimized images you own in `assets/images/`. Replace each `.screen-placeholder` in `games/index.html` with an image, preserving its surrounding figure:

```html
<img class="screenshot-image"
     src="../assets/images/merge-planets-01.webp"
     alt="Describe the gameplay actually shown"
     width="720" height="1280" loading="lazy">
```

Use actual image dimensions and accurate alternative text; update the caption and remove placeholder wording. Images keep their natural proportions. Replace `game-icon-placeholder.svg` and update its alternative text when the real game icon is ready.

`studio-splash.webp` is the optimized, full composition of the studio artwork supplied in the repository root. Home uses it as its main image. `studio-mark.svg` contains a self-contained crop of the same emblem; `favicon.svg` is a simplified crimson-and-gold interpretation for small sizes. `eclipse.svg` is retained as a legacy asset. The two game concept illustrations use the studio palette and are not actual game environments or screenshots. Use only your own or appropriately licensed replacement assets.

`social-card.svg` is the self-contained **1200 × 630** composition of the supplied studio splash. `social-card.png` is the matching raster version referenced by Open Graph and Twitter metadata. When replacing the studio artwork, update both versions. No graphics software is needed to deploy the existing files.

### Add another game

Duplicate a `.game-project` article in Games, assign unique IDs, and add verified content, status, assets, store links, and any game-specific policy. Add a `.game-card` on Home and a jump-navigation link in Games. For another policy, create `privacy/GAME-SLUG/index.html`, adjust its relative paths and metadata, and supply verified game-specific information.

### Maintain the privacy policy

The policy at `/privacy/merge-planets/`, revised 5 November 2026, covers Google
Play Games, achievements and rankings, local/cloud saves, optional rewarded ads,
age records, UMP choices, deletion, hosting and support. It distinguishes the
Google-only Alpha from conditional adult-only Yandex mediation. It contains no
SDK/build versions or fixed achievement count.

Read the current addendum at the start of the [source/APK audit](docs/advertising-privacy-audit-2026-11-05.md)
and the [Data Safety guide](docs/google-play-data-safety.md). Older audit sections
remain historical evidence for earlier artifacts. Preparing the files does not
publish them, submit Console answers or enable production advertising.

Routine UI/achievement updates and test-to-live changes need no policy rewrite
if providers, data, purposes and safeguards remain as disclosed. Always check SDK
and configuration changes for new processing. Additional analytics, payments,
providers or data uses require a new review and matching disclosure before use.
The policy layout, styles, navigation, contacts and public URL are preserved.

## Accessibility and privacy

Semantic landmarks, one H1 per page, visible focus, skip links, descriptive alternative text, current-page navigation, readable contrast, a no-JavaScript navigation fallback, and reduced-motion support are included. Decorative images are hidden from assistive technology where appropriate.

Metadata includes page-specific titles, descriptions, canonicals, Open Graph/Twitter tags, a local social image, robots settings, sitemap, and custom 404.

The source contains no tracking, analytics, cookies, storage APIs, remote assets, or third-party embeds. GitHub hosting has its own logs and policies; the site does not claim hosting is log-free.

## Verification limits

Static checks cover local file/fragment links, HTML structure, metadata and canonical URLs, navigation state, accessible references, SVG/XML validity, social-image dimensions, key text/background contrast pairs, and absence of remote runtime dependencies and tracking code.

JavaScript syntax and deterministic menu event checks passed, covering toggle behavior, Escape with focus restoration, outside clicks, link selection, viewport changes, desktop initialization, and missing-element handling. These script checks do not replace browser testing. Checked text/background pairs meet the WCAG AA 4.5:1 contrast threshold for normal text.

The crimson-and-gold redesign was checked in a browser on 2 November 2026. All five pages were checked at 320, 768, and 1280 px viewport widths, with no horizontal overflow or missing eager-loaded images; Home and Games were also inspected at 390 px. Mobile menu opening, Escape with focus restoration, and navigation to Games passed. Desktop Home and the privacy page were visually inspected. All 102 local file and fragment references passed static checks. The policy HTML was compared byte for byte against its pre-redesign working copy and is unchanged, including its existing local edits. Browser testing does not establish the behavior of the game itself; the app-specific build and verification limits remain in the [implementation report](docs/privacy-audit-merge-planets.md).
