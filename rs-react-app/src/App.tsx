import './App.css';
import { Component } from 'react';
import Search from './components/SearchInput';
import Header from './components/Header';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        inputValue: "",
        results: [],
        loading: false,
        error: null,
        lastSearchTerm: ""
      };
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Search
          value={this.state.inputValue}
          onChange={(value) => this.setState({ inputValue: value })}
          onSearch={() => this.handleSearch(this.state.inputValue)}
        />
      </div>
    );
  }

  handleSearch = (searchTerm: string) => {
    console.log("Searching for:", searchTerm);
  };
}

export default App;
