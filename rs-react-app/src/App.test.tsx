import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { performPokemonSearch } from './services/search';

vi.mock('./services/search', () => ({
  performPokemonSearch: vi.fn(),
}));

const renderApp = () =>
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should display results after successful search', async () => {
    vi.mocked(performPokemonSearch).mockResolvedValue([
      { name: 'bulbasaur' },
      { name: 'ivysaur' },
    ]);

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('ivysaur')).toBeInTheDocument();
    });
  });

  it('should call performPokemonSearch with saved term from localStorage', async () => {
    localStorage.setItem('searchTerm', 'pikachu');
    vi.mocked(performPokemonSearch).mockResolvedValue([]);

    renderApp();

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledWith(
        'pikachu',
        expect.any(String)
      );
    });
  });

  it('should call performPokemonSearch with empty string when localStorage is empty', async () => {
    localStorage.setItem('searchTerm', '');
    vi.mocked(performPokemonSearch).mockResolvedValue([]);

    renderApp();

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledWith('', expect.any(String));
    });
  });

  it('should call performPokemonSearch when search button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(performPokemonSearch).mockResolvedValue([]);

    renderApp();

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
    vi.mocked(performPokemonSearch).mockResolvedValue([]);

    renderApp();

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledTimes(1);
    });

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledTimes(1);
    });
  });

  it('should display error message when search fails', async () => {
    vi.mocked(performPokemonSearch).mockRejectedValue(
      new Error('Pokemon not found')
    );

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
    });
  });

  it('should update input value when user types in search field', async () => {
    const user = userEvent.setup();
    vi.mocked(performPokemonSearch).mockResolvedValue([]);

    renderApp();

    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, 'charmander');

    expect(input).toHaveValue('charmander');
  });

  it('should throw error when Test Error Boundary button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(performPokemonSearch).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </MemoryRouter>
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
