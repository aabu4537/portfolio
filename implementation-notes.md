# Implementation Notes

## Goal
Production Next.js/TypeScript portfolio for Alam Bushara, matching approved prototype v2, with post-approval edits: no clearance mention, no personal-location branding, GitHub link added, cursor removed, hint spacing fixed, em-dash sweep, PDF button left as placeholder.

## Approved Plan Summary
Next.js App Router + TS, content in lib/content.ts, `/` = full game experience, `/resume` = direct pro view, repeat visitors skip intro (localStorage), SEO + OG image, deploy to Vercel.

## Decisions Made

| Decision | Reason | Risk | Reversible? |
|---|---|---|---|
| Single global stylesheet instead of CSS modules | Design tokens and .px utility span all components; modules add friction with no isolation benefit here | Low | Yes |
| Google Fonts via <link> instead of next/font | next/font downloads fonts at build time; fonts.googleapis.com not reachable from build container | Slight FOUT | Yes |
| INSERT COIN links to /?play=1 | Forces game layer even for returning visitors | None | Yes |
| PDF button kept as inert placeholder | User instruction: "just leave it" | Dead-ish button in prod | Yes |
| Job locations kept in fixture cards | User approved; standard resume convention | None | Yes |

## Deviations

| Original plan | Deviation | Reason | Impact |
|---|---|---|---|
| CSS modules | Global CSS | See above | None user-visible |
| next/font | link tags | Build-container network limits | Minor perf |

## Open Questions
- Custom domain (post-deploy follow-up)
- Updated resume PDF for MATCH PROGRAM button

## Files Changed
- app/layout.tsx, app/page.tsx, app/resume/page.tsx, app/opengraph-image.tsx, app/globals.css
- components/GameLayer.tsx, ProLayer.tsx, Scoreboard.tsx, Formation.tsx, Sprites.tsx
- lib/content.ts
- package.json, tsconfig.json, next.config.mjs
