import { describe, it, expect } from 'vitest';
import getErrorMessage from './getErrorMessage';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

describe('getErrorMessage', () => {
  it('should return error.data when error is FetchBaseQueryError and data is a string', () => {
    const error: FetchBaseQueryError = {
      status: 404,
      data: 'Pokemon not found',
    };

    const result = getErrorMessage(error);
    expect(result).toBe('Pokemon not found');
  });

  it('should return "Request failed" when error is FetchBaseQueryError but data is not a string', () => {
    const error: FetchBaseQueryError = {
      status: 500,
      data: { message: 'Internal Server Error' },
    };

    const result = getErrorMessage(error);
    expect(result).toBe('Request failed');
  });

  it('should return error.message when error is SerializedError', () => {
    const error: SerializedError = {
      name: 'TypeError',
      message: 'Failed to fetch',
    };

    const result = getErrorMessage(error);
    expect(result).toBe('Failed to fetch');
  });

  it('should return "Unknown error" when SerializedError does not have a message', () => {
    const error: SerializedError = {
      name: 'Error',
    };

    const result = getErrorMessage(error);
    expect(result).toBe('Unknown error');
  });
});
