# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Career Championship '26" — a 16-bit soccer-themed personal portfolio for Alam Bushara. Next.js 15 (App Router) + React 19 + TypeScript. No test suite, linter, or CSS framework is configured.

## Commands

```sh
npm install
npm run dev      # dev server at http://localhost:3000
npm run build    # production build (also the de facto type/correctness check)
npm run start    # serve the production build
```

Next 15 requires Node ≥18.18; the system Node may be older (`npx tsc --noEmit` still works for a quick typecheck if the build refuses to run).

## Architecture

The site is two layers stacked on the same page:

- **GameLayer** (`components/GameLayer.tsx`, client component): the retro game intro — title screen → mode-select menu, with Genesis-style sound effects from `lib/sound.ts` (Web Audio, toggleable, preference persisted). Selecting a mode scroll-jumps to the matching section id in ProLayer, except the "KICK OFF" item, which switches GameLayer into its `match` phase and mounts **MatchGame** (`components/MatchGame.tsx`): a playable canvas 5v5 soccer match. MatchGame renders at a fixed 320×180 logical resolution upscaled with `image-rendering: pixelated`; all simulation state lives in refs and module-level pure functions (`step`, `draw`), with React state only for the HUD. Full time offers REMATCH / VIEW RESUME / MODE SELECT.
- **ProLayer** (`components/ProLayer.tsx`, server component): the actual recruiter-facing resume. Rendered beneath GameLayer on `/`, and alone on `/resume` (the URL used on LinkedIn/applications).

Routes: `/` = full experience, `/resume` = resume only. `app/opengraph-image.tsx` generates the social preview image.

**All resume text lives in `lib/content.ts`** — identity, intro, fixtures (jobs), project, education, modes. Content edits never require touching components. The soccer metaphor runs through the naming: fixtures = work history, squad/formation = skills, highlights = project, academy = education, friendlies = contact.

Styling is a single global stylesheet, `app/globals.css` (deliberate choice over CSS modules — design tokens and the `.px` pixel-font utility class span all components). Fonts load via `<link>` tags in `app/layout.tsx`, not `next/font`. `components/Sprites.tsx` is an inline SVG `<symbol>` sheet referenced via `<use href="#...">`.

## Conventions

- No em-dashes in user-visible copy; no mention of security clearance or personal location branding (deliberate content decisions — see `implementation-notes.md`).
- User-visible game-layer text is uppercase with the `.px` class.
- After deploying to a final URL, `metadataBase` in `app/layout.tsx` should be set to it so the OG image resolves.
