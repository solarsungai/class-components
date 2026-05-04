import './App.css';
import { Component } from 'react';
import Search from './components/Search';
import Header from './components/Header';
import Results from './components/Results';

type AppState = {
  serverUrl: string;
  inputValue: string;
  results: PokemonData[];
  loading: boolean;
  error: string | null;
  lastSearchTerm: string;
};

type PokemonData = {
  name: string;
  id: number;
  image: string;
  types: string[];
  height: number;
  weight: number;
  baseExperience: number;
  abilities: string[];
};

class App extends Component<{}, AppState> {
  state = {
    serverUrl: "https://pokeapi.co/api/v2/pokemon/",
    inputValue: "",
    results: [],
    loading: false,
    error: null,
    lastSearchTerm: ""
  };

  render() {
    return (
      <div className="App">
        <Header />
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
        {!this.state.error && !this.state.loading && (
          <Results results={this.state.results} />
        )}
      </div>
    );
  }

  handleSearch = async (searchTerm: string) => {
    const term = searchTerm.trim().toLowerCase();

    if (term === this.state.lastSearchTerm) return;
    if (!term) {
      this.setState({ error: "Please enter a search term." });
      return;
    }
    this.setState({ loading: true, error: null, lastSearchTerm: term });

    try {
      const response = await fetch(`${this.state.serverUrl}${term}`);
      if (!response.ok) {
        throw new Error("Pokemon not found");
      }
      const data = await response.json();
      console.log(data);
      const pokemonData: PokemonData = {
        name: data.name,
        id: data.id,
        image: data.sprites.front_default,
        types: data.types.map((typeInfo: any) => typeInfo.type.name),
        height: data.height,
        weight: data.weight,
        baseExperience: data.base_experience,
        abilities: data.abilities.map((abilityInfo: any) => abilityInfo.ability.name),
      };
      this.setState({ loading: false, results: [pokemonData] });
    } catch (error) {
      console.log(error);
      const message = error instanceof Error ? error.message : "Unknown error";
      this.setState({ loading: false, error: message });
    }
  };
}

export default App;
