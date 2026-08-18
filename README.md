# TKU Zen AI

A calm, local AI companion for a busy mind — built with [Next.js](https://nextjs.org) (App Router), React, TypeScript, and Tailwind CSS.

TKU Zen AI is a small chat app that responds to your messages with mindful, zen-style guidance and a breathing prompt. The "AI" is a fully local, deterministic response engine (see `src/lib/zen.ts`), so the app runs end-to-end **without any API keys or network calls**.

## Getting started

```bash
npm ci          # install dependencies (uses package-lock.json)
npm run dev     # start the dev server at http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) and start a conversation.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Run the production server |
| `npm run lint` | Lint with ESLint (`eslint-config-next`) |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm test` | Run unit tests with Vitest |

## Project layout

```
src/
  app/
    layout.tsx        # Root layout + metadata
    page.tsx          # Chat UI (client component)
    globals.css       # Tailwind + theme tokens
    api/chat/route.ts # POST /api/chat -> zen reply, GET -> health check
  lib/
    zen.ts            # Local deterministic zen response engine
    zen.test.ts       # Unit tests for the response engine
```

## API

`POST /api/chat`

```bash
curl -s http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"I feel stressed about my exams"}'
```

Returns:

```json
{ "reply": { "intent": "stress", "message": "…", "breath": "…" } }
```

`GET /api/chat` returns a health check: `{ "status": "ok", "service": "tku-zen-ai" }`.

## Cloud Agent environment

This repo ships a [`.cursor/environment.json`](.cursor/environment.json) so Cursor Cloud Agents boot ready to work: `npm ci` installs dependencies and a `dev` terminal runs `npm run dev`.
