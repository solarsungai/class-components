import { useState, useEffect } from 'react';
import { fetchPokemonByTerm } from '../services/pokemonApi';
import { SERVER_URL } from '../constants';
import type { PokemonData } from '../types';

function usePokemonDetail(name: string) {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await fetchPokemonByTerm(SERVER_URL, name);
        setPokemon(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [name]);

  return { pokemon, loading, error };
}

export default usePokemonDetail;
