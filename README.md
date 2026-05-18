# Year Progress

A web app that visualizes how much of the current year has elapsed — in real time, in UTC, with a calendar-grid breakdown of every day. It also runs as a Farcaster Mini App and an autonomous milestone-broadcasting bot.

Visit it: any browser opens the live progress page. Share a snapshot link and the recipient sees the exact percent you saw. Mint that moment as an on-chain collectible on Base. Inside Farcaster, the same page becomes an embeddable Mini App and a bot casts every 1% milestone with a fresh snapshot image.

## Features

- **Live year progress** — UTC-based, accurate to the millisecond, animated ring + calendar dot grid showing every day of the year.
- **Snapshot URLs** — every share encodes the moment of share as `?t=<unix-seconds>`. The OG/NFT image and Mini App embed render that exact instant rather than "now", so the cast/tweet/NFT all agree on the percent the sharer saw.
- **Onchain milestones** — mint the current moment as an ERC-721 on Base. Each NFT's `tokenURI` is generated server-side from its on-chain `mintedAt`, so the image is the year-progress snapshot at the minted moment.
- **Share to Farcaster or X** — one-tap cast (uses `composeCast` inside a Mini App, falls back to a Farcaster compose intent URL on the web) or tweet (intent URL).
- **Autonomous milestone bot** — an external cron pings the app; at each new integer percent the app casts from a bot account and pushes in-app notifications to subscribed Mini App users.
- **Farcaster Mini App** — webhook-verified add/remove/notification subscription lifecycle, frame manifest at `/.well-known/farcaster.json`.

## Routes

| Route | Type | What it does |
| --- | --- | --- |
| `/` | page | Main UI — ring, calendar, share + mint buttons. Accepts `?t=` to render historical snapshot embeds. |
| `/og` | edge image | 1200×800 OG image. Accepts `?t=`. |
| `/nft` | edge image | NFT artwork. Accepts `?t=`. |
| `/api/metadata` | route | ERC-721 `tokenURI` JSON. Accepts `?t=`. |
| `/api/can-send-notification` | route | **Cron entry point.** Computes current integer percent, compares to last sent via Redis, fans out to `/api/send-notifications` and `/api/cast` if it advanced. |
| `/api/send-notifications` | route | Key-gated. SCANs all subscribed users in Redis, batches 100 tokens per Farcaster notification call. |
| `/api/cast` | route | Key-gated. Signs and submits a cast from the bot account via the Snapchain hub. |
| `/api/webhook` | route | Farcaster Mini App webhook. Handles `miniapp_added`, `miniapp_removed`, `notifications_enabled`, `notifications_disabled`. |
| `/.well-known/farcaster.json` | route | Frame manifest + signed account association. |

## Architecture

### UTC progress as the single source of truth

`src/lib/time.ts` exports `getYearProgressFromTimestamp(ms)` returning `{ year, percent, daysPassed, daysTotal }`. It's the contract consumed by `/og`, `/nft`, `/api/cast`, `/api/can-send-notification`, and `YearProgress.tsx`. Same `t` → same percent everywhere; that's how the cast, the OG embed, and the NFT image all agree on a shared snapshot.

### Notification + cast pipeline

```
external cron
   ↓
GET /api/can-send-notification
   ├─ compute current integer percent
   ├─ read year-progress:last-int from Upstash Redis
   ├─ if percent advanced:
   │    ↓ POST /api/send-notifications?key=$KEY
   │    ↓ POST /api/cast?key=$KEY
   │    └─ persist new integer to Redis
   └─ else: { skipped: true }
```

All three POST endpoints are gated by `?key=` matching `process.env.KEY`. That's the only auth layer for internal endpoints.

### Onchain mint

`MintButton` calls `mint(uint256 mintedAt)` on the Base contract at `0x6731B815BD9F699B6E2f3Bc756ff602b49c4dE64` with `value: 0.00018 ETH`. The `mintedAt` argument is the same `t` value used by `/og` and `/nft`, so each token's metadata is a permanent snapshot of the year-progress at mint time. ABI: `src/contracts/abi.json`. Source: `src/contracts/contract.sol`.

## Tech stack

- **Next.js 16** App Router with React 19 (TypeScript strict)
- **Tailwind v4** via `@tailwindcss/postcss`
- **Wagmi v2** + Viem (Base mainnet) — loaded client-side only via `next/dynamic({ ssr: false })`
- **Upstash Redis** (HTTP) — user tokens + milestone watermark
- **Farcaster** — Mini App SDK, Mini App Node SDK (webhook verification via Neynar), `@farcaster/core` for ed25519 cast signing
- **`next/og`** `ImageResponse` (edge runtime) for OG + NFT images

## Development

### Install dependencies

```bash
npm install
```

### Configure environment

Copy the example file and fill it in:

```bash
cp .env.example .env
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_URL` | Public origin of the deployed app (used to build absolute share/OG/NFT URLs). |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Upstash Redis REST credentials. |
| `KEY` | Shared secret for the internal `/api/cast`, `/api/send-notifications` endpoints. |
| `NEYNAR_API_KEY` | Used by `parseWebhookEvent` to verify Farcaster app-key signatures on webhook payloads. |
| `PRIVATE_KEY` | Bot account ed25519 signer key (raw hex, **no `0x` prefix**). |
| `HUB_URL` | Snapchain hub URL used to submit casts (`POST {HUB_URL}/v1/submitMessage`). |

Notes:

- The bot's Farcaster `fid` is currently hardcoded in `src/app/api/cast/route.ts`.
- The frame manifest's `accountAssociation` is signed for a specific domain. If you change `NEXT_PUBLIC_URL`, you'll need to regenerate the signed payload in `src/app/.well-known/farcaster.json/route.ts`.

### Run locally

```bash
npm run dev
```

The app is available at http://localhost:3000.

### Other scripts

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # ESLint (eslint-config-next: core-web-vitals + typescript)
```

### Cron

In production, point any external scheduler at `GET ${NEXT_PUBLIC_URL}/api/can-send-notification` on a cadence frequent enough to catch every integer milestone (e.g. every 1–5 minutes). The endpoint is idempotent — it bails fast unless the integer percent has advanced since the last run.

## License

MIT
