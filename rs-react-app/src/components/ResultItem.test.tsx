import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResultItem from './ResultItem';
import type { PokemonData } from '../types';

describe('ResultItem', () => {
  let mockPokemon: PokemonData;

  beforeEach(() => {
    mockPokemon = {
      name: 'pikachu',
      image: 'https://images.com/pokemon/25.png',
      types: ['electric'],
      height: 4,
      weight: 60,
      baseExperience: 112,
      abilities: ['static', 'lightning-rod'],
    };
  });

  it('should render the pockemon name', () => {
    render(<ResultItem pokemon={mockPokemon} onSelect={() => {}} />);
    expect(screen.getByText('pikachu')).toBeInTheDocument();
  });

  it('should render the image if it received from the API', () => {
    render(<ResultItem pokemon={mockPokemon} onSelect={() => {}} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should render the types if it received from the API', () => {
    render(<ResultItem pokemon={mockPokemon} onSelect={() => {}} />);
    expect(screen.getByText('electric')).toBeInTheDocument();
  });

  it('should render the abilities if it received from the API', () => {
    render(<ResultItem pokemon={mockPokemon} onSelect={() => {}} />);
    expect(screen.getByText('static')).toBeInTheDocument();
  });

  it('should render stats if it received from the API', () => {
    render(<ResultItem pokemon={mockPokemon} onSelect={() => {}} />);
    expect(screen.getByText('112')).toBeInTheDocument();
  });

  it('should not render the image if it not received from the API', () => {
    render(<ResultItem pokemon={{ ...mockPokemon, image: undefined }} onSelect={() => {}} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should not render the types if it not received from the API', () => {
    render(<ResultItem pokemon={{ ...mockPokemon, types: [] }} onSelect={() => {}} />);
    expect(screen.queryByText('electric')).not.toBeInTheDocument();
  });

  it('should not render the abilities if it not received from the API', () => {
    render(<ResultItem pokemon={{ ...mockPokemon, abilities: [] }} onSelect={() => {}} />);
    expect(screen.queryByText('static')).not.toBeInTheDocument();
  });

  it('should not render stats if it not received from the API', () => {
    render(<ResultItem pokemon={{ ...mockPokemon, height: undefined }} onSelect={() => {}} />);
    expect(screen.queryByText('Height:')).not.toBeInTheDocument();
  });

  it('should call onSelect with pokemon name when card is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ResultItem pokemon={mockPokemon} onSelect={onSelect} />);
    await user.click(screen.getByText('pikachu'));
    expect(onSelect).toHaveBeenCalledWith('pikachu');
  });
});
