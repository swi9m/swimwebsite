'use client';
import Link from 'next/link';
import { TierBadge } from './tier-badge';
export type Player = { discordId: string; minecraftUsername: string; tier: string | null; tierRoleId?: string | null; tierAssignedAt?: number | string | null; rank: number };
export function HeadAvatar({ username, size = 40 }: { username: string; size?: number }) {
  return <img className="player-head" width={size} height={size} src={`https://mc-heads.net/avatar/${encodeURIComponent(username)}/${size}`} alt={`${username}'s Minecraft skin`} loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/default-head.svg'; }} />;
}
export function PlayerTable({ players, compact = false }: { players: Player[]; compact?: boolean }) {
  if (!players.length) return <div className="empty-state"><span className="empty-icon">✦</span><h3>No ranked players yet</h3><p>When a tester assigns a tier in Discord, verified players will appear here automatically.</p></div>;
  return <div className="table-wrap"><table className="players-table"><thead><tr><th className="rank-col">#</th><th>Player</th><th>Tier</th><th className="mode-col">Mode</th>{!compact && <th className="date-col">Last updated</th>}<th/></tr></thead><tbody>{players.map((player) => <tr key={player.discordId}><td className={`rank-number ${player.rank <= 3 ? `rank-top rank-${player.rank}` : ''}`}>{String(player.rank).padStart(2, '0')}</td><td><Link href={`/player/${encodeURIComponent(player.minecraftUsername)}`} className="player-cell"><HeadAvatar username={player.minecraftUsername}/><span><strong>{player.minecraftUsername}</strong><small>{player.rank === 1 ? 'Top ranked player' : 'Shieldless SMP'}</small></span></Link></td><td><TierBadge tier={player.tier}/></td><td className="mode-col"><span className="mode-pill"><span>◈</span> SMP</span></td>{!compact && <td className="date-col">{player.tierAssignedAt ? new Date(player.tierAssignedAt).toLocaleDateString() : '—'}</td>}<td><Link href={`/player/${encodeURIComponent(player.minecraftUsername)}`} className="row-arrow" aria-label={`View ${player.minecraftUsername}`}>↗</Link></td></tr>)}</tbody></table></div>;
}
