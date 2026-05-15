import { NavLink } from 'react-router';

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
    </header>
  );
}

export default Header;
