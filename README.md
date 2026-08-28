# HeyDev

HeyDev is Tinder for developer projects. You swipe on a collab brief — a project someone wants to ship — not on a dating profile. Right swipe means you’d build it with them. A match happens only when your **I bring** skills fill what they **need**. Gemini then writes the first message. Owner emails are stored as AES-256-GCM ciphertext; the server decrypts only to deliver a ping.

No login. Open the live URL and the deck works.

## Team

Ctrl Alt Trio

- Syamalatha Seera
- Puja
- Kavya

## Live URL

**GitHub Pages (opens on venue Wi‑Fi):**
https://syamalathaseera.github.io/ctrl-alt-trio-heydev/

Repo: https://github.com/SyamalathaSeera/ctrl-alt-trio-heydev

Vercel (`https://heydev-two.vercel.app`) is blocked on this network by Cisco Umbrella. Use GitHub Pages for judges. The swipe deck and match screen work there. Inbox/email APIs stay on this laptop’s Cloudflare tunnel if you need them during the table round.

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

1. Open **/inbox** and pick a project (**HeyDev Live**, **Pairboard DC**, or **Fest Queue**). Each list is separate.
2. Paste the three emails once on that page if you have not already.
3. Judge phone: swipe **HeyDev Live**, **Pairboard DC**, or **Fest Queue**.
4. **Accept and chat** on that project’s ping page. The judge chats from the match screen.

Judges never log in. They never see a raw email in the GitHub repo. The inbox is a public notification log on this server, which is how a swipe from *their* phone is visible on *your* laptop.

## Scope we cut

Real chat, GitHub OAuth, and mutual-swipe backend. Judges must use a public URL without logging in.

## Stack

Next.js App Router, TypeScript, Tailwind, Gemini (`POST /api/icebreaker`).
