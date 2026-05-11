import './App.css';
import { Component } from 'react';
import Search from './components/Search';
import Header from './components/Header';
import Results from './components/Results';
import type { AppState } from './types';
import { loadSearchTerm, saveSearchTerm } from './services/storage';
import { performPokemonSearch } from './services/search';

class App extends Component<Record<string, never>, AppState> {
  state = {
    serverUrl: 'https://pokeapi.co/api/v2/pokemon/',
    inputValue: '',
    results: [],
    loading: false,
    error: null,
    lastSearchTerm: null,
    shouldThrowTestError: false,
  };

  componentDidMount() {
    const savedSearchTerm = loadSearchTerm();
    const initialSearchTerm = savedSearchTerm ?? '';

    this.setState({ inputValue: initialSearchTerm }, () => {
      void this.handleSearch(initialSearchTerm);
    });
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
    await performPokemonSearch({
      searchTerm,
      lastSearchTerm: this.state.lastSearchTerm,
      serverUrl: this.state.serverUrl,
      saveSearchTerm,
      onStart: (term) => {
        this.setState({
          loading: true,
          error: null,
          lastSearchTerm: term,
          inputValue: term,
        });
      },
      onSuccess: (results) => {
        this.setState({ loading: false, results });
      },
      onError: (message) => {
        this.setState({ loading: false, error: message, results: [] });
      },
    });
  };
}

export default App;
