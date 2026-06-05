export const SERVER_URL = 'https://pokeapi.co/api/v2/pokemon/';
export const SEARCH_TERM_KEY = 'searchTerm';
export const THEME_KEY = 'app-theme';
export const POKEMON_PER_PAGE_LIMIT = 20;
export const DEFAULT_PAGE = 1;
export const ABOUT_POKEMON_IMG = {
  URL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  NAME: 'Pikachu',
};
export const NOT_FOUND_POKEMON_IMG = {
  URL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png',
  NAME: 'Psyduck confused',
};
export const RS_SCHOOL_COURSE_URL = 'https://rs.school/courses/reactjs';

export const Routes = {
  HOME: '/',
  DETAILS: 'details/:name',
  ABOUT: '/about',
  NOT_FOUND: '*',
} as const;

export const URL_PARAMS = {
  SEARCH: 'search',
  PAGE: 'page',
} as const;
