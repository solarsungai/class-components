import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { performPokemonSearch } from '../services/search';
import type { PokemonData } from '../types';
import usePokemonSearch from './usePokemonSearch';

vi.mock('../services/search', () => ({
  performPokemonSearch: vi.fn(),
}));

describe('usePokemonSearch', () => {
  const serverUrl = 'https://pokeapi.co/api/v2/pokemon/';

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should fetch the first page of results when the search term is empty', async () => {
    vi.mocked(performPokemonSearch).mockResolvedValue([
      { name: 'bulbasaur' },
      { name: 'ivysaur' },
    ]);
    const { result } = renderHook(() => usePokemonSearch(serverUrl));
    await act(async () => {
      await result.current.search('');
    });
    expect(result.current.results).toEqual([
      { name: 'bulbasaur' },
      { name: 'ivysaur' },
    ]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should show loading indicator while search is in progress', async () => {
    let resolvePromise: (value: PokemonData[]) => void;
    const promise = new Promise<PokemonData[]>((res) => {
      resolvePromise = res;
    });
    vi.mocked(performPokemonSearch).mockReturnValue(promise);
    const { result } = renderHook(() => usePokemonSearch(serverUrl));
    act(() => {
      result.current.search('bulbasaur');
    });
    expect(result.current.loading).toBe(true);
    resolvePromise!([{ name: 'bulbasaur' }]);
    await act(async () => {
      await promise;
    });
    expect(result.current.loading).toBe(false);
  });

  it('should display error message when search fails', async () => {
    vi.mocked(performPokemonSearch).mockRejectedValue(
      new Error('Pokemon not found')
    );
    const { result } = renderHook(() => usePokemonSearch(serverUrl));
    await act(async () => {
      await result.current.search('notapokemon');
    });
    expect(result.current.error).toBe('Pokemon not found');
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should set "Unknown error" when a non-Error value is thrown', async () => {
    vi.mocked(performPokemonSearch).mockRejectedValue('something went wrong');
    const { result } = renderHook(() => usePokemonSearch(serverUrl));
    await act(async () => {
      await result.current.search('pikachu');
    });
    expect(result.current.error).toBe('Unknown error');
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should not repeat search when the same term is submitted again', async () => {
    vi.mocked(performPokemonSearch).mockResolvedValue([{ name: 'bulbasaur' }]);
    const { result } = renderHook(() => usePokemonSearch(serverUrl));
    await act(async () => {
      await result.current.search('bulbasaur');
    });
    await act(async () => {
      await result.current.search('bulbasaur');
    });
    expect(performPokemonSearch).toHaveBeenCalledTimes(1);
  });
});
