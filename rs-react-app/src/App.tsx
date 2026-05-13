import './App.css';
import { Component } from 'react';
import Search from './components/Search';
import Header from './components/Header';
import Results from './components/Results';
import type { AppState } from './types';
import { loadSearchTerm, saveSearchTerm } from './services/storage';
import { performPokemonSearch } from './services/search';

class App extends Component<Record<string, never>, AppState> {
  private readonly serverUrl = 'https://pokeapi.co/api/v2/pokemon/';
  private lastSearchTerm: string | null = null;

  state: AppState = {
    inputValue: '',
    results: [],
    loading: false,
    error: null,
    shouldThrowTestError: false,
  };

  componentDidMount() {
    const initialTerm = loadSearchTerm() ?? '';
    this.setState(
      { inputValue: initialTerm },
      () => void this.handleSearch(initialTerm)
    );
  }

  render() {
    if (this.state.shouldThrowTestError) {
      throw new Error('Test error button triggered');
    }

    return (
      <div className="App">
        <Header />
        <section className="search-section">
          <Search
            value={this.state.inputValue}
            onChange={(value) => this.setState({ inputValue: value })}
            onSearch={() => this.handleSearch(this.state.inputValue)}
          />
          {this.state.error && (
            <div className="error-message">{this.state.error}</div>
          )}
          {this.state.loading && <div className="loader">Loading...</div>}
        </section>

        <section className="results-section">
          {!this.state.error && !this.state.loading && (
            <Results results={this.state.results} />
          )}
        </section>

        <div className="tools-row">
          <button
            className="error-test-button"
            type="button"
            onClick={this.handleTestErrorClick}
          >
            Test Error Boundary
          </button>
        </div>
      </div>
    );
  }

  handleTestErrorClick = () => {
    this.setState({ shouldThrowTestError: true });
  };

  handleSearch = async (searchTerm: string) => {
    const term = searchTerm.trim().toLowerCase();

    if (term === this.lastSearchTerm) return;

    this.lastSearchTerm = term;
    saveSearchTerm(term);
    this.setState({ loading: true, error: null, inputValue: term });

    try {
      const results = await performPokemonSearch(term, this.serverUrl);
      this.setState({ loading: false, results });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.setState({ loading: false, error: message, results: [] });
    }
  };
}

export default App;
