import { useState, useRef, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { performPokemonSearch } from '../services/search';
import type { PokemonData } from '../types';

function usePokemonSearch(serverUrl: string, page:number) {
  const lastSearchTerm = useRef<string | null>(null);
  const lastPage = useRef<number | null>(null);
  const [results, setResults] = useState<PokemonData[]>([]);
  const [count, setPageCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setSearchTerm } = useLocalStorage();

  const search = useCallback(
    async (searchTerm: string) => {
      const term = searchTerm.trim().toLowerCase();
      if (term === lastSearchTerm.current && page === lastPage.current) return;
      lastSearchTerm.current = term;
      lastPage.current = page;
      setSearchTerm(term);
      setLoading(true);

      try {
        const { results, count } = await performPokemonSearch(term, serverUrl, page);
        setLoading(false);
        setResults(results);
        setPageCount(count);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        setLoading(false);
        setError(message);
        setResults([]);
      }
    },
    [serverUrl, setSearchTerm, page]
  );

    const reset = useCallback(() => {
        lastSearchTerm.current = null;
        lastPage.current = null;
    }, []);

  return { results, count, loading, error, search, reset };
}

export default usePokemonSearch;
 