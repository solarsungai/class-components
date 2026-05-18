import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchPokemonByPage, fetchPokemonByTerm } from './api';

describe('api service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should fetch first page successfully', async () => {
    const mockResponse = {
      count: 2,
      results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }],
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchPokemonByPage('http://api.com/');
    expect(result).toEqual({
      results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }],
      count: 2,
    });
  });

  it('should throw error when response for the first page is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    await expect(fetchPokemonByPage('http://api.com/')).rejects.toThrow(
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

    const result = await fetchPokemonByPage('http://api.com/');

    expect(result).toEqual({
      results: [{ name: undefined }, { name: undefined }],
      count: undefined,
    });
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
