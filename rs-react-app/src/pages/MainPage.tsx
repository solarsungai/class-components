import '../App.css';
import { useState } from 'react';
import { POKEMON_PER_PAGE_LIMIT } from '../constants';
import Search from '../components/Search';
import Header from '../components/Header';
import Results from '../components/Results';
import Flyout from '../components/Flyout';
import Pagination from '../components/Pagination';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  Outlet,
  useSearchParams,
  useNavigate,
  useLocation,
} from 'react-router';
import { useGetPokemonByPageQuery, useGetPokemonByNameQuery } from '../services/pokemonApi';
import { pokemonApi } from '../services/pokemonApi';
import getErrorMessage from '../utils/getErrorMessage';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

function MainPage() {
  const { getSearchTerm } = useLocalStorage();
  const [shouldThrowTestError, setShouldThrowTestError] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = (searchParams.get('search') ?? '').trim().toLowerCase();
  const page = Number(searchParams.get('page')) || 1;
  const [inputValue, setInputValue] = useState<string>(() => searchFromUrl || (getSearchTerm() ?? ''));

  const hasSearch = Boolean(searchFromUrl);
  const { data: pageData, isFetching: isPageFetching, error: pageError } = useGetPokemonByPageQuery(page, { skip: hasSearch });
  const { data: searchData, isFetching: isSearchFetching, error: searchError } = useGetPokemonByNameQuery(searchFromUrl, { skip: !hasSearch });
  const loading = hasSearch ? isSearchFetching : isPageFetching;
  const error = hasSearch ? searchError : pageError;
  const results = hasSearch ? (searchData ? [searchData] : []) : (pageData?.results ?? []);
  const count = hasSearch ? (searchData ? 1 : 0) : (pageData?.count ?? 0);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const isDetailOpen = location.pathname.startsWith('/details/');
  const handleTestErrorClick = () => {setShouldThrowTestError(true);};
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
            const params = new URLSearchParams({ page: '1' });
            if (inputValue.trim()) params.set('search', inputValue);
            navigate(`/?${params.toString()}`);
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
                  const params = new URLSearchParams({ page: String(page) });
                  if (searchFromUrl) params.set('search', searchFromUrl);
                  navigate(`/?${params.toString()}`);
                }
              }}
            >
              <Results
                results={results}
                onSelect={(name) => {
                  const params = new URLSearchParams({ page: String(page) });
                  if (searchFromUrl) params.set('search', searchFromUrl);
                  navigate(`/details/${name}?${params.toString()}`);
                }}
              />
              {loading && <div className="loader loader--overlay">Loading...</div>}
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
              const params: Record<string, string> = { page: String(newPage) };
              if (searchFromUrl) params.search = searchFromUrl;
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
