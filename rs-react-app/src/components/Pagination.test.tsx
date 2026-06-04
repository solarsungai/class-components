import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('should render current page and total pages', () => {
    const { container } = render(
      <Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />
    );

    expect(container.querySelector('.pagination-info')).toHaveTextContent('2');
    expect(container.querySelector('.pagination-info')).toHaveTextContent('5');
  });

  it('should disable Prev button on the first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
  });

  it('should disable Next button on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /prev/i })).not.toBeDisabled();
  });

  it('should call onPageChange with page - 1 when Prev is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: /prev/i }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange with page + 1 when Next is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('should not call onPageChange when Prev is clicked on first page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: /prev/i }));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('should not call onPageChange when Next is clicked on last page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(onPageChange).not.toHaveBeenCalled();
  });
});
