'use client';
import { useState } from 'react';

export interface IPagination {
  pageSize: number;
  pageIndex: number;
}

export function usePagination(initialSize = 10) {
  const [pagination, setPagination] = useState<IPagination>({
    pageSize: initialSize,
    pageIndex: 0,
  });
  const { pageSize, pageIndex } = pagination;

  const resetPagination = () => {
    setPagination({ pageSize: initialSize, pageIndex: 0 });
  };

  return {
    onPaginationChange: setPagination,
    pagination,
    limit: pageSize,
    skip: pageSize * pageIndex,
    page: pageIndex + 1,
    setPagination,
    resetPagination,
  };
}
