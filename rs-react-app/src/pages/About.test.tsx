import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import About from './About';

describe('About', () => {
  it('should render the page title', () => {
    render(<MemoryRouter><About /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /about pokédex explorer/i })).toBeInTheDocument();
  });

  it('should render the description text', () => {
    render(<MemoryRouter><About /></MemoryRouter>);
    expect(screen.getByText(/a fast and minimal pokédex/i)).toBeInTheDocument();
  });

  it('should render the features list', () => {
    render(<MemoryRouter><About /></MemoryRouter>);
    expect(screen.getByText(/instant search by pokémon name/i)).toBeInTheDocument();
    expect(screen.getByText(/paginated results with url sync/i)).toBeInTheDocument();
    expect(screen.getByText(/detailed stats panel via react router outlet/i)).toBeInTheDocument();
    expect(screen.getByText(/last search saved in localstorage/i)).toBeInTheDocument();
  });

  it('should render the author info and RS School link', () => {
    render(<MemoryRouter><About /></MemoryRouter>);
    expect(screen.getByText(/solarsungai/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /rs school react course/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });

  it('should render Pikachu image', () => {
    render(<MemoryRouter><About /></MemoryRouter>);
    expect(screen.getByAltText('Pikachu')).toBeInTheDocument();
  });

  it('should render a link to the main page', () => {
    render(<MemoryRouter><About /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /go to pokédex/i })).toBeInTheDocument();
  });
});
