import { describe, it, expect } from 'vitest';
import pokemonReducer, { addPokemon, deletePokemon, clearAllSelections } from './pokemonSlice';

describe('pokemonSlice', () => {
  const initialState = { selectedNames: [] };

  it('should return the initial state', () => {
    expect(pokemonReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('addPokemon should add a name to selectedNames', () => {
    const state = pokemonReducer(initialState, addPokemon('bulbasaur'));
    expect(state.selectedNames).toEqual(['bulbasaur']);
  });

  it('addPokemon should append to existing names', () => {
    const prev = { selectedNames: ['bulbasaur'] };
    const state = pokemonReducer(prev, addPokemon('charmander'));
    expect(state.selectedNames).toEqual(['bulbasaur', 'charmander']);
  });

  it('deletePokemon should remove the matching name', () => {
    const prev = { selectedNames: ['bulbasaur', 'charmander'] };
    const state = pokemonReducer(prev, deletePokemon('bulbasaur'));
    expect(state.selectedNames).toEqual(['charmander']);
  });

  it('deletePokemon should do nothing if name is not present', () => {
    const prev = { selectedNames: ['bulbasaur'] };
    const state = pokemonReducer(prev, deletePokemon('pikachu'));
    expect(state.selectedNames).toEqual(['bulbasaur']);
  });

  it('clearAllSelections should empty selectedNames', () => {
    const prev = { selectedNames: ['bulbasaur', 'charmander'] };
    const state = pokemonReducer(prev, clearAllSelections());
    expect(state.selectedNames).toEqual([]);
  });

  it('clearAllSelections should work on an already empty state', () => {
    const state = pokemonReducer(initialState, clearAllSelections());
    expect(state.selectedNames).toEqual([]);
  });
});
