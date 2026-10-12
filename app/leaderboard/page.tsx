'use client';
import { useMemo, useState } from 'react';
import { usePlayers } from '@/components/use-players';
import { PlayerTable } from '@/components/player-table';
export default function LeaderboardPage() {
  const { players, loading, updatedAt } = usePlayers(); const [query, setQuery] = useState('');
  const filtered = useMemo(() => players.filter(p => p.minecraftUsername.toLowerCase().includes(query.toLowerCase())), [players, query]);
  return <div className="page-wrap"><div className="page-hero"><div className="eyebrow"><span className="live-pulse"/> SHIELDLESS SMP / STANDINGS</div><h1>The <span>leaderboard.</span></h1><p>Every ranked player. One ladder. See who's leading the server.</p><div className="page-hero-bottom"><div className="stat-chip"><strong>{players.length}</strong><span>RANKED PLAYERS</span></div><div className="stat-chip"><strong>10</strong><span>POSSIBLE TIERS</span></div><span className="live-label"><i/> AUTO-SYNCED FROM DISCORD</span></div></div><div className="content-panel"><div className="panel-toolbar"><div><h2>Overall rankings</h2><p>Sorted by highest tier earned</p></div><label className="search-field"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter players…" aria-label="Filter players"/><kbd>⌘ K</kbd></label></div>{loading ? <div className="loading-line"><span/> Loading leaderboard…</div> : <PlayerTable players={filtered}/>}<div className="panel-foot"><span>◈ SHIELDLESS SMP</span><span>{updatedAt ? `LAST SYNC ${new Date(updatedAt).toLocaleString()}` : 'WAITING FOR FIRST SYNC'}</span></div></div><div className="page-note"><span>✦</span><p>Rankings update automatically when a tester assigns or removes a tier in Discord.</p></div></div>;
}
