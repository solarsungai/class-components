import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { loadSearchTerm } from './services/storage';
import { performPokemonSearch } from './services/search';

vi.mock('./services/storage', () => ({
  loadSearchTerm: vi.fn(),
  saveSearchTerm: vi.fn(),
}));

vi.mock('./services/search', () => ({
  performPokemonSearch: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display results after successful search', async () => {
    vi.mocked(loadSearchTerm).mockReturnValue(null);
    vi.mocked(performPokemonSearch).mockImplementation(
      async ({ onSuccess }) => {
        onSuccess([{ name: 'bulbasaur' }, { name: 'ivysaur' }]);
      }
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('ivysaur')).toBeInTheDocument();
    });
  });

  it('should show loading indicator while search is in progress', async () => {
    vi.mocked(loadSearchTerm).mockReturnValue(null);
    vi.mocked(performPokemonSearch).mockImplementation(({ onStart }) => {
      onStart('');
      return new Promise(() => {});
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('should display error message when search fails', async () => {
    vi.mocked(loadSearchTerm).mockReturnValue(null);
    vi.mocked(performPokemonSearch).mockImplementation(async ({ onError }) => {
      onError('Pokemon not found');
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Pokemon not found')).toBeInTheDocument();
    });
  });

  it('should call performPokemonSearch with saved term from localStorage', async () => {
    vi.mocked(loadSearchTerm).mockReturnValue('pikachu');
    vi.mocked(performPokemonSearch).mockResolvedValue();

    render(<App />);

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledWith(
        expect.objectContaining({ searchTerm: 'pikachu' })
      );
    });
  });

  it('should call performPokemonSearch with empty string when localStorage is empty', async () => {
    vi.mocked(loadSearchTerm).mockReturnValue('');
    vi.mocked(performPokemonSearch).mockResolvedValue();

    render(<App />);

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledWith(
        expect.objectContaining({ searchTerm: '' })
      );
    });
  });

  it('should call performPokemonSearch when search button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(loadSearchTerm).mockReturnValue(null);
    vi.mocked(performPokemonSearch).mockResolvedValue();

    render(<App />);

    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);

    await waitFor(() => {
      expect(performPokemonSearch).toHaveBeenCalledTimes(2);
    });
  });

  it('should throw error when Test Error Boundary button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(loadSearchTerm).mockReturnValue(null);
    vi.mocked(performPokemonSearch).mockResolvedValue(undefined);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const errorButton = screen.getByRole('button', {
      name: /test error boundary/i,
    });
    await user.click(errorButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
