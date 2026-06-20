import Link from 'next/link';
import { NOT_FOUND_POKEMON_IMG } from '@/constants';

function NotFound() {
  return (
    <div className="page-wrapper">
      <div className="page-card not-found">
        <img
          src={NOT_FOUND_POKEMON_IMG.URL}
          alt={NOT_FOUND_POKEMON_IMG.NAME}
          className="not-found-pokemon"
        />
        <h1 className="not-found-code">404</h1>
        <p className="page-subtitle">Looks like this page ran away...</p>
        <p className="page-subtitle" style={{ marginTop: 0 }}>
          Even Psyduck can&apos;t find it.
        </p>
        <Link href="/" className="btn-primary">
          Back to Pokédex
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
