import { Component } from 'react';
import type { SearchProps } from '../types';

class Search extends Component<SearchProps> {
  constructor(props: SearchProps) {
    super(props);
  }

  render() {
    return (
      <div className="search-controls">
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
          value={this.props.value}
          onChange={(e) => this.props.onChange(e.target.value)}
        />
        <button className="search-button" onClick={this.props.onSearch}>
          Search
        </button>
      </div>
    );
  }
}

export default Search;
