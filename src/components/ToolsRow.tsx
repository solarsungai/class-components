import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import Pagination from '../components/Pagination';
import { POKEMON_PER_PAGE_LIMIT } from '../constants';

export type ToolsRowProps = {
  handlePageChange: (page: number) => void;
  handleTestErrorClick: () => void;
  handleRefresh: () => void;
  page: number;
  count: number;
  loading: boolean;
  error?: FetchBaseQueryError | SerializedError;
};

function ToolsRow({
  handlePageChange,
  handleTestErrorClick,
  handleRefresh,
  page,
  count,
  loading,
  error,
}: ToolsRowProps) {
  return (
    <div className="tools-row">
      {!loading && !error && count > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(count / POKEMON_PER_PAGE_LIMIT)}
          onPageChange={handlePageChange}
        />
      )}
      <button className="error-test-button" type="button" onClick={handleTestErrorClick}>
        Test Error
      </button>
      <button className="refresh-button" type="button" onClick={handleRefresh}>
        Refresh
      </button>
    </div>
  );
}

export default ToolsRow;
