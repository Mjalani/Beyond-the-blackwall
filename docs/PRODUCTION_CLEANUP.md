# Production Cleanup Roadmap

## Goal

Turn the current proof-of-concept into a dependable publishing system for:

1. the live interactive web edition;
2. a broadly compatible reflowable EPUB;
3. a later fixed-layout / print collector edition.

## Fixed in the current cleanup pass

### Canonical manuscript source
The book now has one canonical source: `content/book.json`.

The React reader consumes this file, and the EPUB builder consumes the same file. This removes the old fragile design in which Python attempted to parse TypeScript source using regular expressions.

### City illustration CSS collision
The scene name `art-city` was also being used for the city-silhouette element itself. On city pages this could apply positioning rules to the entire illustration page. The inner element is now isolated as `city-silhouette`.

### Mobile previous-page turn
The desktop reverse-turn uses the illustrated left page as the front of the sheet. That made mobile reverse navigation show an illustration instead of the current prose page. Mobile now gets a prose-front reverse turn.

### Keyboard behavior
Global keyboard navigation no longer steals Space/arrow input from links, buttons, form controls, or editable elements. Page-turn keys are also disabled while the table of contents is open.

## Priority 0 — release blockers

### Replace placeholder hero art
The SVG diagrams are visual placeholders. Final release should use commissioned/generated static artwork for the major plates. The procedural system should remain only as subtle transitional decoration and as a fallback.

### Validate all page-turn states
Test:
- first page;
- last page;
- rapid repeated next/previous input;
- previous navigation on mobile;
- reduced-motion mode;
- resize during a turn;
- TOC open during navigation;
- touch devices;
- Safari/iOS 3D transforms;
- Firefox backface rendering.

### Make art assets platform-safe
Final illustration deliverables should include:
- web: AVIF/WebP preferred, JPEG fallback;
- EPUB: high-quality JPEG or PNG;
- print master: lossless TIFF/PNG or high-quality source export.

Do not make essential story information exist only inside an image.

## Priority 1 — maintainability

### Split the reader monolith
Move these concerns out of `app/page.tsx`:
- reader navigation/state;
- text page;
- illustration page;
- plate page;
- procedural fallback art;
- hero-art mapping.

### Split CSS by responsibility
Replace the single compressed stylesheet with:
- tokens.css
- layout.css
- typography.css
- reader.css
- animation.css
- illustration.css
- responsive.css

### Stable book identifiers
Before commercial release, replace build-generated random EPUB identifiers with a stable publication identifier. If an ISBN is obtained, use it in metadata while preserving an internal stable UUID.

### EPUB quality gate
Add EPUBCheck to CI before treating an EPUB artifact as release-ready. Current structural checks catch malformed XML and ZIP packaging errors, but EPUBCheck should be the publication gate.

### Lock dependency versions
Commit a lockfile and use reproducible installs in CI. Avoid floating framework versions for a publishing project that should render consistently months later.

## Priority 2 — reader polish

### URL/bookmarks
Allow a page/chapter to be represented in the URL so a reader can return to the same location and share a chapter link.

### Reading persistence
Persist the last reading position locally, with a simple “resume” option.

### Touch gestures
Add restrained swipe/drag support without making accidental turns easy.

### Full-spread plates
Some hero moments should temporarily break the standard left-art/right-text grammar and become a cinematic two-page spread.

### Loading strategy
Preload the next hero image while keeping the current spread lightweight. Avoid loading every full-resolution plate at initial page load.

### Accessibility
- semantic chapter headings;
- meaningful alt text for every final illustration;
- visible focus states;
- reduced-motion path;
- adequate contrast;
- no essential meaning encoded only by color;
- screen-reader-friendly TOC and page navigation.

## Definition of “clean”

The project should not be considered release-clean until:

- production build passes;
- Pages deploy passes;
- EPUB build passes;
- EPUBCheck passes;
- no console errors on desktop/mobile;
- no broken images;
- no mirrored/ghost page during turns;
- forward/backward turns match on mobile;
- every chapter is reachable from the TOC;
- reader state survives resizing safely;
- hero artwork is final-resolution;
- Kindle Previewer / Apple Books / Kobo spot-checks are completed.
