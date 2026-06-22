'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGetPokemonByNameQuery } from '@/services/pokemonApi';
import getErrorMessage from '@/utils/getErrorMessage';
import { URL_PARAMS, DEFAULT_PAGE } from '@/constants';
import PokemonInfoBlock from '@/components/PokemonInfoBlock';

function DetailPanel() {
  const router = useRouter();
  const { name } = useParams<{ name: string }>();
  const searchParams = useSearchParams();
  const page = searchParams.get(URL_PARAMS.PAGE) || String(DEFAULT_PAGE);
  const {
    data: pokemon,
    isLoading: loading,
    error,
  } = useGetPokemonByNameQuery(name ?? '', { skip: !name });

  const handleClose = () => {
    router.back();
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

          {pokemon.image && <Image src={pokemon.image} alt={pokemon.name} className="detail-image" width={148} height={148}/>}

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