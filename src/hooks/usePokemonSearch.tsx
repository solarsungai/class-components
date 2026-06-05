import useSearchTermLocalStorage from '../hooks/useSearchTermLocalStorage';
import { URL_PARAMS, DEFAULT_PAGE } from '../constants';
import { useSearchParams } from 'react-router';
import { useGetPokemonByPageQuery, useGetPokemonByNameQuery } from '../services/pokemonApi';

function usePokemonSearch() {
  const { getSearchTerm } = useSearchTermLocalStorage();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = (searchParams.get(URL_PARAMS.SEARCH) ?? '').trim().toLowerCase();
  const initialSearchValue = searchFromUrl || (getSearchTerm() ?? '');
  const hasSearch = Boolean(searchFromUrl);
  const page = Number(searchParams.get(URL_PARAMS.PAGE)) || DEFAULT_PAGE;

  const {
    data: pageData,
    isFetching: isPageFetching,
    error: pageError,
  } = useGetPokemonByPageQuery(page, { skip: hasSearch });
  const {
    data: searchData,
    isFetching: isSearchFetching,
    error: searchError,
  } = useGetPokemonByNameQuery(searchFromUrl, { skip: !hasSearch });
  const loading = hasSearch ? isSearchFetching : isPageFetching;
  const error = hasSearch ? searchError : pageError;
  const results = hasSearch ? (searchData ? [searchData] : []) : (pageData?.results ?? []);
  const count = hasSearch ? (searchData ? 1 : 0) : (pageData?.count ?? 0);

  function handlePageChange(newPage: number) {
    const params: Record<string, string> = {
      [URL_PARAMS.PAGE]: String(newPage),
    };
    if (searchFromUrl) params[URL_PARAMS.SEARCH] = searchFromUrl;
    setSearchParams(params);
  }

  return {
    searchFromUrl,
    page,
    initialSearchValue,
    loading,
    error,
    results,
    count,
    handlePageChange,
  };
}

export default usePokemonSearch;
