//@ts-nocheck
import Card from 'components/card';
import CardMenu from 'components/card/CardMenu';

import React from 'react';

import { Button } from '@material-tailwind/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { FiLoader } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { certificateList } from '../../../actions/certificate';

import { Event, Person } from '.prisma/client';

type CertificateTableRow = {
  id: number;
  cert_url: string;
  event: Event;
  person: Person;
};

const columnHelper = createColumnHelper<CertificateTableRow>();

// const columns = columnsDataCheck;
export default function AdminCertificateTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data: certificateResponse, isFetching } = useQuery({
    queryFn: () => {
      return certificateList();
    },
    queryKey: ['certificate-table'],
  });

  const columns = [
    columnHelper.accessor('id', {
      id: 'id',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">#ID</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor('event.name', {
      id: 'event.id',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Event Name
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <p>{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor('person.name', {
      id: 'person.id',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Person Name
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
  ]; // eslint-disable-next-line

  const table = useReactTable({
    data: certificateResponse || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  if (isFetching) {
    return <FiLoader className="mx-auto mt-8 size-6 animate-spin" />;
  }

  return (
    <Card extra={'w-full h-full px-6 pb-6 sm:overflow-x-auto'}>
      <div className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Certificate Table
        </div>
        <CardMenu />
      </div>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <div className="">
          <Button>Test Generate</Button>
        </div>
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b border-gray-200 pb-2 pr-4 pt-4 text-start dark:border-white/30"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: '',
                          desc: '',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {!isFetching &&
              table
                .getRowModel()
                .rows.slice(0, 5)
                .map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td
                            key={cell.id}
                            className="min-w-[150px] border-white/0 py-3  pr-4"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
