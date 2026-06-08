import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createTestStore } from '../test-utils';
import useCountryAutocomplete from './useCountryAutocomplete';

function makeWrapper(store: ReturnType<typeof createTestStore>) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

describe('useCountryAutocomplete', () => {
  it('starts with empty countryInput and all countries in filteredCountries', () => {
    const store = createTestStore();
    const { result } = renderHook(() => useCountryAutocomplete(), {
      wrapper: makeWrapper(store),
    });
    expect(result.current.countryInput).toBe('');
    expect(result.current.filteredCountries.length).toBeGreaterThan(0);
  });

  it('filters countries case-insensitively when input is set', () => {
    const store = createTestStore();
    const { result } = renderHook(() => useCountryAutocomplete(), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      result.current.setCountryInput('ger');
    });

    expect(result.current.filteredCountries).toContain('Germany');
    expect(result.current.filteredCountries).not.toContain('France');
  });

  it('returns empty array when no countries match', () => {
    const store = createTestStore();
    const { result } = renderHook(() => useCountryAutocomplete(), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      result.current.setCountryInput('zzz_no_match');
    });

    expect(result.current.filteredCountries).toHaveLength(0);
  });

  it('trims whitespace when filtering', () => {
    const store = createTestStore();
    const { result } = renderHook(() => useCountryAutocomplete(), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      result.current.setCountryInput('  France  ');
    });

    expect(result.current.filteredCountries).toContain('France');
  });

  it('exposes a ref for the country input element', () => {
    const store = createTestStore();
    const { result } = renderHook(() => useCountryAutocomplete(), {
      wrapper: makeWrapper(store),
    });

    expect(result.current.countryInputRef).toBeDefined();
    expect(result.current.countryInputRef.current).toBeNull();
  });
});
