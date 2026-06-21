import { useCallback } from 'react';
import { SEARCH_TERM_KEY } from '../constants';

function useSearchTermLocalStorage() {
  const getSearchTerm = useCallback((): string | null => {
    return typeof window !== 'undefined' ? localStorage.getItem(SEARCH_TERM_KEY) : null;
  }, []);

  const setSearchTerm = useCallback((term: string): void => {
    typeof window !== 'undefined' ? localStorage.setItem(SEARCH_TERM_KEY, term) : null;
  }, []);

  return { getSearchTerm, setSearchTerm };
}

export default useSearchTermLocalStorage;
