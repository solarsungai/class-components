import './App.css';
import { useState, useEffect, useRef, useMemo } from 'react';
import Search from './components/Search';
import Header from './components/Header';
import Results from './components/Results';
import type { PokemonData } from './types';
import { loadSearchTerm, saveSearchTerm } from './services/storage';
import { performPokemonSearch } from './services/search';

function App () {
  const serverUrl = 'https://pokeapi.co/api/v2/pokemon/';
  const lastSearchTerm = useRef<string | null>(null);
  const initialTerm = useMemo(() => loadSearchTerm() ?? '', []);
  const [inputValue, setInputValue] = useState<string>(initialTerm);
  const [results, setResults] = useState<PokemonData[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldThrowTestError, setShouldThrowTestError] = useState<boolean>(false);

    const handleSearch = async (searchTerm: string) => {
    const term = searchTerm.trim().toLowerCase();
    if (term === lastSearchTerm.current) return;

    lastSearchTerm.current = term;
    saveSearchTerm(term);
    setLoading(true);
    setInputValue(term);

    try {
      const results = await performPokemonSearch(term, serverUrl);
      setLoading(false);
      setResults(results);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setLoading(false);
      setError(message);
      setResults([]);
    }
  };

  useEffect(() => {
    handleSearch(initialTerm);
}, [initialTerm]);

  const handleTestErrorClick = () => {
    setShouldThrowTestError(true);
  };

  if (shouldThrowTestError) throw new Error('Test error button triggered');

  return (
      <div className="App">
        <Header />
        <section className="search-section">
          <Search
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            onSearch={() => handleSearch(inputValue)}
          />
          {error && (
            <div className="error-message">{error}</div>
          )}
          {loading && <div className="loader">Loading...</div>}
        </section>

        <section className="results-section">
          {!error && !loading && (
            <Results results={results} />
          )}
        </section>

        <div className="tools-row">
          <button
            className="error-test-button"
            type="button"
            onClick={handleTestErrorClick}
          >
            Test Error Boundary
          </button>
        </div>
      </div>
)};

export default App;