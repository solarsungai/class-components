import { fetchPokemonByPage, fetchPokemonByTerm } from './pokemonApi';
import type { PokemonData } from '../types';

export const performPokemonSearch = async (
  searchTerm: string,
  serverUrl: string,
  page: number
): Promise<{ results: PokemonData[]; count: number }> => {
  if (!searchTerm) {
    return fetchPokemonByPage(serverUrl, page);
  }
  const pokemonData = await fetchPokemonByTerm(serverUrl, searchTerm);
  return { results: [pokemonData], count: 1 };
};
