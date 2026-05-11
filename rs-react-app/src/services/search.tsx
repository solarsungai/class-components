import { fetchFirstPokemonPage, fetchPokemonByTerm } from './api';
import type { PokemonData } from '../types';

type PerformPokemonSearchArgs = {
  searchTerm: string;
  lastSearchTerm: string | null;
  serverUrl: string;
  saveSearchTerm: (term: string) => void;
  onStart: (term: string) => void;
  onSuccess: (results: PokemonData[]) => void;
  onError: (message: string) => void;
};

export const performPokemonSearch = async ({
  searchTerm,
  lastSearchTerm,
  serverUrl,
  saveSearchTerm,
  onStart,
  onSuccess,
  onError,
}: PerformPokemonSearchArgs) => {
  const term = searchTerm.trim().toLowerCase();

  if (term === lastSearchTerm) return;

  saveSearchTerm(term);
  onStart(term);

  try {
    if (!term) {
      const results = await fetchFirstPokemonPage(serverUrl);
      onSuccess(results);
      return;
    }

    const pokemonData = await fetchPokemonByTerm(serverUrl, term);
    onSuccess([pokemonData]);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    onError(message);
  }
};
