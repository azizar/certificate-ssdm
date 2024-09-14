import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button, Option, Select } from '@material-tailwind/react';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    // <div className="flex items-center justify-center px-2">
    //   <div className="flex-1 text-sm text-muted-foreground">
    //     {table.getFilteredSelectedRowModel().rows.length} of{" "}
    //     {table.getFilteredRowModel().rows.length} row(s) selected.
    //   </div>

    // </div>
    <div className="flex w-full items-center justify-between space-x-6 lg:space-x-8">
      <div className="flex items-center space-x-2">
        <Select label={'Rows per page'}>
          <Option value={'10'}>10</Option>
          <Option value={'25'}>25</Option>
          <Option value={'50'}>50</Option>
          <Option value={'100'}>100</Option>
        </Select>
      </div>
      <div className="flex items-center justify-center text-sm font-medium">
        Page {table.getState().pagination.pageIndex + 1} of{' '}
        {table.getPageCount()}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant={'outlined'}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          size={'sm'}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outlined"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          size={'sm'}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outlined"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          size={'sm'}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outlined"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          size={'sm'}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
