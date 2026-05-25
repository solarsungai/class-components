import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Results from './Results';
import pokemonReducer from '../store/pokemonSlice';
import type { PokemonData } from '../types';

const makeStore = () =>
  configureStore({ reducer: { pokemon: pokemonReducer } });

const mockPokemons: PokemonData[] = [
  { name: 'bulbasaur' },
  { name: 'ivysaur' },
];

describe('Results', () => {
  it('should render empty state when results array is empty', () => {
    render(
      <Provider store={makeStore()}>
        <Results results={[]} onSelect={() => {}} />
      </Provider>
    );
    expect(screen.getByText('No results yet')).toBeInTheDocument();
  });

  it('should render correct number of pokemon cards', () => {
    render(
      <Provider store={makeStore()}>
        <Results results={mockPokemons} onSelect={() => {}} />
      </Provider>
    );
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
  });

  it('should not render empty state when results are provided', () => {
    render(
      <Provider store={makeStore()}>
        <Results results={mockPokemons} onSelect={() => {}} />
      </Provider>
    );
    expect(screen.queryByText('No results yet')).not.toBeInTheDocument();
  });
});
