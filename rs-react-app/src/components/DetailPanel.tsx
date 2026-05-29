import { useParams, useSearchParams, useNavigate } from 'react-router';
import { useGetPokemonByNameQuery } from '../services/pokemonApi';
import getErrorMessage from '../utils/getErrorMessage';

function DetailPanel() {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || '1';
  const { data: pokemon, isLoading: loading, error } = useGetPokemonByNameQuery(name ?? '', { skip: !name });

  const handleClose = () => {
    const params = new URLSearchParams({ page });
    const search = searchParams.get('search');
    if (search) params.set('search', search);
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="detail-panel">
      <button
        className="detail-close"
        type="button"
        aria-label="Close details"
        onClick={handleClose}
      >
        ✕
      </button>

      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error-message">{getErrorMessage(error)}</div>}

      {!loading && !error && pokemon && (
        <div className="detail-content">
          <h2 className="pokemon-name detail-title">{pokemon.name}</h2>

          {pokemon.image && (
            <img
              className="detail-image"
              src={pokemon.image}
              alt={pokemon.name}
            />
          )}

          <div className="pokemon-info">
            {pokemon.types && pokemon.types.length > 0 && (
              <div className="info-group">
                <h3>Types</h3>
                <div className="tags">
                  {pokemon.types.map((t: string) => (
                    <span key={t} className={`tag tag-${t}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {pokemon.abilities && pokemon.abilities.length > 0 && (
              <div className="info-group">
                <h3>Abilities</h3>
                <div className="tags">
                  {pokemon.abilities.map((a: string) => (
                    <span key={a} className="tag tag-ability">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="info-group">
              <h3>Stats</h3>
              <div className="detail-stats">
                {pokemon.height != null && (
                  <div className="stat-item">
                    <span className="stat-label">Height</span>
                    <span className="stat-value">{pokemon.height / 10} m</span>
                  </div>
                )}
                {pokemon.weight != null && (
                  <div className="stat-item">
                    <span className="stat-label">Weight</span>
                    <span className="stat-value">{pokemon.weight / 10} kg</span>
                  </div>
                )}
                {pokemon.baseExperience != null && (
                  <div className="stat-item">
                    <span className="stat-label">Base XP</span>
                    <span className="stat-value">{pokemon.baseExperience}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailPanel;
