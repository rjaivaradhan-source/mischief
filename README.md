# Mischief Emoji Lab

A local-first emoji mixer, installable web app, and developer-preview web SDK.

## Run locally

Install Node.js 20 or newer. Open a terminal in this folder and run:

```sh
npm start
```

Open **http://127.0.0.1:4180**. No dependency installation, API key, or paid service is required. Stop with Ctrl+C. Choose another port using the `PORT` environment variable if needed.

Local development disables service-worker registration to avoid stale cached files. The hosted HTTPS app retains installation and offline support. The most recent mix and animation preferences stay on the current device; blocked browser storage does not prevent mixing.

## Validate

```sh
npm test
```

Tests cover catalog completeness, composition roles, font sizing, motion-loop continuity, draft validation, public asset references, and local server behavior. Visual appearance still needs review on target devices because the artwork uses system emoji fonts.

## Project layout

- `dist/`: complete static app, versioned browser assets, service worker, SDK and integration demo.
- `dist/composition.js`: subject selection, attached modifiers and frame rendering.
- `dist/meaning.js`: authored meaning suggestions used internally and for accessibility.
- `dist/motion.mjs`: playback and animated GIF export.
- `dist/catalog.js`: Unicode 17.0 catalog, 3,953 emoji sequences/components.
- `dist/brand-sdk.mjs`: embeddable app-owned composer integration.
- `scripts/serve.mjs`: dependency-free local preview server.
- `tests/`: automated regression checks.
- `.openai/hosting.json`: existing Sites identity; do not create a replacement Site.

Open `/integration-demo.html` locally for the brand integration example and `/integration.html` for its contract and limitations.

## Releases and Git

Source history is tracked in this folder's own Git repository. The GitHub repository is https://github.com/rjaivaradhan-source/mischief. Sites also maintains a separate source repository for publishing. Pushing to GitHub does not publish the app; hosting is a separate step.

For app releases, bump the service-worker cache version and versioned browser asset URLs together. Keep the archive aligned with the exact pushed commit. Never commit source-access tokens or `.env` files. Existing installations may offer an **Update app** button.

## Special Library

Six designed pairs use bundled, transparent 3D-style artwork: thinking king, frozen smile, burning heart, loved up, rainy days, and fiery mood. Select them in the Special Library or mix their ingredients directly. Add any catalog emoji as a third or fourth ingredient; additional effects and accents still use the shared renderer. All 131 face expressions can be combined with 15 treatments in `dist/library.html`; 129 use bundled Microsoft Fluent 3D artwork and two newer expressions use the device font. Other categories remain available through the same browser and standard renderer. The web Special artwork switch lets you compare both styles.

Assets live in `dist/special/`; `dist/special.js` handles matching, loading, alpha bounds, failure fallback and gentle motion. These are pre-rendered illustrations, not poseable 3D meshes or runtime AI generations. PNG/GIF export waits for the selected asset, and all six plus the 129 base faces are cached offline and bundled in Android preview 0.3.0.

## Current boundaries

- PNG export is 1024 × 1024; GIF is 512 × 512, with 50 frames over 2 seconds.
- The standard renderer composes system emoji glyphs. Special Library assets were AI-generated during development and are bundled locally; runtime mixing does not call AI. Neither path uses Telegram artwork or a facial animation rig.
- Unicode coverage does not include proprietary WhatsApp/Telegram stickers or guarantee font support on older devices.
- Meaning rules suggest an interpretation; arbitrary combinations are not guaranteed to communicate universally.
- A signed Android keyboard development APK is available in [`releases/Mischief-Android-preview.apk`](releases/Mischief-Android-preview.apk). See [`android/README.md`](android/README.md) for installation, build checks and compatibility limits. Physical-device testing is still required. iOS keyboards and Windows input integration are not included.
- Brand configuration and a web SDK prototype are included; commercial exclusivity is not implied.

## Third-party notices

Microsoft Fluent Emoji: `dist/faces/LICENSE.txt` (MIT). Original 256px PNGs; exporting at a larger size does not add detail. Source revision is recorded in `dist/faces/SOURCE.json`.

Unicode data: `dist/vendor/UNICODE-LICENSE.txt`.
GIF encoder: gifenc 1.0.3, `dist/vendor/gifenc-LICENSE.txt`.
System emoji artwork is supplied by each device. Review artwork rights before commercial cross-platform distribution. No new license for the project's original source has been selected yet.

## Expanded review library

Run `node scripts/expand-library.mjs` after `npm ci` to export 1,965 transparent 512px PNG compositions and a local searchable HTML gallery. Optional argument: output folder. These are shared treatments, not 1,965 individually sculpted characters. `scripts/import-faces.mjs` refreshes the 129 face sources from a pinned Microsoft commit. All other catalog pairs can be inspected on `library.html`; unsupported semantic combinations remain layered compositions.
