import { Outlet } from 'react-router';
import Results from '../components/Results';
import type { PokemonData } from '../types';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

export type ResultsSectionProps = {
  handleCloseDetails: () => void;
  handleSelect: (name: string) => void;
  results: PokemonData[];
  loading: boolean;
  error?: FetchBaseQueryError | SerializedError;
};

function ResultsSection({
  handleCloseDetails,
  handleSelect,
  results,
  loading,
  error,
}: ResultsSectionProps) {
  return (
    <section className="results-section">
      {!error && (
        <div className="split-view">
          <div className="left-panel" onClick={handleCloseDetails}>
            <Results results={results} onSelect={handleSelect} />
            {loading && <div className="loader loader--overlay">Loading...</div>}
          </div>
          <Outlet />
        </div>
      )}
    </section>
  );
}

export default ResultsSection;
