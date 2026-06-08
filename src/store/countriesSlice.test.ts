import { describe, it, expect } from 'vitest';
import countriesReducer from './countriesSlice';
import countries from '../constants/countries';

describe('countriesSlice', () => {
  it('returns the full countries list as initial state', () => {
    const state = countriesReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(countries);
    expect(state.length).toBeGreaterThan(0);
  });

  it('state is unchanged for unknown actions', () => {
    const state = countriesReducer(countries, { type: 'UNKNOWN' });
    expect(state).toEqual(countries);
  });
});
