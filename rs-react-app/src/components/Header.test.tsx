import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('should render the headder', () => {
    render(<Header />);
    expect(screen.getByText('Pokédex Explorer')).toBeInTheDocument();
  });

  it('should render the headder subtitle', () => {
    render(<Header />);
    expect(
      screen.getByText('Search Pokémon and view key stats instantly.')
    ).toBeInTheDocument();
  });
});
