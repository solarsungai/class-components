import '../App.css';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { DEFAULT_PAGE } from '../constants';
import Header from '../components/Header';
import SearchSection from '../components/SearchSection';
import ResultsSection from '../components/ResultsSection';
import ToolsRow from '../components/ToolsRow';
import Flyout from '../components/Flyout';
import usePokemonSearch from '../hooks/usePokemonSearch';
import createSearchQueryString from '../utils/navigation';
import { pokemonApi } from '../services/pokemonApi';

function MainPage() {
  const {
    searchFromUrl,
    page,
    inputValue,
    setInputValue,
    loading,
    error,
    results,
    count,
    handlePageChange,
  } = usePokemonSearch();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [shouldThrowTestError, setShouldThrowTestError] = useState<boolean>(false);
  if (shouldThrowTestError) throw new Error('Test error button triggered');

  function handleSearch(): void {
    const queryString = createSearchQueryString({
      page: DEFAULT_PAGE,
      search: inputValue,
    });
    navigate(`/?${queryString}`);
  }

  function handleCloseDetails(event: React.MouseEvent<HTMLDivElement>): void {
    const isDetailOpen = location.pathname.startsWith('/details/');
    if (isDetailOpen && !(event.target as HTMLElement).closest('.pokemon-card')) {
      const queryString = createSearchQueryString({
        page,
        search: searchFromUrl,
      });
      navigate(`/?${queryString}`);
    }
  }

  function handleSelect(name: string): void {
    const queryString = createSearchQueryString({
      page,
      search: searchFromUrl,
    });
    navigate(`/details/${name}?${queryString}`);
  }

  const handleTestErrorClick = () => {
    setShouldThrowTestError(true);
  };
  const handleRefresh = () => {
    dispatch(pokemonApi.util.invalidateTags(['PokemonList', 'PokemonDetail']));
  };

  return (
    <div className="App">
      <Header />
      <SearchSection
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSearch={handleSearch}
        error={error}
      />
      <ResultsSection
        handleCloseDetails={handleCloseDetails}
        handleSelect={handleSelect}
        results={results}
        loading={loading}
        error={error}
      />
      <ToolsRow
        handlePageChange={handlePageChange}
        handleTestErrorClick={handleTestErrorClick}
        handleRefresh={handleRefresh}
        page={page}
        count={count}
        loading={loading}
        error={error}
      />
      <Flyout />
    </div>
  );
}

export default MainPage;
