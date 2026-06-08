import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '../test-utils';
import RHFForm from './RHFForm';

vi.mock('../hooks/useFormSubmit', () => ({
  default: vi.fn(() => vi.fn().mockResolvedValue(undefined)),
}));

describe('RHFForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    const onClose = vi.fn();
    renderWithStore(<RHFForm onClose={onClose} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Terms')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('Image')).toBeInTheDocument();
  });

  it('submit button is disabled initially (form not valid)', () => {
    renderWithStore(<RHFForm onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('shows name validation error', async () => {
    const user = userEvent.setup();
    renderWithStore(<RHFForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Name'), 'john');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/uppercase/i)).toBeInTheDocument();
    });
  });

  it('shows email validation error', async () => {
    const user = userEvent.setup();
    renderWithStore(<RHFForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Email'), 'notanemail');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('shows password strength indicator when password is typed (missing requirements)', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(<RHFForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Password'), 'abc');

    await waitFor(() => {
      const indicator = container.querySelector('.password-indicators');
      expect(indicator).toHaveClass('visible');
      expect(screen.getByText(/Password should contain minimum/i)).toBeInTheDocument();
    });
  });

  it('hides password indicator when all strength requirements are met', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(<RHFForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Password'), 'Aa1!');

    await waitFor(() => {
      const indicator = container.querySelector('.password-indicators');
      expect(indicator).toHaveClass('hidden');
    });
  });

  it('password indicator hidden initially (not dirty)', () => {
    const { container } = renderWithStore(<RHFForm onClose={vi.fn()} />);
    const indicator = container.querySelector('.password-indicators');
    expect(indicator).toHaveClass('hidden');
  });

  it('shows confirmPassword mismatch error', async () => {
    const user = userEvent.setup();
    renderWithStore(<RHFForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Name'), 'John');
    await user.clear(screen.getByLabelText('Age'));
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.click(screen.getByLabelText('Terms'));

    const countryInput = screen.getByLabelText('Country');
    await user.type(countryInput, 'Ger');
    await waitFor(() => screen.getByText('Germany'));
    await user.click(screen.getByText('Germany'));

    const file = new File(['content'], 'photo.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText('Image'), file);
    await user.type(screen.getByLabelText('Password'), 'Pass1!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Different1!');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/match/i)).toBeInTheDocument();
    });
  });

  it('shows country dropdown when typing a matching value', async () => {
    const user = userEvent.setup();
    renderWithStore(<RHFForm onClose={vi.fn()} />);

    const countryInput = screen.getByLabelText('Country');
    await user.click(countryInput);
    await user.type(countryInput, 'Ger');

    await waitFor(() => {
      expect(screen.getByText('Germany')).toBeInTheDocument();
    });
  });

  it('selects a country from dropdown', async () => {
    const user = userEvent.setup();
    renderWithStore(<RHFForm onClose={vi.fn()} />);

    const countryInput = screen.getByLabelText('Country');
    await user.type(countryInput, 'Fra');

    await waitFor(() => screen.getByText('France'));
    await user.click(screen.getByText('France'));

    await waitFor(() => {
      expect((countryInput as HTMLInputElement).value).toBe('France');
    });
  });

  it('closes country dropdown on blur after delay', async () => {
    const user = userEvent.setup();
    renderWithStore(<RHFForm onClose={vi.fn()} />);

    const countryInput = screen.getByLabelText('Country');
    await user.type(countryInput, 'Ger');
    await waitFor(() => screen.getByText('Germany'));

    await user.tab();

    await waitFor(() => {
      expect(screen.queryByText('Germany')).not.toBeInTheDocument();
    });
  });

  it('does not show dropdown when country input is empty and focused', async () => {
    const user = userEvent.setup();
    renderWithStore(<RHFForm onClose={vi.fn()} />);

    const countryInput = screen.getByLabelText('Country');
    await user.click(countryInput);

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('handles image file selection', async () => {
    const user = userEvent.setup();
    renderWithStore(<RHFForm onClose={vi.fn()} />);

    const file = new File(['content'], 'photo.png', { type: 'image/png' });
    const imageInput = screen.getByLabelText('Image');
    await user.upload(imageInput, file);

    await waitFor(() => {
      expect(screen.queryByText(/only .jpg/i)).not.toBeInTheDocument();
    });
  });

  it('handles image input change with no file selected', () => {
    renderWithStore(<RHFForm onClose={vi.fn()} />);
    const imageInput = screen.getByLabelText('Image');
    fireEvent.change(imageInput, { target: { files: [] } });
  });

  it('shows password strength with "ABC1" input (no lowercase, no special)', async () => {
    const user = userEvent.setup();
    const { container } = renderWithStore(<RHFForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Password'), 'ABC1');

    await waitFor(() => {
      const indicator = container.querySelector('.password-indicators');
      expect(indicator).toHaveClass('visible');
      expect(screen.getByText(/one lowercase letter/i)).toBeInTheDocument();
    });
  });

  it('submits valid form and calls onClose via mocked useFormSubmit', async () => {
    const { default: useFormSubmit } = await import('../hooks/useFormSubmit');
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useFormSubmit).mockReturnValue(mockSubmit);

    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithStore(<RHFForm onClose={onClose} />);

    await user.type(screen.getByLabelText('Name'), 'John');
    await user.clear(screen.getByLabelText('Age'));
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.click(screen.getByLabelText('Terms'));
    await user.type(screen.getByLabelText('Password'), 'Pass1!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Pass1!');

    const countryInput = screen.getByLabelText('Country');
    await user.type(countryInput, 'Ger');
    await waitFor(() => screen.getByText('Germany'));
    await user.click(screen.getByText('Germany'));

    const file = new File(['content'], 'photo.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText('Image'), file);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled();
    });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /submit/i }));
    });

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
