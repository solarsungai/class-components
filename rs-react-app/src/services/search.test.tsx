import { describe, it, expect, vi, beforeEach } from 'vitest';
import { performPokemonSearch } from './search';
import { fetchFirstPokemonPage, fetchPokemonByTerm } from './api';
import type { PokemonData } from '../types';

vi.mock('./api', () => ({
  fetchFirstPokemonPage: vi.fn(),
  fetchPokemonByTerm: vi.fn(),
}));

describe('performPokemonSearch', () => {
  const mocks = {
    saveSearchTerm: vi.fn<(term: string) => void>(),
    onStart: vi.fn<(term: string) => void>(),
    onSuccess: vi.fn<(results: PokemonData[]) => void>(),
    onError: vi.fn<(message: string) => void>(),
  };

  const serverUrl = 'https://pokeapi.co/api/v2';

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.saveSearchTerm.mockClear();
    mocks.onStart.mockClear();
    mocks.onSuccess.mockClear();
    mocks.onError.mockClear();
  });

  it('should exit early if the search term is the same as the last search term', async () => {
    await performPokemonSearch({
      searchTerm: ' Pikachu ',
      lastSearchTerm: 'pikachu',
      serverUrl,
      ...mocks,
    });

    expect(mocks.saveSearchTerm).not.toHaveBeenCalled();
    expect(mocks.onStart).not.toHaveBeenCalled();
    expect(vi.mocked(fetchPokemonByTerm)).not.toHaveBeenCalled();
  });

  it('should fetch the first page of results when the search term is empty', async () => {
    const mockInitialData: PokemonData[] = [
      { 
        name: 'bulbasaur', 
        image: 'img_url', 
        types: ['grass', 'poison'] 
      }
    ];
    
    vi.mocked(fetchFirstPokemonPage).mockResolvedValue(mockInitialData);

    await performPokemonSearch({
      searchTerm: '   ',
      lastSearchTerm: 'some-previous-search',
      serverUrl,
      ...mocks,
    });

    expect(mocks.saveSearchTerm).toHaveBeenCalledWith('');
    expect(mocks.onStart).toHaveBeenCalledWith('');
    expect(vi.mocked(fetchFirstPokemonPage)).toHaveBeenCalledWith(serverUrl);
    expect(mocks.onSuccess).toHaveBeenCalledWith(mockInitialData);
  });

  it('should normalize the search term and fetch specific pokemon data', async () => {
    const mockPokemon: PokemonData = { 
      name: 'pikachu', 
      image: 'pikachu_img', 
      types: ['electric'],
      height: 4,
      weight: 60
    };

    vi.mocked(fetchPokemonByTerm).mockResolvedValue(mockPokemon);

    await performPokemonSearch({
      searchTerm: '  Pikachu  ',
      lastSearchTerm: null,
      serverUrl,
      ...mocks,
    });

    expect(mocks.saveSearchTerm).toHaveBeenCalledWith('pikachu');
    expect(mocks.onStart).toHaveBeenCalledWith('pikachu');
    expect(vi.mocked(fetchPokemonByTerm)).toHaveBeenCalledWith(serverUrl, 'pikachu');
    expect(mocks.onSuccess).toHaveBeenCalledWith([mockPokemon]);
  });

  it('should call onError when the API request fails', async () => {
    const apiErrorMessage = '404 Not Found';
    
    vi.mocked(fetchPokemonByTerm).mockRejectedValue(new Error(apiErrorMessage));

    await performPokemonSearch({
      searchTerm: 'non-existent-pokemon',
      lastSearchTerm: null,
      serverUrl,
      ...mocks,
    });

    expect(mocks.onError).toHaveBeenCalledWith(apiErrorMessage);
    expect(mocks.onSuccess).not.toHaveBeenCalled();
  });

  it('should handle non-Error objects thrown during the API call', async () => {
    vi.mocked(fetchPokemonByTerm).mockRejectedValue('Critical failure string');

    await performPokemonSearch({
      searchTerm: 'mew',
      lastSearchTerm: null,
      serverUrl,
      ...mocks,
    });

    expect(mocks.onError).toHaveBeenCalledWith('Unknown error');
  });
});