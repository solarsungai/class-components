import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

function getErrorMessage(error: FetchBaseQueryError | SerializedError): string {
  if ('status' in error) {
    return typeof error.data === 'string' ? error.data : 'Request failed';
  }
  return error.message ?? 'Unknown error';
}

export default getErrorMessage;