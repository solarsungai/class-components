import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';
import type { SearchProps } from '../types';

describe('Search', () => {
  let mockData: SearchProps;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();

    mockData = {
      value: 'pikachu',
      onChange: vi.fn<(value: string) => void>(),
      onSearch: vi.fn<() => void>(),
    };
  });

  it('should render search input', () => {
    render(<Search {...mockData} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render search button', () => {
    render(<Search {...mockData} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call onChange when the user types something in input', async () => {
    render(<Search {...mockData} />);
    await user.type(screen.getByRole('textbox'), 'pikachu');
    expect(mockData.onChange).toHaveBeenCalled();
  });

  it('should call onSearch when the user clickes the button', async () => {
    render(<Search {...mockData} />);
    await user.click(screen.getByRole('button'));
    expect(mockData.onSearch).toHaveBeenCalled();
  });
});
