import { describe, it, expect, vi, beforeEach } from 'vitest';
import { performPokemonSearch } from './search';
import { fetchPokemonByPage, fetchPokemonByTerm } from './pokemonApi';
import type { PokemonData } from '../types';

vi.mock('./api', () => ({
  fetchPokemonByPage: vi.fn(),
  fetchPokemonByTerm: vi.fn(),
}));

describe('performPokemonSearch', () => {
  const serverUrl = 'https://pokeapi.co/api/v2';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch the first page of results when the search term is empty', async () => {
    const mockInitialData: PokemonData[] = [
      {
        name: 'bulbasaur',
        image: 'img_url',
        types: ['grass', 'poison'],
      },
    ];

    vi.mocked(fetchPokemonByPage).mockResolvedValue({
      results: mockInitialData,
      count: 1,
    });

    const results = await performPokemonSearch('', serverUrl, 1);

    expect(vi.mocked(fetchPokemonByPage)).toHaveBeenCalledWith(serverUrl, 1);
    expect(results).toEqual({ results: mockInitialData, count: 1 });
  });

  it('should fetch specific pokemon data and return it wrapped in an array', async () => {
    const mockPokemon: PokemonData = {
      name: 'pikachu',
      image: 'pikachu_img',
      types: ['electric'],
      height: 4,
      weight: 60,
    };

    vi.mocked(fetchPokemonByTerm).mockResolvedValue(mockPokemon);

    const results = await performPokemonSearch('pikachu', serverUrl, 1);

    expect(vi.mocked(fetchPokemonByTerm)).toHaveBeenCalledWith(
      serverUrl,
      'pikachu'
    );
    expect(results).toEqual({ results: [mockPokemon], count: 1 });
  });

  it('should throw when the API request fails', async () => {
    const apiErrorMessage = '404 Not Found';

    vi.mocked(fetchPokemonByTerm).mockRejectedValue(new Error(apiErrorMessage));

    await expect(
      performPokemonSearch('non-existent-pokemon', serverUrl, 1)
    ).rejects.toThrow(apiErrorMessage);
  });

  it('should throw when the API rejects with a non-Error value', async () => {
    vi.mocked(fetchPokemonByTerm).mockRejectedValue('Critical failure string');

    await expect(performPokemonSearch('mew', serverUrl, 1)).rejects.toBe(
      'Critical failure string'
    );
  });
});
