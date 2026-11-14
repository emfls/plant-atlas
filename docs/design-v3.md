# Herbarium theme redesign

The owner delegated routine design decisions and authorized publication to this existing GitHub Pages site. The chosen direction is an airy botanical herbarium: cream paper, sage ink, specimen-sheet cards, original leaf motifs and restrained terracotta annotations. It is intentionally different from the wildlife field journal and travel editorial.

A generic recolor was rejected because it does not give the collection a botanical identity. Photography was rejected because suitable files and licenses have not been verified. The leaf illustrations are decorative original graphics, not accurate species plates or identification material.

## Plan and constraints
1. Pin the original six records, all source/caveat text, noindex, relative links and original application/data bytes with a regression check. Observe the new-theme check fail before implementation.
2. Add versioned herbarium CSS and leaf SVG. Update homepage and six detail pages only in their presentation. Keep search, all five filters, maximum-three comparison, reset and static architecture intact.
3. Test combinations, search normalization, empty results, selection limit, comparison rendering and deferred reset. Validate seven pages, source links and SVG syntax. Request public responsive browser QA without claiming it passed in advance.
4. Recheck remote head and atomically publish with an expected-head lease. Verify the commit, matching Pages run, public HTML/CSS/SVG and details.

Keyboard focus, labels, live regions, skip link, reduced motion and hidden-card enforcement remain. The comparison table scrolls within its own container on narrow screens. No new runtime dependencies, network requests, tracking or storage keys are introduced.
