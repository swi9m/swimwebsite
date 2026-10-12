'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePlayers } from '@/components/use-players';
import { HeadAvatar } from '@/components/player-table';
import { TierBadge } from '@/components/tier-badge';

const modes = ['A Totem', 'Shieldless SMP'] as const;
const columns = [
  { title: 'Tier 1', tiers: ['HT1', 'LT1'] },
  { title: 'Tier 2', tiers: ['HT2', 'LT2'] },
  { title: 'Tier 3', tiers: ['HT3', 'LT3'] },
  { title: 'Tier 4', tiers: ['HT4', 'LT4'] },
  { title: 'Tier 5', tiers: ['HT5', 'LT5'] },
];
export default function RankingsPage() {
  const { players, loading } = usePlayers();
  const [mode, setMode] = useState<(typeof modes)[number]>('A Totem');
  const ranked = useMemo(() => [...players].sort((a, b) => a.minecraftUsername.localeCompare(b.minecraftUsername)), [players]);
  return <div className="page-wrap rankings-page">
    <div className="rankings-topline"><div><div className="eyebrow">RANKINGS / PLAYER TIERS</div><h1>Rankings</h1><p>Browse every tier in the SwimTiers ladder.</p></div>
      <div className="rankings-mode-tabs" role="tablist" aria-label="Game mode">{modes.map(m => <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? 'rankings-mode active' : 'rankings-mode'} onClick={() => setMode(m)}>{m}</button>)}</div>
    </div>
    <div className="rankings-columns">{columns.map((column, colIndex) => {
      const tierPlayers = column.tiers.map(t => ranked.filter(p => p.tier === t));
      const total = tierPlayers.reduce((n, group) => n + group.length, 0);
      return <section className={`rank-column rank-column-${colIndex + 1}`} key={column.title}>
        <header className="rank-column-head"><h2>{column.title}</h2><span>{total}</span></header>
        {column.tiers.map((tier, tierIndex) => <div className={`rank-tier-group ${tierIndex === 0 ? 'high-tier-group' : 'low-tier-group'}`} key={tier}>
          <div className="rank-tier-label"><TierBadge tier={tier}/><span>{tier.startsWith('HT') ? 'High Tier' : 'Low Tier'}</span><small>{tierPlayers[tierIndex].length}</small></div>
          {loading ? <div className="rank-empty">Loading…</div> : tierPlayers[tierIndex].length ? <div className="rank-player-list">{tierPlayers[tierIndex].map((player, index) => <Link className="rank-player" href={`/player/${encodeURIComponent(player.minecraftUsername)}`} key={player.discordId}><span className="rank-player-place">{index + 1}</span><HeadAvatar username={player.minecraftUsername} size={25}/><span className="rank-player-name">{player.minecraftUsername}</span><span className="rank-player-arrow">⌃</span></Link>)}</div> : <div className="rank-empty">No players yet</div>}
        </div>)}
      </section>;
    })}</div>
    <p className="rankings-footnote">Showing the {mode} ladder. Player names appear here once their tier data is synced.</p>
  </div>;
}
