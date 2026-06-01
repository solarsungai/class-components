export type PokemonData = {
  name: string;
  image?: string;
  types?: string[];
  height?: number;
  weight?: number;
  baseExperience?: number;
  abilities?: string[];
};

export type PokemonApiResponse = {
  name: string;
  sprites?: {
    front_default: string | null;
  };
  types?: Array<{ type: { name: string } }>;
  height?: number;
  weight?: number;
  base_experience?: number;
  abilities?: Array<{ ability: { name: string } }>;
};

export type PokemonListResponse = {
  count: number;
  results: Array<{
    name: string;
  }>;
};
