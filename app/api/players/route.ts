import { NextResponse } from 'next/server';
import { getSnapshot, publicPlayers } from '@/lib/data';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const snapshot = await getSnapshot();
    const players = publicPlayers(snapshot);
    return NextResponse.json({ players, updatedAt: snapshot.generatedAt, total: players.length }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch {
    return NextResponse.json({ players: [], updatedAt: null, total: 0, error: 'Player data is temporarily unavailable.' }, { status: 503 });
  }
}
