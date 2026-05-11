import { describe, it, expect, beforeEach } from 'vitest';
import { loadSearchTerm, saveSearchTerm } from './storage';

describe('storage service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const MOCK_TERM = 'pikachu';

  it('should save the search term to localStorage', () => {
    saveSearchTerm(MOCK_TERM);
    expect(localStorage.getItem('searchTerm')).toBe(MOCK_TERM);
  });

  it('should return the saved term when loadSearchTerm is called', () => {
    localStorage.setItem('searchTerm', MOCK_TERM);
    const result = loadSearchTerm();
    expect(result).toBe(MOCK_TERM);
  });

  it('should return null if no search term is saved', () => {
    const result = loadSearchTerm();
    expect(result).toBeNull();
  });
});
