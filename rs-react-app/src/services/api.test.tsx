import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchFirstPokemonPage, fetchPokemonByTerm } from './api';

describe('api service', () => {
  beforeEach(() => {
    window.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch first page successfully', async () => {
    const mockResponse = {
      results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }],
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchFirstPokemonPage('http://api.com/');
    expect(result).toEqual([{ name: 'bulbasaur' }, { name: 'ivysaur' }]);
  });

  it('should throw error when response for the first page is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    await expect(fetchFirstPokemonPage('http://api.com/')).rejects.toThrow(
      'Unable to load the first page of Pokemon list'
    );
  });

  it('should return undefined names when api returns unexpected data', async () => {
    const mockResponse = {
      results: [{ surname: 'bulbasaur' }, { surname: 'ivysaur' }],
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchFirstPokemonPage('http://api.com/');

    expect(result).toEqual([{ name: undefined }, { name: undefined }]);
  });

  it('should fetch pokemon data and transform it correctly', async () => {
    const mockResponse = {
      name: 'bulbasaur',
      sprites: { front_default: 'http://image.com/bulbasaur.png' },
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      height: 10,
      weight: 11,
      base_experience: 100,
      abilities: [{ ability: { name: 'overgrow' } }],
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchPokemonByTerm('http://api.com/', 'bulbasaur');
    expect(result).toEqual({
      name: 'bulbasaur',
      image: 'http://image.com/bulbasaur.png',
      types: ['grass', 'poison'],
      height: 10,
      weight: 11,
      baseExperience: 100,
      abilities: ['overgrow'],
    });
  });

  it('should throw error when pokemon is not found', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    await expect(
      fetchPokemonByTerm('http://api.com/', 'unknown')
    ).rejects.toThrow('Pokemon not found');
  });

  it('should return empty arrays when types and abilities are missing', async () => {
    const mockResponse = {
      name: 'bulbasaur',
      sprites: { front_default: null },
      types: null,
      abilities: null,
      height: 10,
      weight: 11,
      base_experience: 100,
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchPokemonByTerm('http://api.com/', 'bulbasaur');

    expect(result).toEqual({
      name: 'bulbasaur',
      image: undefined,
      types: [],
      abilities: [],
      height: 10,
      weight: 11,
      baseExperience: 100,
    });
  });
});
