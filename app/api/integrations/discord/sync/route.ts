import { NextRequest, NextResponse } from 'next/server';
import { isValidSecret, saveSnapshot, type Snapshot } from '@/lib/data';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  if (!isValidSecret(request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let payload: Snapshot;
  try { payload = await request.json() as Snapshot; }
  catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }); }
  if (payload?.schemaVersion !== 1 || !Array.isArray(payload.users) || payload.users.length > 10000) {
    return NextResponse.json({ error: 'Invalid snapshot schema' }, { status: 400 });
  }
  const valid = payload.users.every((user) => user && typeof user.discordId === 'string' && typeof user.minecraftUsername === 'string' && (user.tier == null || typeof user.tier === 'string'));
  if (!valid) return NextResponse.json({ error: 'Invalid player record' }, { status: 400 });
  try {
    await saveSnapshot(payload);
    return NextResponse.json({ ok: true, received: payload.users.length, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Discord sync failed:', error);
    return NextResponse.json({ error: 'Could not save player data. Check persistent storage configuration.' }, { status: 503 });
  }
}
