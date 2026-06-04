import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ResultItem from './ResultItem';
import pokemonReducer from '../store/pokemonSlice';
import type { PokemonData } from '../types';

const makeStore = () => configureStore({ reducer: { pokemon: pokemonReducer } });

describe('ResultItem', () => {
  let mockPokemon: PokemonData;

  beforeEach(() => {
    mockPokemon = {
      name: 'pikachu',
      image: 'https://images.com/pokemon/25.png',
      types: ['electric'],
      height: 4,
      weight: 60,
      baseExperience: 112,
      abilities: ['static', 'lightning-rod'],
    };
  });

  it('should render the pockemon name', () => {
    render(
      <Provider store={makeStore()}>
        <ResultItem pokemon={mockPokemon} onSelect={() => {}} />
      </Provider>
    );
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  it('should render the image if it received from the API', () => {
    render(
      <Provider store={makeStore()}>
        <ResultItem pokemon={mockPokemon} onSelect={() => {}} />
      </Provider>
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should render the types if it received from the API', () => {
    render(
      <Provider store={makeStore()}>
        <ResultItem pokemon={mockPokemon} onSelect={() => {}} />
      </Provider>
    );
    expect(screen.getByText('electric')).toBeInTheDocument();
  });

  it('should render the abilities if it received from the API', () => {
    render(
      <Provider store={makeStore()}>
        <ResultItem pokemon={mockPokemon} onSelect={() => {}} />
      </Provider>
    );
    expect(screen.getByText('static')).toBeInTheDocument();
  });

  it('should render stats if it received from the API', () => {
    render(
      <Provider store={makeStore()}>
        <ResultItem pokemon={mockPokemon} onSelect={() => {}} />
      </Provider>
    );
    expect(screen.getByText('112')).toBeInTheDocument();
  });

  it('should not render the image if it not received from the API', () => {
    render(
      <Provider store={makeStore()}>
        <ResultItem pokemon={{ ...mockPokemon, image: undefined }} onSelect={() => {}} />
      </Provider>
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should not render the types if it not received from the API', () => {
    render(
      <Provider store={makeStore()}>
        <ResultItem pokemon={{ ...mockPokemon, types: [] }} onSelect={() => {}} />
      </Provider>
    );
    expect(screen.queryByText('electric')).not.toBeInTheDocument();
  });

  it('should not render the abilities if it not received from the API', () => {
    render(
      <Provider store={makeStore()}>
        <ResultItem pokemon={{ ...mockPokemon, abilities: [] }} onSelect={() => {}} />
      </Provider>
    );
    expect(screen.queryByText('static')).not.toBeInTheDocument();
  });

  it('should not render stats if it not received from the API', () => {
    render(
      <Provider store={makeStore()}>
        <ResultItem pokemon={{ ...mockPokemon, height: undefined }} onSelect={() => {}} />
      </Provider>
    );
    expect(screen.queryByText('Height:')).not.toBeInTheDocument();
  });

  it('should call onSelect with pokemon name when card is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Provider store={makeStore()}>
        <ResultItem pokemon={mockPokemon} onSelect={onSelect} />
      </Provider>
    );
    await user.click(screen.getByText('pikachu'));
    expect(onSelect).toHaveBeenCalledWith('pikachu');
  });

  it('should dispatch addPokemon when checkbox is checked', async () => {
    const user = userEvent.setup();
    const store = makeStore();
    render(
      <Provider store={store}>
        <ResultItem pokemon={mockPokemon} onSelect={() => {}} />
      </Provider>
    );
    await user.click(screen.getByRole('checkbox'));
    expect(store.getState().pokemon.selectedNames).toContain('pikachu');
  });

  it('should dispatch deletePokemon when checkbox is unchecked', async () => {
    const user = userEvent.setup();
    const store = makeStore();
    store.dispatch({ type: 'pokemon/addPokemon', payload: 'pikachu' });
    render(
      <Provider store={store}>
        <ResultItem pokemon={mockPokemon} onSelect={() => {}} />
      </Provider>
    );
    await user.click(screen.getByRole('checkbox'));
    expect(store.getState().pokemon.selectedNames).not.toContain('pikachu');
  });

  it('should not call onSelect when checkbox label is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Provider store={makeStore()}>
        <ResultItem pokemon={mockPokemon} onSelect={onSelect} />
      </Provider>
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('should handle undefined types and abilities gracefully', () => {
    render(
      <Provider store={makeStore()}>
        <ResultItem
          pokemon={{
            ...mockPokemon,
            types: undefined as unknown as string[],
            abilities: undefined as unknown as string[],
          }}
          onSelect={() => {}}
        />
      </Provider>
    );
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });
});
