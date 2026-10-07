# Publishing compatibility notes

## Primary ebook target

Use a reflowable EPUB 3.x build as the broad-compatibility edition. Body text must remain selectable, resizable, searchable, and readable with user font-size controls.

## Illustrated plates

Major plates should be exported as static image/SVG assets with useful alt text. The interactive website may animate or layer them, but the EPUB must preserve the scene as a static composition.

## Do not make story content depend on

- JavaScript
- hover states
- page-turn animations
- a fixed viewport size
- audio/video playback

## Collector edition

A later fixed-layout EPUB or PDF may preserve exact two-page spread composition. That edition should be separate from the primary reflowable EPUB rather than forcing fixed layout on all readers.
