export type PokemonData = {
  name: string;
  id: number;
  image?: string;
  types: string[];
  height: number;
  weight: number;
  baseExperience: number;
  abilities: string[];
};

export type AppState = {
  serverUrl: string;
  inputValue: string;
  results: PokemonData[];
  loading: boolean;
  error: string | null;
  lastSearchTerm: string;
};

export type SearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
};