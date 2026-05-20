import '../App.css';
import { useState, useEffect, useRef } from 'react';
import { SERVER_URL, POCKEMON_PER_PAGE_LIMIT } from '../constants';
import Search from '../components/Search';
import Header from '../components/Header';
import Results from '../components/Results';
import Pagination from '../components/Pagination';
import usePokemonSearch from '../hooks/usePokemonSearch';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  Outlet,
  useSearchParams,
  useNavigate,
  useLocation,
} from 'react-router';

function MainPage() {
  const { getSearchTerm } = useLocalStorage();
  const [shouldThrowTestError, setShouldThrowTestError] =
    useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const [inputValue, setInputValue] = useState<string>(
    () => searchFromUrl || (getSearchTerm() ?? '')
  );
  const currentSearchTerm = useRef(searchFromUrl || (getSearchTerm() ?? ''));
  const { results, count, loading, error, search, reset } = usePokemonSearch(
    SERVER_URL,
    page
  );
  const navigate = useNavigate();
  const location = useLocation();
  const isDetailOpen = location.pathname.startsWith('/details/');
  const handleTestErrorClick = () => {
    setShouldThrowTestError(true);
  };

  useEffect(() => {
    currentSearchTerm.current = searchFromUrl;
    void search(searchFromUrl);
  }, [search, searchFromUrl]);

  if (shouldThrowTestError) throw new Error('Test error button triggered');

  return (
    <div className="App">
      <Header />
      <section className="search-section">
        <Search
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          onSearch={() => {
            currentSearchTerm.current = inputValue;
            reset();
            const params = new URLSearchParams({ page: '1' });
            if (inputValue.trim()) params.set('search', inputValue);
            navigate(`/?${params.toString()}`);
            void search(inputValue);
          }}
        />
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loader">Loading...</div>}
      </section>

      <section className="results-section">
        {!error && !loading && (
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
            </div>
            <Outlet />
          </div>
        )}
      </section>

      <div className="tools-row">
        {!loading && !error && count > 0 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(count / POCKEMON_PER_PAGE_LIMIT)}
            onPageChange={(newPage) => {
              const params: Record<string, string> = { page: String(newPage) };
              if (currentSearchTerm.current.trim())
                params.search = currentSearchTerm.current;
              setSearchParams(params);
            }}
          />
        )}
        <button
          className="error-test-button"
          type="button"
          onClick={handleTestErrorClick}
        >
          Test Error Boundary
        </button>
      </div>
    </div>
  );
}

export default MainPage;
