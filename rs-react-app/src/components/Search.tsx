import type { SearchProps } from '../types';

function Search({ value, onChange, onSearch }: SearchProps) {
  return (
    <div className="search-controls">
      <input
        className="search-input"
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch();
        }}
      />
      <button className="search-button" onClick={onSearch}>
        Search
      </button>
    </div>
  );
}

export default Search;
