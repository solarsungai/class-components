import { describe, it, expect } from 'vitest';
import { store } from './index';
import countries from '../constants/countries';

describe('store', () => {
  it('has submissions and countries slices', () => {
    const state = store.getState();
    expect(state.submissions).toEqual([]);
    expect(state.countries).toEqual(countries);
  });

  it('has correct dispatch type', () => {
    expect(typeof store.dispatch).toBe('function');
  });
});
