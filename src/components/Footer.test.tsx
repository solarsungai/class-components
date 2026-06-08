import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders GitHub link', () => {
    render(<Footer />);
    const githubLink = screen.getByText('GitHub');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/solarsungai');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noreferrer');
  });

  it('renders RS School link with accessible label', () => {
    render(<Footer />);
    const rsLink = screen.getByLabelText('RS School');
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/');
  });

  it('renders the year 2026', () => {
    render(<Footer />);
    expect(screen.getByText('2026')).toBeInTheDocument();
  });
});
