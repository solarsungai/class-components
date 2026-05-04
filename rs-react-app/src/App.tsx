import './App.css';
import { Component } from 'react';
import Search from './components/Search';
import Header from './components/Header';
import Results from './components/Results';
import type { AppState, PokemonData, PokemonListResponse } from './types';

const FIRST_PAGE_LIMIT = 20;
const FIRST_PAGE_OFFSET = 0;

class App extends Component<{}, AppState> {
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
    const savedSearchTerm = localStorage.getItem('searchTerm');
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
          {this.state.loading && (
            <div className="loader">Loading...</div>
          )}
        </section>

        <section className="results-section">
          {!this.state.error && !this.state.loading && (
            <Results results={this.state.results} />
          )}
        </section>

        <div className="tools-row">
          <button className="error-test-button" type="button" onClick={this.handleTestErrorClick}>
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

    if (term === this.state.lastSearchTerm) return;

    localStorage.setItem('searchTerm', term);
    this.setState({ loading: true, error: null, lastSearchTerm: term, inputValue: term });

    try {
      if (!term) {
        const response = await fetch(
          `${this.state.serverUrl}?limit=${FIRST_PAGE_LIMIT}&offset=${FIRST_PAGE_OFFSET}`,
        );

        if (!response.ok) {
          throw new Error('Unable to load the first page of Pokemon list');
        }

        const listData: PokemonListResponse = await response.json();
        const results: PokemonData[] = listData.results.map((item) => {
          return {
            name: item.name,
          };
        });

        this.setState({ loading: false, results });
        return;
      }

      const response = await fetch(`${this.state.serverUrl}${term}`);
      if (!response.ok) {
        throw new Error('Pokemon not found');
      }

      const data = await response.json() as {
        name: string;
        sprites?: { front_default: string | null };
        types?: Array<{ type: { name: string } }>;
        height?: number;
        weight?: number;
        base_experience?: number;
        abilities?: Array<{ ability: { name: string } }>;
      };
      const types = Array.isArray(data.types)
        ? data.types.map((typeInfo: { type: { name: string } }) => typeInfo.type.name)
        : [];
      const abilities = Array.isArray(data.abilities)
        ? data.abilities.map((abilityInfo: { ability: { name: string } }) => abilityInfo.ability.name)
        : [];

      const pokemonData: PokemonData = {
        name: data.name,
        image: data.sprites?.front_default ?? undefined,
        types,
        height: data.height,
        weight: data.weight,
        baseExperience: data.base_experience,
        abilities,
      };

      this.setState({ loading: false, results: [pokemonData] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.setState({ loading: false, error: message, results: [] });
    }
  };
}

export default App;
