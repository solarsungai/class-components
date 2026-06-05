import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search, { type SearchProps } from './Search';

describe('Search', () => {
  let mockData: SearchProps;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();

    mockData = {
      defaultValue: 'pikachu',
      onSearch: vi.fn<(value: string) => void>(),
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

  it('should call onSearch when the user clickes the button', async () => {
    render(<Search {...mockData} />);
    await user.click(screen.getByRole('button'));
    expect(mockData.onSearch).toHaveBeenCalledWith('pikachu');
  });

  it('should call onSearch when the user presses Enter in the input', async () => {
    render(<Search {...mockData} />);
    await user.type(screen.getByRole('textbox'), '{Enter}');
    expect(mockData.onSearch).toHaveBeenCalledWith('pikachu');
  });
});
