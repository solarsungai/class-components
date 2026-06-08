import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createTestStore } from '../test-utils';
import useFormSubmit from './useFormSubmit';

vi.mock('../utils/toBase64', () => ({
  default: vi.fn().mockResolvedValue('data:image/png;base64,mockedBase64'),
}));

function makeWrapper(store: ReturnType<typeof createTestStore>) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

const sampleData = {
  name: 'John',
  age: 25,
  email: 'john@example.com',
  gender: 'male',
  country: 'Germany',
  image: new File(['content'], 'photo.png', { type: 'image/png' }),
  terms: true,
};

describe('useFormSubmit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls onClose immediately after converting image', async () => {
    const store = createTestStore();
    const onClose = vi.fn();

    const { result } = renderHook(() => useFormSubmit(onClose), {
      wrapper: makeWrapper(store),
    });

    await act(async () => {
      await result.current(sampleData);
    });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('dispatches addSubmission after 200ms timeout', async () => {
    const store = createTestStore();
    const onClose = vi.fn();

    const { result } = renderHook(() => useFormSubmit(onClose), {
      wrapper: makeWrapper(store),
    });

    await act(async () => {
      await result.current(sampleData);
    });

    expect(store.getState().submissions).toHaveLength(0);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(store.getState().submissions).toHaveLength(1);
    const submission = store.getState().submissions[0];
    expect(submission.name).toBe('John');
    expect(submission.age).toBe(25);
    expect(submission.email).toBe('john@example.com');
    expect(submission.gender).toBe('male');
    expect(submission.country).toBe('Germany');
    expect(submission.terms).toBe(true);
    expect(submission.image).toBe('data:image/png;base64,mockedBase64');
  });
});
