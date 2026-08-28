# HeyDev

HeyDev is Tinder for developer projects. You swipe on a collab brief — a project someone wants to ship — not on a dating profile. Right swipe means you’d build it with them. A match happens only when your **I bring** skills fill what they **need**. Gemini then writes the first message. Owner emails are stored as AES-256-GCM ciphertext; the server decrypts only to deliver a ping.

No login. Open the live URL and the deck works.

## Team

Ctrl Alt Trio

- Syamalatha Seera
- Puja
- Kavya

## Live URL

Public app (reachable while this machine is running the production server):
https://del-gained-arguments-steady.trycloudflare.com

Repo: https://github.com/SyamalathaSeera/ctrl-alt-trio-heydev

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
| `EMAIL_SECRET` | same | AES-256-GCM key for owner emails. If unset, a local demo key is used so the table-round inbox still decrypts. Rotate this for anything real. |

Do not put the key in source, README, or client code.

## What judges should try (no account)

1. Open **/inbox** and pick **I am Syamalatha / Puja / Kavya**. Pings are **not** shared — Puja only sees swipes on **Pairboard DC**.
2. Paste the three emails once on that chooser page if you have not already.
3. Judge phone: swipe **HeyDev Live** (Syamalatha), **Pairboard DC** (Puja), or **Fest Queue** (Kavya).
4. That person **Accept and chat** on their own ping page. The judge chats from the match screen.

Judges never log in. They never see a raw email in the GitHub repo. The inbox is a public notification log on this server, which is how a swipe from *their* phone is visible on *your* laptop.

## Scope we cut

Real chat, GitHub OAuth, and mutual-swipe backend. Judges must use a public URL without logging in.

## Stack

Next.js App Router, TypeScript, Tailwind, Gemini (`POST /api/icebreaker`).
