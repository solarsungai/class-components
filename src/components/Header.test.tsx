import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders the header with "React Forms" text', () => {
    render(<Header />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Forms')).toBeInTheDocument();
  });

  it('renders a header element', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});
