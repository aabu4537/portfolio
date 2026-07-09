# Career Championship '26 — Alam Bushara Portfolio

16-bit soccer-styled hybrid portfolio. Game-style landing, recruiter-friendly resume underneath.

## Run locally
npm install
npm run dev        # http://localhost:3000

## Routes
- `/`         Full experience (title screen, mode select). Returning visitors skip the intro; add `?play=1` to force it.
- `/resume`   Straight to the resume view. Use this URL on LinkedIn and applications.

## Deploy (choose one)
1. Push this folder to a GitHub repo, then vercel.com > Add New Project > import the repo. Done — every push redeploys.
2. Or from this folder: `npx vercel login` then `npx vercel deploy --prod`.

## Editing content
All resume text lives in `lib/content.ts`. Components never need touching for content changes.

## Follow-ups
- MATCH PROGRAM (PDF) button is an inert placeholder: drop your resume PDF into `public/resume.pdf` and change the placeholder span in `components/ProLayer.tsx` to `<a className="btn" href="/resume.pdf" download>MATCH PROGRAM (PDF)</a>`.
- After deploying, set `metadataBase` in `app/layout.tsx` to your live URL so the social preview image resolves.
- Custom domain: add via Vercel project settings.
