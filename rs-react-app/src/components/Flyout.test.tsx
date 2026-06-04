import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Flyout from './Flyout';
import pokemonReducer, { addPokemon } from '../store/pokemonSlice';
import { pokemonApi } from '../services/pokemonApi';
import type { PokemonData } from '../types';

const makeStore = (names: string[] = []) => {
  const s = configureStore({
    reducer: {
      pokemon: pokemonReducer,
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware),
  });

  names.forEach((n) => s.dispatch(addPokemon(n)));
  return s;
};

const mockPokemon = (name: string): PokemonData => ({
  name,
  types: ['fire'],
  height: 6,
  weight: 85,
  baseExperience: 240,
  abilities: ['blaze'],
});

const originalInitiate = pokemonApi.endpoints.getPokemonByName.initiate;

describe('Flyout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    pokemonApi.endpoints.getPokemonByName.initiate = originalInitiate;
  });

  it('renders nothing when there are no selected pokemons', async () => {
    render(
      <Provider store={makeStore()}>
        <Flyout />
      </Provider>
    );
    expect(document.querySelector('.flyout-box')).not.toBeInTheDocument();
  });

  it('renders when there is at least one selected pokemon', () => {
    render(
      <Provider store={makeStore(['pikachu'])}>
        <Flyout />
      </Provider>
    );
    expect(screen.getByText(/selected pokémon \(1\)/i)).toBeInTheDocument();
  });

  it('displays the correct count of selected pokemons', () => {
    render(
      <Provider store={makeStore(['pikachu', 'bulbasaur', 'charmander'])}>
        <Flyout />
      </Provider>
    );
    expect(screen.getByText(/selected pokémon \(3\)/i)).toBeInTheDocument();
  });

  it('renders a chip for each selected pokemon', () => {
    render(
      <Provider store={makeStore(['pikachu', 'bulbasaur'])}>
        <Flyout />
      </Provider>
    );
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('Unselect all button dispatches clearAllSelections', async () => {
    const user = userEvent.setup();
    const store = makeStore(['pikachu', 'bulbasaur']);
    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );
    await user.click(screen.getByRole('button', { name: /unselect all/i }));
    expect(store.getState().pokemon.selectedNames).toEqual([]);
  });

  it('Download button triggers CSV download on success', async () => {
    const user = userEvent.setup();

    pokemonApi.endpoints.getPokemonByName.initiate = vi.fn().mockImplementation(() => ({
      type: 'api/mock',
      unwrap: () => Promise.resolve(mockPokemon('pikachu')),
    }));

    const mockObjectURL = 'blob:mock-url';
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue(mockObjectURL);
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(
      <Provider store={makeStore(['pikachu'])}>
        <Flyout />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => {
      expect(createObjectURL).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalledWith(mockObjectURL);
    });

    expect(screen.queryByText(/download failed/i)).not.toBeInTheDocument();
  });

  it('Download button shows error message on failure', async () => {
    const user = userEvent.setup();

    pokemonApi.endpoints.getPokemonByName.initiate = vi.fn().mockImplementation(() => ({
      type: 'api/mock',
      unwrap: () => Promise.reject(new Error('Network error')),
    }));

    render(
      <Provider store={makeStore(['pikachu'])}>
        <Flyout />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => {
      expect(screen.getByText(/download failed: network error/i)).toBeInTheDocument();
    });
  });

  it('Download button shows generic error for non-Error throws', async () => {
    const user = userEvent.setup();

    pokemonApi.endpoints.getPokemonByName.initiate = vi.fn().mockImplementation(() => ({
      type: 'api/mock',
      unwrap: () => Promise.reject('string error'),
    }));

    render(
      <Provider store={makeStore(['pikachu'])}>
        <Flyout />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => {
      expect(screen.getByText(/unknown error/i)).toBeInTheDocument();
    });
  });

  it('Unselect all clears error message', async () => {
    const user = userEvent.setup();

    pokemonApi.endpoints.getPokemonByName.initiate = vi.fn().mockImplementation(() => ({
      type: 'api/mock',
      unwrap: () => Promise.reject(new Error('fail')),
    }));

    render(
      <Provider store={makeStore(['pikachu'])}>
        <Flyout />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /download/i }));
    await waitFor(() => expect(screen.getByText(/download failed/i)).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /unselect all/i }));
    await waitFor(() => expect(screen.queryByText(/download failed/i)).not.toBeInTheDocument());
  });

  it('hides flyout when all selections are cleared', async () => {
    const user = userEvent.setup();
    const store = makeStore(['pikachu']);

    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    expect(screen.getByText(/selected pokémon/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /unselect all/i }));

    await waitFor(() => expect(screen.queryByText(/selected pokémon/i)).not.toBeInTheDocument(), {
      timeout: 1000,
    });
  });

  it('shows flyout when items added to initially empty store', async () => {
    const store = makeStore();

    const { rerender } = render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    expect(document.querySelector('.flyout-box')).not.toBeInTheDocument();

    act(() => {
      store.dispatch(addPokemon('pikachu'));
    });

    rerender(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    expect(screen.getByText(/selected pokémon/i)).toBeInTheDocument();
  });

  it('Download handles pokemon with missing types/height/weight', async () => {
    const user = userEvent.setup();

    pokemonApi.endpoints.getPokemonByName.initiate = vi.fn().mockImplementation(() => ({
      type: 'api/mock',
      unwrap: (): Promise<Partial<PokemonData>> =>
        Promise.resolve({
          name: 'missingno',
          types: undefined,
          height: undefined,
          weight: undefined,
          baseExperience: 0,
          abilities: [],
        }),
    }));

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(
      <Provider store={makeStore(['missingno'])}>
        <Flyout />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => expect(screen.queryByText(/download failed/i)).not.toBeInTheDocument());
  });
});
