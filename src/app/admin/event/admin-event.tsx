'use client';
import Card from 'components/card';
import CardMenu from 'components/card/CardMenu';
import { useQRCode } from 'next-qrcode';
import React, { useState } from 'react';

import {
  Button,
  ButtonGroup,
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
} from '@material-tailwind/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { getEventList } from 'actions/event';
import { Event } from 'lib/schema/event';
import { usePathname, useRouter } from 'next/navigation';
import { FaEdit, FaPlus, FaQrcode } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { FormEvent } from './form-event';

type RowObj = {
  id: number;
  name: string;
  person_responsibility: string;
  start_date: Date;
  end_date: Date;
  qr_code: string;
  qr_url: string;
  template_file?: string;
};

const columnHelper = createColumnHelper<RowObj>();

function AdminEventTable() {
  const [openDialog, handleOpenDialog] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data, isFetching, refetch, error } = useQuery({
    queryFn: async () => {
      return await getEventList();
    },
    queryKey: ['certificate-table'],
  });

  const { SVG, Image } = useQRCode();

  const [openDialogQR, handleDialogQR] = useState(false);
  const [selectedData, setSelectedData] = useState<Event>();

  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white flex gap-4">NAME</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor('person_responsibility', {
      id: 'person_responsibility',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">PIC</p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor('start_date', {
      id: 'start_date',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          START DATE
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info
            .getValue()
            .toLocaleString('id', {
              dateStyle: 'long',
              timeStyle: 'short',
              hourCycle: 'h24',
            })
            .replace(/pukul/g, ' : ')}
        </p>
      ),
    }),
    columnHelper.accessor('end_date', {
      id: 'end_date',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          END DATE
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info
            .getValue()
            .toLocaleString('id', {
              dateStyle: 'long',
              timeStyle: 'short',
              hourCycle: 'h24',
            })
            .replace(/pukul/g, ' : ')}
        </p>
      ),
    }),
    // columnHelper.accessor('template_file', {
    //   id: 'template_file',
    //   header: () => (
    //     <p className="text-sm font-bold text-gray-600 dark:text-white">
    //       Template
    //     </p>
    //   ),
    //   cell: (info) => (
    //     <p className="text-sm font-bold text-navy-700 dark:text-white">
    //       {info.getValue()}
    //     </p>
    //   ),
    // }),
    columnHelper.accessor('qr_code', {
      id: 'qr_code',
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white"></p>
      ),
      cell: (info) => (
        <ButtonGroup>
          <Button
            size="sm"
            variant="outlined"
            className="inline-flex items-center gap-2 dark:text-white"
            onClick={() => {
              setSelectedData(info.row.original as unknown as Event);
              handleDialogQR(!openDialogQR);
            }}
          >
            <FaQrcode />
          </Button>

          <Button
            size="sm"
            variant="outlined"
            className="inline-flex items-center gap-2 dark:text-white"
            onClick={() => {
              router.push(pathname + '/detail/' + info.row.original.id);
            }}
          >
            <FaEdit />
          </Button>
        </ButtonGroup>
      ),
    }),
  ];

  const table = useReactTable({
    data,
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

  if (error) {
    return <pre>{JSON.stringify(error)}</pre>;
  }

  console.log({ data });

  return (
    <>
      <Dialog
        open={openDialog}
        handler={() => handleOpenDialog(!openDialog)}
        className="dark:bg-navy-800"
      >
        <DialogHeader>
          <Typography variant="h5" className="text-center">
            Form Create Event
          </Typography>
        </DialogHeader>
        <DialogBody>
          <FormEvent
            event={{}}
            onSuccess={(data) => {
              refetch();
              handleOpenDialog(!openDialog);
              console.log('onSuccess: ', { data });
            }}
          />
        </DialogBody>
      </Dialog>

      <Dialog
        open={openDialogQR}
        handler={() => handleDialogQR(!openDialogQR)}
        className="dark:bg-navy-800"
      >
        <DialogHeader>
          <Typography variant="h5" className="text-center dark:text-white">
            QR Code
          </Typography>
        </DialogHeader>
        <DialogBody>
          <div className="flex justify-center">
            <Image
              text={`${process.env.NEXT_PUBLIC_HOST}/event/register/${selectedData?.qr_code}`}
              options={{
                type: 'image/jpeg',
                quality: 1,
                errorCorrectionLevel: 'L',
                margin: 3,
                scale: 4,
                width: 400,
                color: {
                  dark: '#010599FF',
                  light: '#FFBF60FF',
                },
              }}
            />
          </div>
        </DialogBody>
      </Dialog>

      <Card extra={'w-full h-full px-6 pb-6 sm:overflow-x-auto'}>
        <div className="relative flex items-center justify-between pt-4">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Event Table{' '}
          </div>
          <div className="inline-flex gap-2">
            <Button
              variant="text"
              className="inline-flex items-center gap-2 dark:text-white"
              onClick={() => handleOpenDialog(!openDialog)}
            >
              <FaPlus className="size-3" />
              <span>Create Event</span>
            </Button>

            <CardMenu />
          </div>
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
                table.getRowModel().rows.length >= 1 &&
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
        </div>
      </Card>
    </>
  );
}

export default AdminEventTable;
