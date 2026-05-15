import { useState, useRef, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { performPokemonSearch } from '../services/search';
import type { PokemonData } from '../types';

function usePokemonSearch(serverUrl: string) {
  const lastSearchTerm = useRef<string | null>(null);
  const [results, setResults] = useState<PokemonData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setSearchTerm } = useLocalStorage();

  const search = useCallback(
    async (searchTerm: string) => {
      const term = searchTerm.trim().toLowerCase();
      if (term === lastSearchTerm.current) return;
      lastSearchTerm.current = term;
      setSearchTerm(term);
      setLoading(true);

      try {
        const results = await performPokemonSearch(term, serverUrl);
        setLoading(false);
        setResults(results);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        setLoading(false);
        setError(message);
        setResults([]);
      }
    },
    [serverUrl, setSearchTerm]
  );

  return { results, loading, error, search };
}

export default usePokemonSearch;
