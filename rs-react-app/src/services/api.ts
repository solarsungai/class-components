import type {
  PokemonApiResponse,
  PokemonData,
  PokemonListResponse,
} from '../types';

const FIRST_PAGE_LIMIT = 20;
const FIRST_PAGE_OFFSET = 0;

export const fetchFirstPokemonPage = async (serverUrl: string) => {
  const response = await fetch(
    `${serverUrl}?limit=${FIRST_PAGE_LIMIT}&offset=${FIRST_PAGE_OFFSET}`
  );

  if (!response.ok) {
    throw new Error('Unable to load the first page of Pokemon list');
  }

  const listData: PokemonListResponse = await response.json();
  const results: PokemonData[] = listData.results.map((item) => {
    return {
      name: item.name,
    };
  });

  return results;
};

export const fetchPokemonByTerm = async (serverUrl: string, term: string) => {
  const response = await fetch(`${serverUrl}${term}`);

  if (!response.ok) {
    throw new Error('Pokemon not found');
  }

  const data: PokemonApiResponse = await response.json();
  const types = Array.isArray(data.types)
    ? data.types.map((typeInfo) => typeInfo.type.name)
    : [];
  const abilities = Array.isArray(data.abilities)
    ? data.abilities.map((abilityInfo) => abilityInfo.ability.name)
    : [];

  const pokemonData: PokemonData = {
    name: data.name,
    image: data.sprites?.front_default ?? undefined,
    types,
    height: data.height,
    weight: data.weight,
    baseExperience: data.base_experience,
    abilities,
  };

  return pokemonData;
};