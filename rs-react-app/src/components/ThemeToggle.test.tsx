import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from '../context/ThemeProvider';

function renderWithTheme(initialDark = false) {
  if (initialDark) localStorage.setItem('app-theme', 'dark');
  else localStorage.removeItem('app-theme');
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  it('renders a button with aria-label "Toggle theme"', () => {
    renderWithTheme();
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });

  it('thumb does not have dark class in light mode', () => {
    renderWithTheme();
    const thumb = document.querySelector('.theme-toggle-thumb');
    expect(thumb).not.toHaveClass('theme-toggle-thumb--dark');
  });

  it('thumb has dark class in dark mode', () => {
    renderWithTheme(true);
    const thumb = document.querySelector('.theme-toggle-thumb');
    expect(thumb).toHaveClass('theme-toggle-thumb--dark');
  });

  it('clicking toggles to dark mode', async () => {
    const user = userEvent.setup();
    renderWithTheme();
    await user.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('clicking again toggles back to light mode', async () => {
    const user = userEvent.setup();
    renderWithTheme(true);
    await user.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
