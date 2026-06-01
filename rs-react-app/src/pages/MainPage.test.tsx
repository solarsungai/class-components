import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import userEvent from '@testing-library/user-event';
import MainPage from './MainPage';
import ErrorBoundary from '../components/ErrorBoundary';
import {
  useGetPokemonByPageQuery,
  useGetPokemonByNameQuery,
} from '../services/pokemonApi';
import { ThemeProvider } from '../context/ThemeProvider';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from '../store/pokemonSlice';

vi.mock('../services/pokemonApi', () => ({
  pokemonApi: {
    util: {
      invalidateTags: vi.fn(),
    },
  },
  useGetPokemonByPageQuery: vi.fn(),
  useGetPokemonByNameQuery: vi.fn(),
}));

const makeStore = () =>
  configureStore({ reducer: { pokemon: pokemonReducer } });

const renderPage = (initialEntries?: string[]) =>
  render(
    <Provider store={makeStore()}>
      <ThemeProvider>
        <MemoryRouter initialEntries={initialEntries || ['/']}>
          <MainPage />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );

const renderPageWithRoutes = (initialEntries?: string[]) =>
  render(
    <Provider store={makeStore()}>
      <ThemeProvider>
        <MemoryRouter initialEntries={initialEntries || ['/']}>
          <Routes>
            <Route path="/" element={<MainPage />}>
              <Route
                path="details/:name"
                element={<div data-testid="detail">Detail</div>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );

describe('MainPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    vi.mocked(useGetPokemonByPageQuery).mockReturnValue({
      data: { results: [], count: 0 },
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    vi.mocked(useGetPokemonByNameQuery).mockReturnValue({
      data: undefined,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });
  });

  it('should display results after successful search', async () => {
    vi.mocked(useGetPokemonByPageQuery).mockReturnValue({
      data: {
        results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }],
        count: 100,
      },
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('ivysaur')).toBeInTheDocument();
    });
  });

  it('should call useGetPokemonByNameQuery with saved term from localStorage', async () => {
    const user = userEvent.setup();
    localStorage.setItem('searchTerm', 'pikachu');

    renderPage(['/']);

    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toHaveValue('pikachu');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(useGetPokemonByNameQuery).toHaveBeenCalledWith(
        'pikachu',
        expect.objectContaining({ skip: false })
      );
    });
  });

  it('should call useGetPokemonByPageQuery with page 1 when localStorage is empty', async () => {
    localStorage.setItem('searchTerm', '');

    renderPage();

    await waitFor(() => {
      expect(useGetPokemonByPageQuery).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ skip: false })
      );
    });
  });

  it('should call useGetPokemonByNameQuery when search button is clicked and input is not empty', async () => {
    const user = userEvent.setup();

    renderPage();

    const button = screen.getByRole('button', { name: /search/i });
    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, 'pikachu');
    await user.click(button);

    await waitFor(() => {
      expect(useGetPokemonByNameQuery).toHaveBeenCalledWith(
        'pikachu',
        expect.objectContaining({ skip: false })
      );
    });
  });

  it('should display error message when search fails', async () => {
    vi.mocked(useGetPokemonByNameQuery).mockReturnValue({
      data: undefined,
      isFetching: false,
      error: { status: 404, data: 'Pokemon not found' },
      refetch: vi.fn(),
    });

    renderPage(['/?search=missingmon']);

    await waitFor(() => {
      expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
    });
  });

  it('should navigate to next page when pagination button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(useGetPokemonByPageQuery).mockReturnValue({
      data: { results: [{ name: 'bulbasaur' }], count: 40 },
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderPage(['/']);

    const nextBtn = screen.getByRole('button', { name: /next/i });
    await user.click(nextBtn);

    await waitFor(() => {
      expect(useGetPokemonByPageQuery).toHaveBeenCalledWith(
        2,
        expect.objectContaining({ skip: false })
      );
    });
  });

  it('should navigate to details page when a pokemon card is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(useGetPokemonByPageQuery).mockReturnValue({
      data: { results: [{ name: 'bulbasaur' }], count: 1 },
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderPageWithRoutes(['/']);

    const pokemonCard = await screen.findByText('bulbasaur');
    await user.click(pokemonCard);

    await waitFor(() => {
      expect(screen.getByTestId('detail')).toBeInTheDocument();
    });
  });

  it('should close detail panel when clicking left panel outside a pokemon card', async () => {
    const user = userEvent.setup();

    vi.mocked(useGetPokemonByPageQuery).mockReturnValue({
      data: { results: [{ name: 'bulbasaur' }], count: 1 },
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderPageWithRoutes(['/details/bulbasaur?page=1']);

    await waitFor(() => {
      expect(screen.getByTestId('detail')).toBeInTheDocument();
    });

    const leftPanel = screen.getByText('bulbasaur').closest('.left-panel');

    if (leftPanel) {
      await user.click(leftPanel);
    }

    await waitFor(() => {
      expect(screen.queryByTestId('detail')).not.toBeInTheDocument();
    });
  });

  it('should search without adding search param when input is empty', async () => {
    const user = userEvent.setup();

    renderPageWithRoutes(['/']);

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    await waitFor(() => {
      expect(useGetPokemonByPageQuery).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ skip: false })
      );
      expect(useGetPokemonByNameQuery).toHaveBeenCalledWith(
        '',
        expect.objectContaining({ skip: true })
      );
    });
  });

  it('should preserve search param when closing via left panel click', async () => {
    const user = userEvent.setup();
    vi.mocked(useGetPokemonByPageQuery).mockReturnValue({
      data: { results: [{ name: 'bulbasaur' }], count: 40 },
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderPageWithRoutes(['/details/bulbasaur?page=2']);

    expect(await screen.findByTestId('detail')).toBeInTheDocument();

    const leftPanel = screen.getByText('bulbasaur').closest('.left-panel');
    if (leftPanel) {
      await user.click(leftPanel);
    }

    await waitFor(() => {
      expect(screen.queryByTestId('detail')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(useGetPokemonByPageQuery).toHaveBeenCalledWith(
        2,
        expect.objectContaining({ skip: false })
      );
    });
  });

  it('should throw error when Test Error Boundary button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={makeStore()}>
        <ThemeProvider>
          <MemoryRouter>
            <ErrorBoundary>
              <MainPage />
            </ErrorBoundary>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    const errorButton = screen.getByRole('button', {
      name: /test error/i,
    });
    await user.click(errorButton);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.getByText('Test error button triggered')
      ).toBeInTheDocument();
    });
  });
});
