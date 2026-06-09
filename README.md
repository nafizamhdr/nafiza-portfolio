# Nafiza Portfolio

Personal portfolio for **Nafiza Mahadri Widyatamaka** — AI Engineer & Fullstack Developer.

Built with Next.js 15 (App Router), TypeScript, Tailwind, and Framer Motion. Dark mode only. Fully static — no database, no API routes.

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Editing content

All content is in **TypeScript files** — edit, save, refresh.

| What you want to change | File |
|---|---|
| Name, bio, role, education, experience, skills, socials | [`lib/site-config.ts`](lib/site-config.ts) |
| Projects (add / edit / remove) | [`lib/projects.ts`](lib/projects.ts) |
| Profile photo | replace `public/profile.jpg` |
| Project images | drop into `public/projects/` and reference in `lib/projects.ts` |

### Adding a new project

Open [`lib/projects.ts`](lib/projects.ts) and append to the `projects` array:

```ts
{
  id: 4,
  name: "My New Project",
  slug: "my-new-project",
  category: "AI",                        // AI | Fullstack | Frontend | Backend | Web3 | Mobile
  role: "Solo Developer",
  description: "What it does and why it matters…",
  stack: ["Next.js", "Python", "OpenAI"],
  imageUrl: "/projects/my-new-project.png",   // drop the file into public/projects/
  repoUrl: "https://github.com/you/repo",
  demoUrl: "https://demo.example.com",        // optional
  featured: true,
  position: 40,                          // higher = shown first
},
```

Commit & push — Vercel auto-deploys.

## Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. Import the repo into Vercel — it autodetects Next.js.
3. Click **Deploy**. No env vars required.

## Project structure

```
app/
  page.tsx            # homepage — composes all sections
  layout.tsx          # root layout, fonts, metadata
  globals.css         # Tailwind + theme tokens
components/
  layout/             # navbar, footer
  sections/           # hero, about, skills, projects, contact
  ui/                 # button, input, card primitives
lib/
  site-config.ts      # name, bio, skills, socials
  projects.ts         # project list (the only file you'll touch often)
  utils.ts            # cn() helper
public/
  profile.jpg
  projects/           # project screenshots
```
