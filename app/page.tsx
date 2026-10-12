'use client';
import Link from 'next/link';
import { usePlayers } from '@/components/use-players';
import { PlayerTable } from '@/components/player-table';
import { TierBadge } from '@/components/tier-badge';
const tiers = ['HT1','LT1','HT2','LT2','HT3','LT3','HT4','LT4','HT5','LT5'];
export default function HomePage() {
  const { players, loading } = usePlayers();
  const top = players.slice(0, 3);
  return <>
    <section className="home-intro page-wrap">
      <div className="home-intro-copy">
        <div className="eyebrow"><span className="live-pulse"/> MINECRAFT PVP · OFFICIAL RANKINGS</div>
        <h1>Every player.<br/><span>One tierlist.</span></h1>
        <p>A Totem and Shieldless SMP rankings, all in one place.</p>
        <div className="hero-actions"><Link href="/leaderboard" className="btn btn-primary">View leaderboard <span>→</span></Link><Link href="/rankings" className="btn btn-ghost">Tier system <span>↗</span></Link></div>
        <div className="home-summary"><div><strong>{players.length.toLocaleString()}</strong><span>RANKED PLAYERS</span></div><i/><div><strong>10</strong><span>TIER DIVISIONS</span></div><i/><div><strong>1</strong><span>GAME MODE</span></div></div>
      </div>
      <div className="home-top-card"><div className="home-card-heading"><span>TOP PLAYERS</span><Link href="/leaderboard">FULL LEADERBOARD ↗</Link></div>{top.length ? top.map((p,i)=><Link href={`/player/${encodeURIComponent(p.minecraftUsername)}`} className="home-top-row" key={p.discordId}><span className={`home-top-place place-${i+1}`}>{String(i+1).padStart(2,'0')}</span><img src={`https://mc-heads.net/avatar/${encodeURIComponent(p.minecraftUsername)}/64`} alt=""/><span className="home-top-name"><strong>{p.minecraftUsername}</strong><small>{i===0?'Top ranked player':'Shieldless SMP'}</small></span><TierBadge tier={p.tier}/></Link>) : <div className="home-top-empty">Rankings will appear here once players are added.</div>}<div className="home-card-foot"><span className="live-pulse"/> LIVE RANKINGS <span>SYNCED FROM DISCORD</span></div></div>
    </section>
    <section className="section home-leaderboard"><div className="section-heading"><div><div className="eyebrow muted-eyebrow">CURRENT STANDINGS</div><h2>Leaderboard<span className="heading-period">.</span></h2><p>See where every ranked player stands.</p></div><Link className="text-link" href="/leaderboard">View all players <span>→</span></Link></div>{loading ? <div className="loading-line"><span/> Loading player data…</div> : <PlayerTable players={players.slice(0,8)} compact/>}</section>
    <section className="section home-tier-section"><div className="section-heading"><div><div className="eyebrow muted-eyebrow">RANKING SYSTEM</div><h2>Every mode, <span>one ladder.</span></h2><p>Browse the top players and tier placements for each game mode.</p></div><Link className="text-link" href="/rankings">Explore tiers <span>→</span></Link></div><div className="home-tier-grid">{tiers.map((tier,i)=><Link href="/rankings" className="home-tier-item" key={tier}><span className="home-tier-number">{String(i+1).padStart(2,'0')}</span><TierBadge tier={tier}/><span className="home-tier-label">{tier.startsWith('H')?'HIGH TIER':'LOW TIER'}</span></Link>)}</div></section>
  </>;
}
