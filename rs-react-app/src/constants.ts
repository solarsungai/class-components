export const SERVER_URL = 'https://pokeapi.co/api/v2/pokemon/';
export const SEARCH_TERM_KEY = 'searchTerm';
export const THEME_KEY = 'app-theme';
export const POKEMON_PER_PAGE_LIMIT = 20;

export const Routes = {
  HOME: '/',
  DETAILS: 'details/:name',
  ABOUT: '/about',
  NOT_FOUND: '*',
} as const;

export const getDetailsPath = (name: string) => `/details/${name}`;