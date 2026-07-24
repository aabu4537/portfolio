# ⚽ Career Championship '26

An interactive portfolio that blends a retro 16-bit soccer game with a modern software engineering resume.

Instead of scrolling through another static portfolio, visitors begin at a game-inspired title screen before entering a polished, recruiter-friendly resume experience.

**Live Demo:** https://alambushara.vercel.app/

---

## Features

* 🎮 Retro 16-bit soccer themed landing page
* 📄 Recruiter-friendly resume mode
* ⚡ Fast, responsive interface built with Next.js
* 💻 Fully written in TypeScript
* 🎨 Pixel-art inspired UI and animations
* 📱 Responsive across desktop and mobile
* 🚀 Optimized for Vercel deployment

---

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* Vercel

---

## Pages

| Route     | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| `/`       | Full interactive experience with animated intro and game mode selection |
| `/resume` | Direct resume view for recruiters, LinkedIn, and job applications       |

Returning visitors automatically skip the intro for a faster experience.

Append `?play=1` to the URL to replay the full introduction.

---

## Local Development

```bash
npm install
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

## Deployment

### Vercel (Recommended)

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Deploy.

Every Git push automatically creates a new deployment.

Or deploy directly from the CLI:

```bash
npx vercel login
npx vercel deploy --prod
```

---

## Updating Resume Content

All portfolio and resume content is centralized in:

```
lib/content.ts
```

No component modifications are required when updating projects, experience, skills, or education.

---

## Resume PDF

To enable downloadable resumes:

1. Place your PDF inside:

```
public/resume.pdf
```

2. Replace the placeholder button in:

```
components/ProLayer.tsx
```

with:

```tsx
<a className="btn" href="/resume.pdf" download>
  MATCH PROGRAM (PDF)
</a>
```

---

## Social Preview

After deployment, update:

```
app/layout.tsx
```

with your production `metadataBase` so Open Graph images render correctly on LinkedIn, Discord, and X.

---

## Inspiration

This project was inspired by classic soccer video games from the 1990s and combines nostalgic pixel-art aesthetics with a modern portfolio designed for software engineering recruiters.

---

Built by **Alam Bushara**
