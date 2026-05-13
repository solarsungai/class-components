import { fetchFirstPokemonPage, fetchPokemonByTerm } from './api';
import type { PokemonData } from '../types';

export const performPokemonSearch = async (
  searchTerm: string,
  serverUrl: string
): Promise<PokemonData[]> => {
  if (!searchTerm) {
    return fetchFirstPokemonPage(serverUrl);
  }
  const pokemonData = await fetchPokemonByTerm(serverUrl, searchTerm);
  return [pokemonData];
};
