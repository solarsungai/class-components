import { describe, it, expect } from 'vitest';
import createSearchQueryString from './navigation';
import { URL_PARAMS } from '../constants';

describe('createSearchQueryString', () => {
  it('should generate a query string with only the page parameter', () => {
    const result = createSearchQueryString({ page: 2 });
    
    expect(result).toBe(`${URL_PARAMS.PAGE}=2`);
  });

  it('should generate a query string with both page and search parameters', () => {
    const result = createSearchQueryString({ page: 1, search: 'pikachu' });
    
    expect(result).toBe(`${URL_PARAMS.PAGE}=1&${URL_PARAMS.SEARCH}=pikachu`);
  });

  it('should trim whitespace from the search parameter', () => {
    const result = createSearchQueryString({ page: 3, search: '  bulbasaur  ' });
    
    expect(result).toBe(`${URL_PARAMS.PAGE}=3&${URL_PARAMS.SEARCH}=bulbasaur`);
  });

  it('should not include the search parameter if it is empty, spaces-only, or null', () => {
    const resultWithEmpty = createSearchQueryString({ page: 1, search: '' });
    const resultWithSpaces = createSearchQueryString({ page: 1, search: '   ' });
    const resultWithNull = createSearchQueryString({ page: 1, search: null });

    const expected = `${URL_PARAMS.PAGE}=1`;

    expect(resultWithEmpty).toBe(expected);
    expect(resultWithSpaces).toBe(expected);
    expect(resultWithNull).toBe(expected);
  });
});