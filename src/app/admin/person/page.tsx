//@ts-nocheck
'use client';
import Card from 'components/card';
import CardMenu from 'components/card/CardMenu';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import axios from 'axios';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useQuery } from 'react-query';

import { Button, Input, Option, Select } from '@material-tailwind/react';
import { PersonTableInterface } from './interface';
import { usePagination } from '../../../hooks/use-pagination';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { useDebounce } from 'use-debounce';

const columnHelper = createColumnHelper<PersonTableInterface>();
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
  columnHelper.accessor('name', {
    id: 'name',
    header: () => (
      <p className="text-sm font-bold text-gray-600 dark:text-white">Name</p>
    ),
    cell: (info) => (
      <p className="text-sm font-bold text-navy-700 dark:text-white">
        {info.getValue()?.toUpperCase()}
      </p>
    ),
  }),
  columnHelper.accessor('identifier', {
    id: 'identifier',
    header: () => (
      <p className="text-sm font-bold text-gray-600 dark:text-white">Email</p>
    ),
    cell: (info) => (
      <div className="flex items-center">
        <p>{info.getValue()}</p>
      </div>
    ),
  }),
];

export default function PersonTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { pagination, onPaginationChange, page, limit } = usePagination();
  const [search, setSearch] = useState();
  const [value] = useDebounce(search, 1000);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['certificate-table', value, page, limit],
    queryFn: () =>
      axios.get('/api/admin/person', {
        params: { q: value, page, limit },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    keepPreviousData: true,
  });

  useEffect(() => {
    refetch();
  }, [value, page, limit]);

  const table = useReactTable({
    data: data?.data?.data || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const searchRef = useRef(null);

  const handleSearch = () => {
    setSearch(searchRef.current.value);
  };

  if (data) {
    return (
      <Card extra={'w-full h-full px-6 pb-6 sm:overflow-x-auto'}>
        <div className="relative flex items-center justify-between pt-4">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Certificate Table
          </div>
        </div>

        <div className={'mt-4 grid grid-cols-2 gap-4'}>
          <Input
            onChange={(event) => {
              event;
              handleSearch();
            }}
            label={'Search Name'}
            inputRef={searchRef}
          />
        </div>

        <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="!border-px !border-gray-400"
                >
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
                data &&
                table.getRowModel().rows.map((row) => {
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
          <div className={'flex w-full justify-end gap-2'}>
            <Button
              size={'md'}
              onClick={() => {
                onPaginationChange((prevState) => ({
                  pageSize: limit,
                  pageIndex: prevState.pageIndex - 1,
                }));
              }}
              disabled={page === 1}
            >
              <MdNavigateBefore />
            </Button>
            <Button
              size={'md'}
              onClick={() => {
                onPaginationChange((prevState) => ({
                  pageSize: limit,
                  pageIndex: prevState.pageIndex + 1,
                }));
              }}
              disabled={page === data.totalPage}
            >
              <MdNavigateNext />
            </Button>
          </div>
        </div>
      </Card>
    );
  }
}

function EventSelector({
  onValueChange,
}: {
  onValueChange?: (value: string) => void;
}) {
  const [value, setValue] = React.useState<string | null>(null);
  const [options, setOptions] = React.useState([]);

  // const getEvent = async () => {
  //   const resp = await fetch('/api/admin/event');
  //   const data = await resp.json();
  //   setOptions(data.map((opt) => ({ value: opt.id + '', label: opt.name })));
  // };

  useState(() => {
    if (!options.length) {
      axios.get('/api/admin/event').then((res) => {
        setOptions(res.data);
      });
    }
  }, []);

  useEffect(() => {
    // onValueChange(value);
  }, [value]);

  return (
    <div className="w-full">
      <Select
        // value={value}
        label="Select Event"
        onChange={(val) => onValueChange(val)}
        selected={(element) => {
          // if (element) {
          //   setValue(element.props.value);
          // }
          return (
            element &&
            React.cloneElement(element, {
              // disabled: true,
              className:
                'flex items-center opacity-100 px-0 gap-2 pointer-events-none',
            })
          );
        }}
      >
        {options?.map((option, index) => (
          <Option value={option.id + ''} key={index}>
            {option.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}

function PersonSelector({
  onValueChange,
  value,
}: {
  onValueChange?: (value: string) => void;
  value: string;
}) {
  // const [value, setValue] = React.useState(value);
  const [options, setOptions] = React.useState([]);

  return (
    <div className="w-full">
      <Select
        label={'Select Person' + value}
        value={value}
        onChange={(val) => {
          setValue(val);
          onValueChange(val);
        }}
      >
        {options?.map((option) => (
          <Option value={option.id + ''} key={option.value}>
            {option.name + ''}
          </Option>
        ))}
      </Select>
    </div>
  );
}
