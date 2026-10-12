export function TierBadge({ tier, large = false }: { tier: string | null | undefined; large?: boolean }) {
  if (!tier) return <span className={`tier-badge tier-unranked ${large ? 'tier-large' : ''}`}>UNRANKED</span>;
  const safe = tier.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return <span className={`tier-badge tier-${safe.toLowerCase()} ${large ? 'tier-large' : ''}`}><i className="tier-bar"/>{safe}</span>;
}
