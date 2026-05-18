import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { performPokemonSearch } from '../services/search';
import usePokemonSearch from './usePokemonSearch';

vi.mock('../services/search', () => ({
  performPokemonSearch: vi.fn(),
}));

vi.mock('./useLocalStorage', () => ({
  default: () => ({
    setSearchTerm: vi.fn(),
    getSearchTerm: vi.fn(),
  }),
}));

describe('usePokemonSearch', () => {
  const serverUrl = 'https://pokeapi.co/api/v2/pokemon/';
  const mockResult = {
    results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }],
    count: 40,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should fetch the first page of results when the search term is empty', async () => {
    vi.mocked(performPokemonSearch).mockResolvedValue(mockResult);
    const { result } = renderHook(() => usePokemonSearch(serverUrl, 1));

    await act(async () => {
      await result.current.search('');
    });

    expect(result.current.results).toEqual(mockResult.results);
    expect(result.current.count).toBe(40);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should show loading indicator while search is in progress', async () => {
    let resolvePromise!: (value: typeof mockResult) => void;
    const promise = new Promise<typeof mockResult>((res) => {
      resolvePromise = res;
    });
    vi.mocked(performPokemonSearch).mockReturnValue(promise);
    const { result } = renderHook(() => usePokemonSearch(serverUrl, 1));

    act(() => {
      result.current.search('bulbasaur');
    });

    expect(result.current.loading).toBe(true);

    resolvePromise({ results: [{ name: 'bulbasaur' }], count: 1 });
    await act(async () => {
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('should display error message when search fails', async () => {
    vi.mocked(performPokemonSearch).mockRejectedValue(
      new Error('Pokemon not found')
    );
    const { result } = renderHook(() => usePokemonSearch(serverUrl, 1));

    await act(async () => {
      await result.current.search('notapokemon');
    });

    expect(result.current.error).toBe('Pokemon not found');
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should set "Unknown error" when a non-Error value is thrown', async () => {
    vi.mocked(performPokemonSearch).mockRejectedValue('something went wrong');
    const { result } = renderHook(() => usePokemonSearch(serverUrl, 1));

    await act(async () => {
      await result.current.search('pikachu');
    });

    expect(result.current.error).toBe('Unknown error');
    expect(result.current.results).toEqual([]);
  });

  it('should not repeat search when the same term and page are submitted again', async () => {
    vi.mocked(performPokemonSearch).mockResolvedValue(mockResult);
    const { result } = renderHook(() => usePokemonSearch(serverUrl, 1));

    await act(async () => {
      await result.current.search('bulbasaur');
    });
    await act(async () => {
      await result.current.search('bulbasaur');
    });

    expect(performPokemonSearch).toHaveBeenCalledTimes(1);
  });

  it('should repeat search when page changes', async () => {
    vi.mocked(performPokemonSearch).mockResolvedValue(mockResult);
    const { result, rerender } = renderHook(
      ({ page }) => usePokemonSearch(serverUrl, page),
      { initialProps: { page: 1 } }
    );

    await act(async () => {
      await result.current.search('');
    });

    rerender({ page: 2 });

    await act(async () => {
      await result.current.search('');
    });

    expect(performPokemonSearch).toHaveBeenCalledTimes(2);
  });

  it('should allow repeated search after reset', async () => {
    vi.mocked(performPokemonSearch).mockResolvedValue(mockResult);
    const { result } = renderHook(() => usePokemonSearch(serverUrl, 1));

    await act(async () => {
      await result.current.search('pikachu');
    });

    act(() => {
      result.current.reset();
    });

    await act(async () => {
      await result.current.search('pikachu');
    });

    expect(performPokemonSearch).toHaveBeenCalledTimes(2);
  });
});
