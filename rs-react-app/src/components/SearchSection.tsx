import Search from './Search';
import getErrorMessage from '../utils/getErrorMessage';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

export type SearchSectionProps = {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSearch: () => void;
  error?: FetchBaseQueryError | SerializedError;
};

function SearchSection({ inputValue, setInputValue, handleSearch, error }: SearchSectionProps) {
  return (
    <section className="search-section">
      <Search
        value={inputValue}
        onChange={(value) => setInputValue(value)}
        onSearch={handleSearch}
      />
      {error && <div className="error-message">{getErrorMessage(error)}</div>}
    </section>
  );
}

export default SearchSection;
