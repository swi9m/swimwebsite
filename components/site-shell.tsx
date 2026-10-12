'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 12); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  const links = [{ href: '/', label: 'Home' }, { href: '/leaderboard', label: 'Leaderboard' }, { href: '/rankings', label: 'Rankings' }];
  return <><header className={`topbar ${scrolled ? 'topbar-scrolled' : ''}`}><div className="nav-inner"><Link href="/" className="brand" aria-label="SwimTiers home"><span className="brand-mark"><span>◆</span></span><span className="brand-word">SwimTiers</span></Link><nav className="main-nav">{links.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href || (link.href === '/player' && pathname.startsWith('/player/')) ? 'nav-link active' : 'nav-link'}>{link.label}</Link>)}</nav><a className="discord-link" href="https://discord.com/" target="_blank" rel="noreferrer"><span className="discord-dot"/> Discord <span className="external-arrow">↗</span></a><button className="mobile-menu" onClick={() => document.querySelector('.main-nav')?.classList.toggle('nav-open')} aria-label="Toggle navigation">☰</button></div></header><main>{children}</main><footer className="footer"><div className="footer-inner"><Link href="/" className="footer-brand">✦ SWIMTIERS</Link><span>Minecraft PvP tier rankings.</span><span className="footer-status"><i/> Ranking system online</span></div></footer></>;
}
