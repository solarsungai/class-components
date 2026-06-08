import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SubmissionItem from './SubmissionItem';
import type { SubmissionType } from '../store/submissionsSlice';

const submission: SubmissionType = {
  name: 'Alice',
  age: 28,
  email: 'alice@example.com',
  gender: 'female',
  country: 'France',
  image: 'data:image/png;base64,abc',
  terms: true,
};

describe('SubmissionItem', () => {
  it('renders submission data correctly', () => {
    render(<SubmissionItem submission={submission} isNew={false} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText(/alice@example\.com/)).toBeInTheDocument();
    expect(screen.getByText(/France/)).toBeInTheDocument();
    expect(screen.getByText(/28/)).toBeInTheDocument();
    expect(screen.getByText(/female/i)).toBeInTheDocument();
  });

  it('applies new-submission-highlight class when isNew=true', () => {
    const { container } = render(<SubmissionItem submission={submission} isNew={true} />);
    expect(container.firstChild).toHaveClass('new-submission-highlight');
  });

  it('does not apply new-submission-highlight class when isNew=false', () => {
    const { container } = render(<SubmissionItem submission={submission} isNew={false} />);
    expect(container.firstChild).not.toHaveClass('new-submission-highlight');
  });

  it('renders the user image with alt text', () => {
    render(<SubmissionItem submission={submission} isNew={false} />);
    const img = screen.getByAltText('User');
    expect(img).toHaveAttribute('src', 'data:image/png;base64,abc');
  });
});
