import { useParams, useSearchParams, useNavigate } from 'react-router';
import { useGetPokemonByNameQuery } from '../services/pokemonApi';
import getErrorMessage from '../utils/getErrorMessage';
import createSearchQueryString from '../utils/navigation';
import { URL_PARAMS, DEFAULT_PAGE } from '../constants';
import PokemonInfoBlock from './PokemonInfoBlock';

function DetailPanel() {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();
  const [searchParams] = useSearchParams();
  const page = searchParams.get(URL_PARAMS.PAGE) || String(DEFAULT_PAGE);
  const {
    data: pokemon,
    isLoading: loading,
    error,
  } = useGetPokemonByNameQuery(name ?? '', { skip: !name });

  const handleClose = () => {
    const queryString = createSearchQueryString({
      page,
      search: searchParams.get(URL_PARAMS.SEARCH),
    });
    navigate(`/?${queryString}`);
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

          {pokemon.image && <img className="detail-image" src={pokemon.image} alt={pokemon.name} />}

          <PokemonInfoBlock
            types={pokemon.types}
            abilities={pokemon.abilities}
            height={pokemon.height}
            weight={pokemon.weight}
            baseExperience={pokemon.baseExperience}
          />
        </div>
      )}
    </div>
  );
}

export default DetailPanel;
