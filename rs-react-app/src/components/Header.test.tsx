import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Header from './Header';

describe('Header', () => {
  it('should render the headder', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText('Pokédex Explorer')).toBeInTheDocument();
  });

  it('should render the headder subtitle', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(
      screen.getByText('Search Pokémon and view key stats instantly.')
    ).toBeInTheDocument();
  });

  it('should render the About navigation link', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /about/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });

  it('should apply active class to About link when on /about route', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <Header />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /about/i });
    expect(link).toHaveClass('header-nav-link--active');
  });
});
