import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Results from './Results';
import type { PokemonData } from '../types';

const mockPokemons: PokemonData[] = [
  { name: 'bulbasaur' },
  { name: 'ivysaur' },
];

describe('Results', () => {
  it('should render empty state when results array is empty', () => {
    render(<Results results={[]} onSelect={() => {}} />);
    expect(screen.getByText('No results yet')).toBeInTheDocument();
  });

  it('should render correct number of pokemon cards', () => {
    render(<Results results={mockPokemons} onSelect={() => {}} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
  });

  it('should not render empty state when results are provided', () => {
    render(<Results results={mockPokemons} onSelect={() => {}} />);
    expect(screen.queryByText('No results yet')).not.toBeInTheDocument();
  });
});
