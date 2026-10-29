# Saved smiley library

The app uses all 1,965 PNGs from ../mischief-special-library/smiley-mixtures for exact two-emoji pairs, in either order. Source files are unchanged.

Run node scripts/import-saved-mixtures.mjs to refresh the bundled copies. The premium collection remains separate. Three- and four-emoji mixes use the existing composition renderer.

Artwork loads on demand. Viewed mixtures are cached for offline use; unseen mixtures require a connection or the local server. Animation gently moves the complete saved sticker. PNG exports upscale the original 512-pixel artwork; they do not add detail.
