import { URL_PARAMS } from '../constants';

interface SearchUrlParams {
  page: number | string;
  search?: string | null;
}

function createSearchQueryString({ page, search }: SearchUrlParams): string {
  const params = new URLSearchParams({ [URL_PARAMS.PAGE]: String(page) });
  if (search?.trim()) params.set(URL_PARAMS.SEARCH, search.trim());
  return params.toString();
}

export default createSearchQueryString;
