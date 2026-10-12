# SwimTiers Website

A responsive, animated tier-list website for **Shieldless SMP**. This project is designed to pair with the SwimTiers Discord bot and deliberately starts with an empty player database: no McTiers player records are copied or included.

## Pages

- `/` — animated home page, Shieldless SMP totem, featured leaderboard and tier ladder.
- `/leaderboard` — all ranked players ordered by tier, with quick filtering.
- `/player` — player search.
- `/player/USERNAME` — individual player profile.
- `/rankings` — tier selector and ranked players in each tier.

## Discord bot integration

The bot sends a complete snapshot to `POST /api/integrations/discord/sync`. The endpoint checks `Authorization: Bearer <SWIMTIERS_API_SECRET>`, validates the payload, and saves the verified usernames and tiers. The public frontend reads from `GET /api/players`. The UI refreshes the data every 30 seconds.

### Required production storage on Vercel

Vercel's serverless filesystem is not persistent. Use an Upstash Redis database with its REST API:

1. Create a Redis database in Upstash and copy its REST URL and REST token.
2. In Vercel project settings → Environment Variables, add:
   - `SWIMTIERS_API_SECRET` — a long random secret.
   - `UPSTASH_REDIS_REST_URL` — the Upstash REST URL.
   - `UPSTASH_REDIS_REST_TOKEN` — the Upstash REST token.
3. In the Discord bot host's environment, set `SWIMTIERS_API_URL=https://swimtiers.vercel.app` and set `SWIMTIERS_API_SECRET` to the exact same secret.
4. Redeploy the Vercel site and restart the bot.
5. Run `/tiers give` or `/tier give` for a verified player. The bot should respond that the website was synced; the player should then appear on the leaderboard and in their tier.

**Never** prefix `SWIMTIERS_API_SECRET` with `NEXT_PUBLIC_`; it must remain server-side only.

## Local development

Requires Node.js 20+.

```bash
cp .env.example .env.local
npm install
npm run dev
```

For local bot-to-website sync, fill in `SWIMTIERS_API_SECRET`. Without Upstash configured, development mode writes to `data/dev-data.json`. Do not rely on this local file for Vercel production.

## Tier ordering

The site uses explicit competitive order: `HT1`, `LT1`, `HT2`, `LT2`, `HT3`, `LT3`, `HT4`, `LT4`, `HT5`, `LT5`. The bot should use matching Discord role names for tiers. Only valid Minecraft usernames (3–16 letters, digits or underscores) are shown.

## Deploy to Vercel

Import this project into Vercel, set the environment variables above, and deploy with the default Next.js preset. Assign the project the domain `swimtiers.vercel.app` (if that domain is available to your Vercel account).
