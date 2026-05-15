import { useCallback } from 'react';

function useLocalStorage() {
  const SEARCH_TERM_KEY = 'searchTerm';

  const getSearchTerm = useCallback((): string | null => {
    return localStorage.getItem(SEARCH_TERM_KEY);
  }, []);

  const setSearchTerm = useCallback((term: string): void => {
    localStorage.setItem(SEARCH_TERM_KEY, term);
  }, []);

  return { getSearchTerm, setSearchTerm };
}

export default useLocalStorage;
