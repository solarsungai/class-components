import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  PokemonApiResponse,
  PokemonData,
  PokemonListResponse,
} from '../types';
import { SERVER_URL, POCKEMON_PER_PAGE_LIMIT } from '../constants';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
  keepUnusedDataFor: Number(import.meta.env.VITE_CACHE_TTL) || 60,
  tagTypes: ['PokemonList', 'PokemonDetail'],
  endpoints: (builder) => ({
    
    getPokemonPage: builder.query<{ results: PokemonData[]; count: number }, number>({
        providesTags: ['PokemonList'],

        query: (page) => {
            const offset = (page - 1) * POCKEMON_PER_PAGE_LIMIT;
            return `?limit=${POCKEMON_PER_PAGE_LIMIT}&offset=${offset}`;
        },
        
        transformResponse: (response: PokemonListResponse) => {
            const results = response.results.map((item) => ({
            name: item.name,
            }));
            
            return { results, count: response.count };
        },
    }),

    getPokemonByName: builder.query<PokemonData, string>({
        providesTags: (_result, _error, name) => [{ type: 'PokemonDetail', id: name }],

        query: (term) => `${term}`,
        
        transformResponse: (response: PokemonApiResponse) => {
            const types = Array.isArray(response.types)
                ? response.types.map((typeInfo) => typeInfo.type.name)
                : [];
            const abilities = Array.isArray(response.abilities)
                ? response.abilities.map((abilityInfo) => abilityInfo.ability.name)
                : [];

            const pokemonData: PokemonData = {
                name: response.name,
                image: response.sprites?.front_default ?? undefined,
                types,
                height: response.height,
                weight: response.weight,
                baseExperience: response.base_experience,
                abilities,
            };

            return pokemonData;
        },
    }),
  }),
});

export const { useGetPokemonPageQuery, useGetPokemonByNameQuery } = pokemonApi;