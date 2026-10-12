import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { timingSafeEqual } from 'node:crypto';

export type TierPlayer = {
  discordId: string;
  minecraftUsername: string;
  tier: string | null;
  tierRoleId?: string | null;
  tierAssignedAt?: number | string | null;
};
export type Snapshot = {
  schemaVersion: 1;
  source: string;
  generatedAt: string;
  users: TierPlayer[];
};
const KEY = 'swimtiers:data:v1';
const emptySnapshot: Snapshot = { schemaVersion: 1, source: 'swimtiers', generatedAt: new Date(0).toISOString(), users: [] };

export function isValidSecret(received: string | null): boolean {
  const expected = process.env.SWIMTIERS_API_SECRET;
  if (!expected || !received) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function redisCommand(command: unknown[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return undefined;
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Redis request failed (${response.status})`);
  const result = await response.json() as { result?: unknown; error?: string };
  if (result.error) throw new Error(result.error);
  return result.result;
}

async function readLocal(): Promise<Snapshot> {
  if (process.env.NODE_ENV === 'production') return emptySnapshot;
  try {
    return JSON.parse(await readFile(path.join(process.cwd(), 'data', 'dev-data.json'), 'utf8')) as Snapshot;
  } catch { return emptySnapshot; }
}

export async function getSnapshot(): Promise<Snapshot> {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const value = await redisCommand(['GET', KEY]);
    if (typeof value === 'string') {
      try { return JSON.parse(value) as Snapshot; } catch { return emptySnapshot; }
    }
    return emptySnapshot;
  }
  return readLocal();
}

export async function saveSnapshot(input: Snapshot): Promise<void> {
  const normalized: Snapshot = {
    schemaVersion: 1,
    source: 'swimtiers-discord-bot',
    generatedAt: input.generatedAt || new Date().toISOString(),
    users: input.users.map((user) => ({
      discordId: String(user.discordId),
      minecraftUsername: String(user.minecraftUsername).trim(),
      tier: normalizeTier(user.tier),
      tierRoleId: user.tierRoleId ? String(user.tierRoleId) : null,
      tierAssignedAt: user.tierAssignedAt ?? null,
    })).filter((user) => /^[A-Za-z0-9_]{3,16}$/.test(user.minecraftUsername)),
  };
  const redisReady = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisReady) {
    await redisCommand(['SET', KEY, JSON.stringify(normalized)]);
    return;
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Persistent storage is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
  const directory = path.join(process.cwd(), 'data');
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'dev-data.json'), JSON.stringify(normalized, null, 2), 'utf8');
}

export function normalizeTier(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toUpperCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
  const match = normalized.match(/^(H|L)T\s*([1-5])$/) || normalized.match(/^(HIGH|LOW)\s+TIER\s*([1-5])$/);
  if (!match) return null;
  const prefix = match[1] === 'H' || match[1] === 'HIGH' ? 'HT' : 'LT';
  return `${prefix}${match[2]}`;
}
export function tierScore(value: string | null): number {
  if (!value) return 999;
  const match = value.match(/^(H|L)T([1-5])$/);
  if (!match) return 999;
  return (Number(match[2]) - 1) * 2 + (match[1] === 'H' ? 0 : 1);
}
export function publicPlayers(snapshot: Snapshot) {
  return snapshot.users
    .filter((user) => user.tier)
    .sort((a, b) => tierScore(a.tier) - tierScore(b.tier) || a.minecraftUsername.localeCompare(b.minecraftUsername))
    .map((user, index) => ({ ...user, rank: index + 1 }));
}
