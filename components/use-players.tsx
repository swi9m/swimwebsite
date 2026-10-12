'use client';
import { useEffect, useState } from 'react';
import type { Player } from './player-table';
export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  useEffect(() => { let alive = true; const load = async () => { try { const res = await fetch('/api/players', { cache: 'no-store' }); const data = await res.json(); if (alive) { setPlayers(data.players || []); setUpdatedAt(data.updatedAt || null); } } catch { if (alive) setPlayers([]); } finally { if (alive) setLoading(false); } }; load(); const timer = window.setInterval(load, 30000); return () => { alive = false; window.clearInterval(timer); }; }, []);
  return { players, loading, updatedAt };
}
