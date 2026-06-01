import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { pokemonApi } from './pokemonApi';
import type { PokemonListResponse, PokemonApiResponse } from '../types';

function buildStore() {
  const store = configureStore({
    reducer: { [pokemonApi.reducerPath]: pokemonApi.reducer },
    middleware: (getDefault) => getDefault().concat(pokemonApi.middleware),
  });
  setupListeners(store.dispatch);
  return store;
}

type AppStore = ReturnType<typeof buildStore>;

function mockFetch(body: PokemonListResponse | PokemonApiResponse) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

const listResponse: PokemonListResponse = {
  count: 1302,
  results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }],
};

const detailResponse: PokemonApiResponse = {
  name: 'bulbasaur',
  base_experience: 64,
  height: 7,
  weight: 69,
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  abilities: [{ ability: { name: 'overgrow' } }],
};

describe('getPokemonByPage', () => {
  let store: AppStore;
  let spy: ReturnType<typeof mockFetch>;

  beforeEach(() => {
    store = buildStore();
    spy = mockFetch(listResponse);
  });

  afterEach(() => {
    spy.mockRestore();
    store.dispatch(pokemonApi.util.resetApiState());
  });

  it('transforms response to results and count', async () => {
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonByPage.initiate(1)
    );
    expect(result.data).toEqual({
      count: 1302,
      results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }],
    });
  });

  it('computes correct offset for page 2', async () => {
    await store.dispatch(pokemonApi.endpoints.getPokemonByPage.initiate(2));
    const req = spy.mock.calls[0][0];
    const url = req instanceof Request ? req.url : new URL(String(req)).href;
    expect(url).toContain('offset=20');
  });
});

describe('getPokemonByName', () => {
  let store: AppStore;
  let spy: ReturnType<typeof mockFetch>;

  beforeEach(() => {
    store = buildStore();
    spy = mockFetch(detailResponse);
  });

  afterEach(() => {
    spy.mockRestore();
    store.dispatch(pokemonApi.util.resetApiState());
  });

  it('transforms full detail response', async () => {
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonByName.initiate('bulbasaur')
    );
    expect(result.data).toEqual({
      name: 'bulbasaur',
      image: 'https://example.com/bulbasaur.png',
      types: ['grass', 'poison'],
      abilities: ['overgrow'],
      height: 7,
      weight: 69,
      baseExperience: 64,
    });
  });

  it('sets image to undefined when front_default is null', async () => {
    spy.mockResolvedValue(
      new Response(
        JSON.stringify({ ...detailResponse, sprites: { front_default: null } }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonByName.initiate('bulbasaur')
    );
    expect(result.data?.image).toBeUndefined();
  });

  it('sets types and abilities to empty arrays when undefined', async () => {
    spy.mockResolvedValue(
      new Response(
        JSON.stringify({ ...detailResponse, types: [], abilities: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonByName.initiate('bulbasaur')
    );
    expect(result.data?.types).toEqual([]);
    expect(result.data?.abilities).toEqual([]);
  });

  it('handles missing types and abilities arrays safely', async () => {
    spy.mockResolvedValue(
      new Response(
        JSON.stringify({
          name: 'test',
          types: null,
          abilities: undefined,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonByName.initiate('test')
    );

    expect(result.data?.types).toEqual([]);
    expect(result.data?.abilities).toEqual([]);
  });
});
