import './App.css';
import { useState, useEffect, useRef } from 'react';
import Search from './components/Search';
import Header from './components/Header';
import Results from './components/Results';
import usePokemonSearch from './hooks/usePokemonSearch';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const serverUrl = 'https://pokeapi.co/api/v2/pokemon/';
  const { getSearchTerm } = useLocalStorage();
  const [inputValue, setInputValue] = useState<string>(
    () => getSearchTerm() ?? ''
  );
  const initialTerm = useRef(inputValue);
  const [shouldThrowTestError, setShouldThrowTestError] =
    useState<boolean>(false);
  const { results, loading, error, search } = usePokemonSearch(serverUrl);

  const handleTestErrorClick = () => {
    setShouldThrowTestError(true);
  };

  useEffect(() => {
    void search(initialTerm.current);
  }, [search]);

  if (shouldThrowTestError) throw new Error('Test error button triggered');

  return (
    <div className="App">
      <Header />
      <section className="search-section">
        <Search
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          onSearch={() => search(inputValue)}
        />
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loader">Loading...</div>}
      </section>

      <section className="results-section">
        {!error && !loading && <Results results={results} />}
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
  );
}

export default App;
