import '../App.css';
import { useState } from 'react';
import { URL_PARAMS, POKEMON_PER_PAGE_LIMIT, DEFAULT_PAGE } from '../constants';
import Search from '../components/Search';
import Header from '../components/Header';
import Results from '../components/Results';
import Flyout from '../components/Flyout';
import Pagination from '../components/Pagination';
import useSearchTermLocalStorage from '../hooks/useSearchTermLocalStorage';
import createSearchQueryString from '../utils/navigation';
import {
  Outlet,
  useSearchParams,
  useNavigate,
  useLocation,
} from 'react-router';
import {
  pokemonApi,
  useGetPokemonByPageQuery,
  useGetPokemonByNameQuery,
} from '../services/pokemonApi';
import getErrorMessage from '../utils/getErrorMessage';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

function MainPage() {
  const { getSearchTerm } = useSearchTermLocalStorage();
  const [shouldThrowTestError, setShouldThrowTestError] =
    useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = (searchParams.get(URL_PARAMS.SEARCH) ?? '')
    .trim()
    .toLowerCase();
  const page = Number(searchParams.get(URL_PARAMS.PAGE)) || DEFAULT_PAGE;
  const [inputValue, setInputValue] = useState<string>(
    () => searchFromUrl || (getSearchTerm() ?? '')
  );

  const hasSearch = Boolean(searchFromUrl);
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
  const results = hasSearch
    ? searchData
      ? [searchData]
      : []
    : (pageData?.results ?? []);
  const count = hasSearch ? (searchData ? 1 : 0) : (pageData?.count ?? 0);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const isDetailOpen = location.pathname.startsWith('/details/');
  const handleTestErrorClick = () => {
    setShouldThrowTestError(true);
  };
  const handleRefresh = () => {
    dispatch(pokemonApi.util.invalidateTags(['PokemonList', 'PokemonDetail']));
  };

  if (shouldThrowTestError) throw new Error('Test error button triggered');

  return (
    <div className="App">
      <Header />
      <section className="search-section">
        <Search
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          onSearch={() => {
            const queryString = createSearchQueryString({
              page: DEFAULT_PAGE,
              search: inputValue,
            });
            navigate(`/?${queryString}`);
          }}
        />
        {error && <div className="error-message">{getErrorMessage(error)}</div>}
      </section>

      <section className="results-section">
        {!error && (
          <div className="split-view">
            <div
              className="left-panel"
              onClick={(e) => {
                if (
                  isDetailOpen &&
                  !(e.target as HTMLElement).closest('.pokemon-card')
                ) {
const queryString = createSearchQueryString({
        page,
        search: searchFromUrl,
      });
      navigate(`/?${queryString}`);
                }
              }}
            >
              <Results
                results={results}
                onSelect={(name) => {
const queryString = createSearchQueryString({
        page,
        search: searchFromUrl,
      });
      navigate(`/details/${name}?${queryString}`);
                }}
              />
              {loading && (
                <div className="loader loader--overlay">Loading...</div>
              )}
            </div>
            <Outlet />
          </div>
        )}
      </section>

      <div className="tools-row">
        {!loading && !error && count > 0 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(count / POKEMON_PER_PAGE_LIMIT)}
            onPageChange={(newPage) => {
              const params: Record<string, string> = {
                [URL_PARAMS.PAGE]: String(newPage),
              };
              if (searchFromUrl) params[URL_PARAMS.SEARCH] = searchFromUrl;
              setSearchParams(params);
            }}
          />
        )}
        <button
          className="error-test-button"
          type="button"
          onClick={handleTestErrorClick}
        >
          Test Error
        </button>
        <button
          className="refresh-button"
          type="button"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>

      <Flyout />
    </div>
  );
}

export default MainPage;
