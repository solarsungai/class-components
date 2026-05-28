import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPokemonByTerm } from '../services/pokemonApi';
import usePokemonDetail from './usePokemonDetail';

vi.mock('../services/api', () => ({
  fetchPokemonByTerm: vi.fn(),
}));

const mockPokemon = {
  name: 'bulbasaur',
  image: 'https://images.com/bulbasaur.png',
  types: ['grass', 'poison'],
  height: 7,
  weight: 69,
  baseExperience: 64,
  abilities: ['overgrow', 'chlorophyll'],
};

describe('usePokemonDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return pokemon data after successful fetch', async () => {
    vi.mocked(fetchPokemonByTerm).mockResolvedValue(mockPokemon);

    const { result } = renderHook(() => usePokemonDetail('bulbasaur'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.pokemon).toEqual(mockPokemon);
    expect(result.current.error).toBeNull();
  });

  it('should set loading to true while fetching', async () => {
    let resolve!: (value: typeof mockPokemon) => void;
    const promise = new Promise<typeof mockPokemon>((res) => {
      resolve = res;
    });
    vi.mocked(fetchPokemonByTerm).mockReturnValue(promise);

    const { result } = renderHook(() => usePokemonDetail('bulbasaur'));

    expect(result.current.loading).toBe(true);

    resolve(mockPokemon);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should set error message when fetch fails', async () => {
    vi.mocked(fetchPokemonByTerm).mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => usePokemonDetail('unknown'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Not found');
    expect(result.current.pokemon).toBeNull();
  });

  it('should set "Unknown error" when a non-Error value is thrown', async () => {
    vi.mocked(fetchPokemonByTerm).mockRejectedValue('string error');

    const { result } = renderHook(() => usePokemonDetail('unknown'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Unknown error');
  });

  it('should refetch when name changes', async () => {
    vi.mocked(fetchPokemonByTerm).mockResolvedValue(mockPokemon);

    const { result, rerender } = renderHook(
      ({ name }: { name: string }) => usePokemonDetail(name),
      { initialProps: { name: 'bulbasaur' } }
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchPokemonByTerm).toHaveBeenCalledTimes(1);

    rerender({ name: 'ivysaur' });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchPokemonByTerm).toHaveBeenCalledTimes(2);
    expect(fetchPokemonByTerm).toHaveBeenLastCalledWith(
      expect.any(String),
      'ivysaur'
    );
  });
});
