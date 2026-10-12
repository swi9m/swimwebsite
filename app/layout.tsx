import type { Metadata } from 'next';
import './globals.css';
import { SiteShell } from '@/components/site-shell';
export const metadata: Metadata = {
  title: 'SwimTiers — Shieldless SMP Rankings',
  description: 'The official Shieldless SMP tier rankings, leaderboard, and player profiles.',
  metadataBase: new URL('https://swimtiers.vercel.app'),
  openGraph: { title: 'SwimTiers — Shieldless SMP Rankings', description: 'One server. One ladder. Your legacy.', type: 'website' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteShell>{children}</SiteShell></body></html>;
}
