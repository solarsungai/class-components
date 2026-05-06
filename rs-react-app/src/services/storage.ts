const SEARCH_TERM_KEY = 'searchTerm';

export const loadSearchTerm = () => {
  return localStorage.getItem(SEARCH_TERM_KEY);
};

export const saveSearchTerm = (term: string) => {
  localStorage.setItem(SEARCH_TERM_KEY, term);
};