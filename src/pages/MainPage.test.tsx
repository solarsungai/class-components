import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '../test-utils';
import { MainPage } from './MainPage';
import type { SubmissionType } from '../store/submissionsSlice';

vi.mock('../hooks/useFormSubmit', () => ({
  default: vi.fn(() => vi.fn().mockResolvedValue(undefined)),
}));

describe('MainPage', () => {
  it('renders header, main section and footer', () => {
    renderWithStore(<MainPage />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Choose your form')).toBeInTheDocument();
    expect(screen.getByText('Submissions')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('shows empty submissions message when no submissions exist', () => {
    renderWithStore(<MainPage />);
    expect(screen.getByText('No submissions yet')).toBeInTheDocument();
    expect(
      screen.getByText(/Fill out some form and the results will appear here/i)
    ).toBeInTheDocument();
  });

  it('renders submission cards when submissions are in the store', () => {
    const submission: SubmissionType = {
      name: 'Alice',
      age: 30,
      email: 'alice@example.com',
      gender: 'female',
      country: 'France',
      image: 'data:image/png;base64,abc',
      terms: true,
    };
    renderWithStore(<MainPage />, { submissions: [submission] });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText(/alice@example\.com/)).toBeInTheDocument();
  });

  it('marks only the last submission as new (isNew=true)', () => {
    const s1: SubmissionType = {
      name: 'Alice',
      age: 30,
      email: 'alice@test.com',
      gender: 'female',
      country: 'France',
      image: 'data:image/png;base64,a',
      terms: true,
    };
    const s2: SubmissionType = {
      name: 'Bob',
      age: 25,
      email: 'bob@test.com',
      gender: 'male',
      country: 'Germany',
      image: 'data:image/png;base64,b',
      terms: true,
    };
    const { container } = renderWithStore(<MainPage />, { submissions: [s1, s2] });
    const cards = container.querySelectorAll('.submission-card');
    expect(cards[0]).not.toHaveClass('new-submission-highlight');
    expect(cards[1]).toHaveClass('new-submission-highlight');
  });

  it('opens Uncontrolled Form modal when "Uncontrolled" button is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore(<MainPage />);

    await user.click(screen.getByText('Uncontrolled'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });
  });

  it('opens RHF modal when "React Hook Form" button is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore(<MainPage />);

    await user.click(screen.getByText('React Hook Form'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore(<MainPage />);

    await user.click(screen.getByText('Uncontrolled'));
    await waitFor(() => screen.getByRole('dialog'));

    await user.click(screen.getByLabelText('Close modal'));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes modal when Escape key is pressed', async () => {
    const user = userEvent.setup();
    renderWithStore(<MainPage />);

    await user.click(screen.getByText('React Hook Form'));
    await waitFor(() => screen.getByRole('dialog'));

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
