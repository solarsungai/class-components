import Search from './Search';
import getErrorMessage from '../utils/getErrorMessage';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

export type SearchSectionProps = {
  initialValue: string;
  handleSearch: (value: string) => void;
  error?: FetchBaseQueryError | SerializedError;
};

function SearchSection({ initialValue, handleSearch, error }: SearchSectionProps) {
  return (
    <section className="search-section">
      <Search key={initialValue} defaultValue={initialValue} onSearch={handleSearch} />
      {error && <div className="error-message">{getErrorMessage(error)}</div>}
    </section>
  );
}

export default SearchSection;
