import { useCallback } from 'react';
import { SEARCH_TERM_KEY } from '../constants';

function useSearchTermLocalStorage() {
  const getSearchTerm = useCallback((): string | null => {
    return localStorage.getItem(SEARCH_TERM_KEY);
  }, []);

  const setSearchTerm = useCallback((term: string): void => {
    localStorage.setItem(SEARCH_TERM_KEY, term);
  }, []);

  return { getSearchTerm, setSearchTerm };
}

export default useSearchTermLocalStorage;
