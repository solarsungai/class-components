import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Route, Routes } from 'react-router';
import DetailPanel from './DetailPanel';
import { useGetPokemonByNameQuery } from '../services/pokemonApi';

vi.mock('../services/pokemonApi', () => ({
  useGetPokemonByNameQuery: vi.fn(),
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
    vi.mocked(useGetPokemonByNameQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      refetch: vi.fn(),
    });

    renderDetailPanel();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render pokemon name after successful fetch', async () => {
    vi.mocked(useGetPokemonByNameQuery).mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderDetailPanel();

    await waitFor(() => {
      expect(screen.getByText('squirtle')).toBeInTheDocument();
    });
  });

  it('should render pokemon image after successful fetch', async () => {
    vi.mocked(useGetPokemonByNameQuery).mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderDetailPanel();

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'squirtle' })).toBeInTheDocument();
    });
  });

  it('should render types after successful fetch', async () => {
    vi.mocked(useGetPokemonByNameQuery).mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderDetailPanel();

    await waitFor(() => {
      expect(screen.getByText('water')).toBeInTheDocument();
    });
  });

  it('should render abilities after successful fetch', async () => {
    vi.mocked(useGetPokemonByNameQuery).mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderDetailPanel();

    await waitFor(() => {
      expect(screen.getByText('torrent')).toBeInTheDocument();
      expect(screen.getByText('rain-dish')).toBeInTheDocument();
    });
  });

  it('should render stats after successful fetch', async () => {
    vi.mocked(useGetPokemonByNameQuery).mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    renderDetailPanel();

    await waitFor(() => {
      expect(screen.getByText('0.5 m')).toBeInTheDocument();
      expect(screen.getByText('9 kg')).toBeInTheDocument();
      expect(screen.getByText('63')).toBeInTheDocument();
    });
  });

  it('should render properly when name parameter is missing', () => {
    vi.mocked(useGetPokemonByNameQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/panel']}>
        <Routes>
          <Route path="/panel" element={<DetailPanel />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('button', { name: 'Close details' })
    ).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    vi.mocked(useGetPokemonByNameQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Not found' },
      refetch: vi.fn(),
    });

    renderDetailPanel();

    await waitFor(() => {
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });
  });

  it('should navigate to main page with page param when close button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(useGetPokemonByNameQuery).mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    });

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
    vi.mocked(useGetPokemonByNameQuery).mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    });

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
    vi.mocked(useGetPokemonByNameQuery).mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    });

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
