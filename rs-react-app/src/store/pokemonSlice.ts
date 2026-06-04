import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type PokemonState = {
  selectedNames: string[];
};

const initialState: PokemonState = {
  selectedNames: [],
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    addPokemon: (state, action: PayloadAction<string>) => {
      state.selectedNames.push(action.payload);
    },
    deletePokemon: (state, action: PayloadAction<string>) => {
      state.selectedNames = state.selectedNames.filter((item) => item !== action.payload);
    },
    clearAllSelections: (state) => {
      state.selectedNames = [];
    },
  },
});

export const { addPokemon, deletePokemon, clearAllSelections } = pokemonSlice.actions;

export default pokemonSlice.reducer;
