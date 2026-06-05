import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeContext, useTheme } from './ThemeContext';

function ConsumerComponent() {
  const { theme } = useTheme();
  return <span data-testid="theme">{theme}</span>;
}

describe('ThemeContext', () => {
  it('useTheme throws when used outside ThemeProvider', () => {
    expect(() => render(<ConsumerComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
  });

  it('useTheme returns context value when wrapped in a provider', () => {
    render(
      <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {} }}>
        <ConsumerComponent />
      </ThemeContext.Provider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });
});
