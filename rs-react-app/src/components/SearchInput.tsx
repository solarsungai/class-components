import { Component } from 'react';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
        inputValue: "",
      };
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
            <button>Search</button>
        </>
    );
  }
}

export default Search;