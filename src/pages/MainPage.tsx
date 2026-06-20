'use client'

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { DEFAULT_PAGE } from '@/constants';
import SearchSection from '@/components/SearchSection';
import ResultsSection from '@/components/ResultsSection';
import ToolsRow from '@/components/ToolsRow';
import Flyout from '@/components/Flyout';
import usePokemonSearch from '@/hooks/usePokemonSearch';
import createSearchQueryString from '@/utils/navigation';
import { pokemonApi } from '@/services/pokemonApi';

function MainPage() {
  const {
    searchFromUrl,
    page,
    initialSearchValue,
    loading,
    error,
    results,
    count,
    handlePageChange,
  } = usePokemonSearch();

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const [shouldThrowTestError, setShouldThrowTestError] = useState<boolean>(false);
  if (shouldThrowTestError) throw new Error('Test error button triggered');

  function handleSearch(value: string): void {
    const queryString = createSearchQueryString({
      page: DEFAULT_PAGE,
      search: value,
    });
    router.push(`/?${queryString}`);
  }

  function handleCloseDetails(): void {
    const isDetailOpen = pathname.startsWith('/details/');
    if (isDetailOpen) {
      const queryString = createSearchQueryString({
        page,
        search: searchFromUrl,
      });
      router.push(`/?${queryString}`);
    }
  }

  function handleSelect(name: string): void {
    const queryString = createSearchQueryString({
      page,
      search: searchFromUrl,
    });
    router.push(`/details/${name}?${queryString}`);
  }

  const handleTestErrorClick = () => {
    setShouldThrowTestError(true);
  };
  const handleRefresh = () => {
    dispatch(pokemonApi.util.invalidateTags(['PokemonList', 'PokemonDetail']));
  };

  return (
    <div className="App">
      <SearchSection initialValue={initialSearchValue} handleSearch={handleSearch} error={error} />
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
