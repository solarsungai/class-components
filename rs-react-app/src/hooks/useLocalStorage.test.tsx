import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

describe('storage service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const MOCK_TERM = 'pikachu';

  it('should save the search term to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage());
    result.current.setSearchTerm(MOCK_TERM);
    expect(localStorage.getItem('searchTerm')).toBe(MOCK_TERM);
  });

  it('should return the saved term when loadSearchTerm is called', () => {
    localStorage.setItem('searchTerm', MOCK_TERM);
    const { result } = renderHook(() => useLocalStorage());
    const term = result.current.getSearchTerm();
    expect(term).toBe(MOCK_TERM);
  });

  it('should return null if no search term is saved', () => {
    const { result } = renderHook(() => useLocalStorage());
    const term = result.current.getSearchTerm();
    expect(term).toBeNull();
  });
});
