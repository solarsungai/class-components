export type PokemonData = {
  name: string;
  image?: string;
  types?: string[];
  height?: number;
  weight?: number;
  baseExperience?: number;
  abilities?: string[];
};

export type PokemonListResponse = {
  results: Array<{
    name: string;
  }>;
};

export type AppState = {
  serverUrl: string;
  inputValue: string;
  results: PokemonData[];
  loading: boolean;
  error: string | null;
  lastSearchTerm: string | null;
  shouldThrowTestError: boolean;
};

export type SearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
};