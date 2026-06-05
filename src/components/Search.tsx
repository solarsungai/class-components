import { useRef } from 'react';

export type SearchProps = {
  defaultValue: string;
  onSearch: (value: string) => void;
};

function Search({ defaultValue, onSearch }: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTriggerSearch = () => {
    if (inputRef.current) onSearch(inputRef.current.value.trim());
  };

  return (
    <div className="search-controls">
      <input
        ref={inputRef}
        className="search-input"
        type="text"
        placeholder="Search..."
        defaultValue={defaultValue}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleTriggerSearch();
        }}
      />
      <button className="search-button" onClick={handleTriggerSearch}>
        Search
      </button>
    </div>
  );
}

export default Search;
