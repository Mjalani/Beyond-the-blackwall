# Beyond the Blackwall

**Beyond the Blackwall** is an original illustrated cyberpunk novel designed to publish from one source into multiple editions.

## Publication model

The project keeps the story, scene metadata, and illustrations reusable so the same canon can feed:

- an interactive web edition with animated page turns and illustrated spreads;
- a reflowable EPUB edition for broad Kindle, Apple Books, Kobo, tablet, phone, and accessibility-reader compatibility;
- a fixed-layout collector edition / print-ready PDF later, where exact spread composition matters.

The web reader can be visually ambitious, but no essential story content should depend on JavaScript animation. Major illustrations must also have static counterparts suitable for EPUB export.

## Current book

- Chapter I — **The Second Collapse of the Net**
- Chapter II — **Beyond the Blackwall**
- Chapter III — **The First Seal**
- Chapter IV — **The Lantern War** (teaser / next chapter)

Major illustrated scenes currently include the 1,200-agent clandestine board, Mara facing Chorus, the Optimizer beneath the Net, the NetWatch bunker, the First Seal, and the Blackwall.

## Repository boundaries

This repository is intentionally standalone. It is not part of, dependent on, or connected to the Meridian project.

## Structure

- `app/` — interactive web reader
- `data/chapters.ts` — canonical story/page data for the current web edition
- `publication/` — publishing metadata and EPUB/print compatibility notes

## Development

The web edition uses Next.js / React. Future publishing work should keep EPUB output standards-compliant and readable without scripting.
