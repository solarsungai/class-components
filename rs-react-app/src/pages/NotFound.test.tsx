import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import NotFound from './NotFound';

describe('NotFound', () => {
  it('should render the 404 heading', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
  });

  it('should render the "page ran away" message', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/looks like this page ran away/i)
    ).toBeInTheDocument();
  });

  it('should render the Psyduck image', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByAltText(/psyduck/i)).toBeInTheDocument();
  });

  it('should render a link back to the main page', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('link', { name: /back to pokédex/i })
    ).toBeInTheDocument();
  });
});
