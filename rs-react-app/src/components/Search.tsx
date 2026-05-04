import { Component } from 'react';
import type { SearchProps } from '../types';

class Search extends Component<SearchProps> {
  constructor(props: SearchProps) {
    super(props);
  }

  render() {
    return (
        <>
          <input
              className="search-input"
              type="text"
              placeholder="Search..."
              value={this.props.value}
              onChange={(e) => this.props.onChange(e.target.value)}
            />
            <button onClick={this.props.onSearch}>Search</button>
        </>
    );
  }
}

export default Search;