import { NavLink } from 'react-router';
import ThemeToggle from './ThemeToggle';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1>Pokédex Explorer</h1>
          <p className="header-subtitle">
            Search Pokémon and view key stats instantly.
          </p>
        </div>
        <div className="header-buttons">
          <ThemeToggle />
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? 'header-nav-link header-nav-link--active'
                : 'header-nav-link'
            }
          >
            About
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
