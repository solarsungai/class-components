import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import userEvent from '@testing-library/user-event';
import MainPage from './MainPage';
import ErrorBoundary from '../components/ErrorBoundary';
import { performPokemonSearch } from '../services/search';
import { ThemeProvider } from '../context/ThemeProvider';

vi.mock('../services/search', () => ({
  performPokemonSearch: vi.fn(),
}));

const renderPage = (initialEntries?: string[]) =>
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={initialEntries || ['/']}>
        <MainPage />
      </MemoryRouter>
    </ThemeProvider>
  );

const renderPageWithRoutes = (initialEntries?: string[]) =>
  render(
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
  );

describe('MainPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should display results after successful search', async () => {
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }],
      count: 100,
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('ivysaur')).toBeInTheDocument();
    });
  });

  it('should call performPokemonSearch with saved term from localStorage', async () => {
    localStorage.setItem('searchTerm', 'pikachu');
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [],
      count: 0,
    });

    renderPage(['/?search=pikachu']);

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledWith(
        'pikachu',
        expect.any(String),
        expect.any(Number)
      );
    });
  });

  it('should call performPokemonSearch with empty string when localStorage is empty', async () => {
    localStorage.setItem('searchTerm', '');
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [],
      count: 0,
    });

    renderPage();

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledWith(
        '',
        expect.any(String),
        expect.any(Number)
      );
    });
  });

  it('should call performPokemonSearch when search button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [],
      count: 0,
    });

    renderPage();

    const button = screen.getByRole('button', { name: /search/i });
    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, 'pikachu');
    await user.click(button);

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledTimes(2);
    });
  });

  it('should not repeat search when the same term is submitted again', async () => {
    const user = userEvent.setup();
    localStorage.setItem('searchTerm', 'pikachu');
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [],
      count: 0,
    });

    renderPage(['/?search=pikachu']);

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledTimes(1);
    });

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledTimes(2);
    });
  });

  it('should display error message when search fails', async () => {
    vi.mocked(performPokemonSearch).mockRejectedValue(
      new Error('Pokemon not found')
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
    });
  });

  it('should update input value when user types in search field', async () => {
    const user = userEvent.setup();
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [],
      count: 0,
    });

    renderPage();

    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, 'charmander');

    expect(input).toHaveValue('charmander');
  });

  it('should navigate to next page when pagination button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [{ name: 'bulbasaur' }],
      count: 40,
    });

    renderPage(['/?search=bulb']);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    const nextBtn = screen.getByRole('button', { name: /next/i });
    await user.click(nextBtn);

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledWith(
        'bulb',
        expect.any(String),
        2
      );
    });
  });

  it('should navigate to details page when a pokemon card is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [{ name: 'bulbasaur' }],
      count: 1,
    });

    renderPageWithRoutes();

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    await user.click(screen.getByText('bulbasaur'));

    await waitFor(() => {
      expect(screen.getByTestId('detail')).toBeInTheDocument();
    });
  });

  it('should close detail panel when clicking left panel outside a pokemon card', async () => {
    const user = userEvent.setup();
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [],
      count: 0,
    });

    renderPageWithRoutes(['/details/bulbasaur?page=1']);

    await waitFor(() => {
      expect(screen.getByTestId('detail')).toBeInTheDocument();
    });

    await user.click(screen.getByText('No results yet'));

    await waitFor(() => {
      expect(screen.queryByTestId('detail')).not.toBeInTheDocument();
    });
  });

  it('should search without adding search param when input is empty', async () => {
    const user = userEvent.setup();
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [],
      count: 0,
    });

    renderPageWithRoutes();

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledWith(
        '',
        expect.any(String),
        expect.any(Number)
      );
    });
  });

  it('should preserve search param when closing via left panel click', async () => {
    const user = userEvent.setup();
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [],
      count: 0,
    });

    renderPageWithRoutes(['/details/bulbasaur?page=1&search=bulb']);

    await waitFor(() => {
      expect(screen.getByTestId('detail')).toBeInTheDocument();
    });

    await user.click(screen.getByText('No results yet'));

    await waitFor(() => {
      expect(screen.queryByTestId('detail')).not.toBeInTheDocument();
    });
  });

  it('should preserve search param when navigating to details', async () => {
    const user = userEvent.setup();
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [{ name: 'bulbasaur' }],
      count: 1,
    });

    renderPageWithRoutes(['/?page=1&search=bulb']);

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    await user.click(screen.getByText('bulbasaur'));

    await waitFor(() => {
      expect(screen.getByTestId('detail')).toBeInTheDocument();
    });
  });

  it('should paginate without search param when no search term', async () => {
    const user = userEvent.setup();
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [{ name: 'bulbasaur' }],
      count: 40,
    });

    renderPageWithRoutes();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledWith(
        '',
        expect.any(String),
        2
      );
    });
  });

  it('should throw error when Test Error Boundary button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(performPokemonSearch).mockResolvedValue({
      results: [],
      count: 0,
    });

    render(
      <ThemeProvider>
        <MemoryRouter>
          <ErrorBoundary>
            <MainPage />
          </ErrorBoundary>
        </MemoryRouter>
      </ThemeProvider>
    );

    const errorButton = screen.getByRole('button', {
      name: /test error boundary/i,
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
