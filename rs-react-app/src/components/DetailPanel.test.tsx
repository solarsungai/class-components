import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Route, Routes } from 'react-router';
import DetailPanel from './DetailPanel';
import { fetchPokemonByTerm } from '../services/pokemonApi';

vi.mock('../services/api', () => ({
  fetchPokemonByTerm: vi.fn(),
}));

const mockPokemon = {
  name: 'squirtle',
  image: 'https://images.com/squirtle.png',
  types: ['water'],
  height: 5,
  weight: 90,
  baseExperience: 63,
  abilities: ['torrent', 'rain-dish'],
};

const renderDetailPanel = (path = '/details/squirtle?page=2') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/details/:name" element={<DetailPanel />} />
        <Route path="/" element={<div>Main Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('DetailPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading indicator while fetching', () => {
    vi.mocked(fetchPokemonByTerm).mockReturnValue(new Promise(() => {}));

    renderDetailPanel();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render pokemon name after successful fetch', async () => {
    vi.mocked(fetchPokemonByTerm).mockResolvedValue(mockPokemon);

    renderDetailPanel();

    await waitFor(() => {
      expect(screen.getByText('squirtle')).toBeInTheDocument();
    });
  });

  it('should render pokemon image after successful fetch', async () => {
    vi.mocked(fetchPokemonByTerm).mockResolvedValue(mockPokemon);

    renderDetailPanel();

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'squirtle' })).toBeInTheDocument();
    });
  });

  it('should render types after successful fetch', async () => {
    vi.mocked(fetchPokemonByTerm).mockResolvedValue(mockPokemon);

    renderDetailPanel();

    await waitFor(() => {
      expect(screen.getByText('water')).toBeInTheDocument();
    });
  });

  it('should render abilities after successful fetch', async () => {
    vi.mocked(fetchPokemonByTerm).mockResolvedValue(mockPokemon);

    renderDetailPanel();

    await waitFor(() => {
      expect(screen.getByText('torrent')).toBeInTheDocument();
      expect(screen.getByText('rain-dish')).toBeInTheDocument();
    });
  });

  it('should render stats after successful fetch', async () => {
    vi.mocked(fetchPokemonByTerm).mockResolvedValue(mockPokemon);

    renderDetailPanel();

    await waitFor(() => {
      expect(screen.getByText('0.5 m')).toBeInTheDocument();
      expect(screen.getByText('9 kg')).toBeInTheDocument();
      expect(screen.getByText('63')).toBeInTheDocument();
    });
  });

  it('should call usePokemonDetail with empty string when name param is absent', () => {
    vi.mocked(fetchPokemonByTerm).mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={['/panel']}>
        <Routes>
          <Route path="/panel" element={<DetailPanel />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    vi.mocked(fetchPokemonByTerm).mockRejectedValue(new Error('Not found'));

    renderDetailPanel();

    await waitFor(() => {
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });
  });

  it('should navigate to main page with page param when close button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchPokemonByTerm).mockResolvedValue(mockPokemon);

    renderDetailPanel('/details/squirtle?page=2');

    await waitFor(() => {
      expect(screen.getByText('squirtle')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Close details' }));

    await waitFor(() => {
      expect(screen.getByText('Main Page')).toBeInTheDocument();
    });
  });

  it('should preserve search param in URL when closing', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchPokemonByTerm).mockResolvedValue(mockPokemon);

    render(
      <MemoryRouter
        initialEntries={['/details/squirtle?page=1&search=squirtle']}
      >
        <Routes>
          <Route path="/details/:name" element={<DetailPanel />} />
          <Route path="/" element={<div data-testid="main">Main Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('squirtle')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Close details' }));

    await waitFor(() => {
      expect(screen.getByTestId('main')).toBeInTheDocument();
    });
  });

  it('should default to page 1 when page param is missing in URL', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchPokemonByTerm).mockResolvedValue(mockPokemon);

    render(
      <MemoryRouter initialEntries={['/details/squirtle']}>
        <Routes>
          <Route path="/details/:name" element={<DetailPanel />} />
          <Route path="/" element={<div data-testid="main">Main Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('squirtle')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Close details' }));

    await waitFor(() => {
      expect(screen.getByTestId('main')).toBeInTheDocument();
    });
  });
});
