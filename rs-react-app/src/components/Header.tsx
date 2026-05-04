import { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <header className="header">
        <h1>Pokédex Explorer</h1>
        <p className="header-subtitle">
          Search Pokémon and view key stats instantly.
        </p>
      </header>
    );
  }
}

export default Header;
