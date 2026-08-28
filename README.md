# HeyDev

Tinder for developer projects. You swipe on a collab brief — a project someone wants to ship — not on a dating profile. Right swipe means you’d build it with them. A match happens only when your **I bring** skills fill what they **need**. Gemini then writes the first message.

No login. Open the live URL and the deck works.

## Team

- Syamalatha Seera

Add remaining teammates here before submission.

## Live URL

Public app (reachable while this machine is running the production server):
https://bone-sol-feel-utilities.trycloudflare.com

Repo: https://github.com/SyamalathaSeera/Dinder

For a durable judge URL, import that GitHub repo at [vercel.com/new](https://vercel.com/new), then add `GEMINI_API_KEY` under Project → Settings → Environment Variables (never in the repo). After `npx vercel login`, `npx vercel --prod` also works.

## How to run

```bash
npm install
cp .env.example .env.local
# put GEMINI_API_KEY in .env.local — never commit it
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Where it lives | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | `.env.local` locally, Vercel Environment Variables in production | Server-only icebreaker. If missing or Gemini fails, a local template still shows. |

Do not put the key in source, README, or client code.

## What judges should try (no account)

1. Leave or change the **I bring** chips (defaults: React, TypeScript).
2. Swipe left to skip, right to ship. Or use the buttons.
3. When your skills match **They need**, you get **Hey, Dev.** plus an icebreaker.
4. Optional: **Post** a project (saved in this browser) or open **Matches**.

## Scope we cut

Real chat, GitHub OAuth, and mutual-swipe backend. Judges must use a public URL without logging in.

## Stack

Next.js App Router, TypeScript, Tailwind, Gemini (`POST /api/icebreaker`).
