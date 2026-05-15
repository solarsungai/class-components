import { Link } from 'react-router';

function NotFound() {
  return (
    <div className="page-wrapper">
      <div className="page-card not-found">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png"
          alt="Psyduck confused"
          className="not-found-pokemon"
        />
        <h1 className="not-found-code">404</h1>
        <p className="page-subtitle">Looks like this page ran away...</p>
        <p className="page-subtitle" style={{ marginTop: 0 }}>
          Even Psyduck can&apos;t find it.
        </p>
        <Link to="/" className="btn-primary">
          Back to Pokédex
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
