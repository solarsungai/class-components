import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Header from './Header';
import { ThemeProvider } from '../context/ThemeProvider';

describe('Header', () => {
  it('should render the headder', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(screen.getByText('Pokédex Explorer')).toBeInTheDocument();
  });

  it('should render the headder subtitle', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(
      screen.getByText('Search Pokémon and view key stats instantly.')
    ).toBeInTheDocument();
  });

  it('should render the About navigation link', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );
    const link = screen.getByRole('link', { name: /about/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });

  it('should apply active class to About link when on /about route', () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/about']}>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    );
    const link = screen.getByRole('link', { name: /about/i });
    expect(link).toHaveClass('header-nav-link--active');
  });
});
