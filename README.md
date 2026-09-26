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

## Current boundaries

- PNG export is 1024 × 1024; GIF is 512 × 512, with 50 frames over 2 seconds.
- The renderer composes and animates system emoji glyphs. It does not use Telegram artwork, generative AI, or a facial animation rig.
- Unicode coverage does not include proprietary WhatsApp/Telegram stickers or guarantee font support on older devices.
- Meaning rules suggest an interpretation; arbitrary combinations are not guaranteed to communicate universally.
- An Android keyboard development preview lives in `android/`; see its setup and compatibility notes. iOS keyboards and Windows input integration are not included.
- Brand configuration and a web SDK prototype are included; commercial exclusivity is not implied.

## Third-party notices

Unicode data: `dist/vendor/UNICODE-LICENSE.txt`.
GIF encoder: gifenc 1.0.3, `dist/vendor/gifenc-LICENSE.txt`.
System emoji artwork is supplied by each device. Review artwork rights before commercial cross-platform distribution. No new license for the project's original source has been selected yet.
