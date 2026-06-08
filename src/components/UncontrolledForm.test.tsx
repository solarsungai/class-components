import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '../test-utils';
import UncontrolledForm from './UncontrolledForm';
import schema from '../validation/schema';

vi.mock('../hooks/useFormSubmit', () => ({
  default: vi.fn(() => vi.fn().mockResolvedValue(undefined)),
}));

describe('UncontrolledForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    const onClose = vi.fn();
    renderWithStore(<UncontrolledForm onClose={onClose} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Terms')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('Image')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows validation errors when form is submitted empty', async () => {
    const onClose = vi.fn();
    renderWithStore(<UncontrolledForm onClose={onClose} />);

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }).closest('form')!);

    await waitFor(() => {
      expect(
        screen.queryAllByText('status').length ||
          screen.getAllByText(/required|invalid|empty|negative|must|agree/i).length
      ).toBeGreaterThan(0);
    });
  });

  it('shows password strength indicator when password is typed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithStore(<UncontrolledForm onClose={onClose} />);

    await user.type(screen.getByLabelText('Password'), 'abc');

    expect(screen.getByText(/Password should contain minimum/i)).toBeInTheDocument();
  });

  it('hides password indicator when all requirements are met', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = renderWithStore(<UncontrolledForm onClose={onClose} />);

    await user.type(screen.getByLabelText('Password'), 'Aa1!');

    const indicator = container.querySelector('.password-indicators');
    expect(indicator).toHaveClass('hidden');
  });

  it('shows country suggestions dropdown when typing', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithStore(<UncontrolledForm onClose={onClose} />);

    const countryInput = screen.getByLabelText('Country');
    await user.click(countryInput);
    await user.type(countryInput, 'Ger');

    await waitFor(() => {
      expect(screen.getByText('Germany')).toBeInTheDocument();
    });
  });

  it('selects a country from dropdown', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithStore(<UncontrolledForm onClose={onClose} />);

    const countryInput = screen.getByLabelText('Country');
    await user.click(countryInput);
    await user.type(countryInput, 'Ger');

    await waitFor(() => screen.getByText('Germany'));
    await user.click(screen.getByText('Germany'));

    await waitFor(() => {
      expect((countryInput as HTMLInputElement).value).toBe('Germany');
    });
  });

  it('closes country dropdown on blur after delay', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithStore(<UncontrolledForm onClose={onClose} />);

    const countryInput = screen.getByLabelText('Country');
    await user.click(countryInput);
    await user.type(countryInput, 'Fra');

    await waitFor(() => screen.getByText('France'));

    await user.tab();

    await waitFor(() => {
      expect(screen.queryByText('France')).not.toBeInTheDocument();
    });
  });

  it('submits valid form data and calls onClose', async () => {
    const { default: useFormSubmit } = await import('../hooks/useFormSubmit');
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useFormSubmit).mockReturnValue(mockSubmit);

    const mockValidResult = {
      success: true,
      data: {
        name: 'John',
        age: 25,
        email: 'john@example.com',
        gender: 'male',
        terms: true,
        country: 'Germany',
        image: new File(['content'], 'photo.png', { type: 'image/png' }),
      },
    } as unknown as ReturnType<typeof schema.safeParse>;

    const safeParseSpy = vi.spyOn(schema, 'safeParse').mockReturnValue(mockValidResult);

    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithStore(<UncontrolledForm onClose={onClose} />);

    await user.type(screen.getByLabelText('Name'), 'John');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.click(screen.getByLabelText('Terms'));

    const countryInput = screen.getByLabelText('Country');
    await user.type(countryInput, 'Ger');
    await waitFor(() => screen.getByText('Germany'));
    await user.click(screen.getByText('Germany'));

    await user.type(screen.getByLabelText('Password'), 'Pass1!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Pass1!');

    const file = new File(['content'], 'photo.png', { type: 'image/png' });
    const imageInput = screen.getByLabelText('Image');
    await user.upload(imageInput, file);

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }).closest('form')!);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });

    safeParseSpy.mockRestore();
  });

  it('does not show dropdown when country input is empty', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithStore(<UncontrolledForm onClose={onClose} />);

    const countryInput = screen.getByLabelText('Country');
    await user.click(countryInput);

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});
