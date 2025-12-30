# Year Progress

A Farcaster Miniapp that visualizes the progress of the current year in real time using UTC-based calculations.  
It includes a client-side UI, an Open Graph image(for miniapp embed), and a cron-driven notification system that posts on farcaster from a bot account and sends in-app notification at every integer percentage milestone.

## Features

- Accurate year progress calculation using UTC time
- Users can share the mini app with the current progress
- Users can mint milestone moments as collectibles

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Wagmi (contract interactions)
- Viem (Ethereum utilities and ABI encoding)
- Base Network (onchain minting)
- ERC-721 smart contract
- Redis
- Farcaster Mini App SDK

## UTC-Based Progress Logic

All calculations are based on UTC to ensure consistency across time zones.

Progress is computed as:

- Elapsed milliseconds since UTC Jan 1
- Divided by total milliseconds in the year
- Converted into a percentage

This logic is shared between:

- Client UI
- Open Graph image / nft image
- Cron notification route

## Development

### Environment Variables

Create a .env file from the sample:

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values.

### Install dependencies

```bash
yarn install
```

### Run locally

```bash
yarn dev
```

The app will be available at http://localhost:3000

## License

MIT
