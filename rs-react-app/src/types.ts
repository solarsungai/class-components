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
  results: Array<{
    name: string;
  }>;
};

export type AppState = {
  inputValue: string;
  results: PokemonData[];
  loading: boolean;
  error: string | null;
  shouldThrowTestError: boolean;
};

export type SearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
};
