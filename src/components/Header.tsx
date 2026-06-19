'use client'

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation';

function Header() {
  const pathname = usePathname();
  const isActive = pathname === '/about';

  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1>Pokédex Explorer</h1>
          <p className="header-subtitle">Search Pokémon and view key stats instantly.</p>
        </div>
        <div className="header-buttons">
          <ThemeToggle />
          <Link
            href="/about"
            className={isActive ? 'header-nav-link header-nav-link--active' : 'header-nav-link'}
          >
            About
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
