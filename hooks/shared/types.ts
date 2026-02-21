import type { ErrorLike } from '@apollo/client';

/** Standard return shape for mutation hooks */
export interface MutationHookResult<TFn> {
  execute: TFn;
  loading: boolean;
}

/** Standard return shape for query hooks */
export interface QueryHookResult<T> {
  data: T | undefined;
  loading: boolean;
  error?: ErrorLike;
  refetch: () => void;
}

/** Standard return shape for paginated query hooks */
export interface PaginatedQueryHookResult<T> extends QueryHookResult<T[]> {
  total: number;
  page: number;
  totalPages: number;
}
