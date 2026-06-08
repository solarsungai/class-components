import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithStore } from './test-utils';
import App from './App';

vi.mock('./hooks/useFormSubmit', () => ({
  default: vi.fn(() => vi.fn().mockResolvedValue(undefined)),
}));

describe('App', () => {
  it('renders without crashing', () => {
    renderWithStore(<App />);
    expect(screen.getByText('Choose your form')).toBeInTheDocument();
  });

  it('renders the MainPage', () => {
    renderWithStore(<App />);
    expect(screen.getByText('Submissions')).toBeInTheDocument();
  });
});
