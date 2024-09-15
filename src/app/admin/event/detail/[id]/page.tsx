'use client';
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Typography,
} from '@material-tailwind/react';
import { generateCertificate, getEventDetail } from 'actions/event';
import Card from 'components/card';
import CardMenu from 'components/card/CardMenu';
import { useRouter } from 'next/navigation';
import { FiLoader } from 'react-icons/fi';
import {
  MdGeneratingTokens,
  MdNavigateBefore,
  MdNavigateNext,
} from 'react-icons/md';
import { useMutation, useQuery } from 'react-query';
import { FormEvent } from '../../form-event';

import {
  FaGenderless,
  FaRegCircleCheck,
  FaRegCircleXmark,
  FaX,
} from 'react-icons/fa6';
import DownloadProgress from '../../../../../components/button-downloader';
import { FaSync } from 'react-icons/fa';
import { usePagination } from '../../../../../hooks/use-pagination';
import { useEffect } from 'react';
import GenerateCertificate from './components/generate-certificate';
import axios from 'axios';

const EventDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { page, limit, skip, onPaginationChange } = usePagination();
  const { data, error, isFetching, refetch } = useQuery({
    queryKey: ['event-detail', params, limit, page],
    queryFn: async () => {
      return await getEventDetail(+params.id, page, limit);
    },
  });

  useEffect(() => {
    refetch();
  }, [page]);

  if (isFetching) {
    return <FiLoader className="mx-auto mt-8 animate-spin" />;
  }

  return (
    <div className={'space-y-2'}>
      <div className="mt-3 grid grid-cols-1 gap-5  lg:grid-cols-3">
        <div className="col-span-1">
          <Card extra={'w-full h-full px-6 pb-6 sm:overflow-x-auto'}>
            <div className="relative flex items-center justify-between pt-4">
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Event Detail
              </div>
              {/*<Button*/}
              {/*  size="sm"*/}
              {/*  variant="outlined"*/}
              {/*  className="inline-flex items-center gap-2 dark:text-white"*/}
              {/*  onClick={() => {*/}
              {/*    fetch('/api/admin/generate/template', {*/}
              {/*      method: 'POST',*/}
              {/*      body: JSON.stringify({ eventId: params.id }),*/}
              {/*    })*/}
              {/*      .then((res) => res.json())*/}
              {/*      .then((res) => console.log({ res }));*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <MdGeneratingTokens />*/}
              {/*</Button>*/}
              {/*<DownloadProgress*/}
              {/*  path={'/api/admin/generate/template'}*/}
              {/*  method={'post'}*/}
              {/*  label={'Test Download'}*/}
              {/*  filename={'test.pdf'}*/}
              {/*  body={{ eventId: params.id }}*/}
              {/*/>*/}
            </div>
            <div className="mt-3">
              <FormEvent
                event={data}
                onSuccess={(data) => {
                  window.location.reload();
                }}
              />
            </div>
          </Card>
        </div>
        <div className="col-span-2">
          <Card extra={'w-full h-full px-6 pb-6 sm:overflow-x-auto'}>
            <GenerateCertificate event={data} />
          </Card>
        </div>
      </div>
      <Card extra={'w-full h-full px-6 pb-6 sm:overflow-x-auto'}>
        <div className="relative flex items-center justify-between pt-4">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Person Absence
          </div>
          <CardMenu />
        </div>
        <div className="w-full">
          <EventAbsence data={data.person_absences ?? []} />
        </div>
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
      </Card>
    </div>
  );
};

interface IAbsenceData {
  id: number;
  eventId: number;
  personId: number;
  person: Person;
  absences: Absence[];
}

interface Absence {
  day: number;
  date: string;
  valid: boolean;
  absenceDate?: string;
}

interface Person {
  id: number;
  identifier: string;
  email: string;
  name: string;
  title: string;
}

const EventAbsence = ({ data }: { data: IAbsenceData[] }) => {
  let generateCertificateMutation = useMutation({
    mutationKey: ['generateCertificate'],
    mutationFn: async ({
      eventId,
      personId,
    }: {
      eventId: number;
      personId: number;
    }) => {
      return axios.post('/api/admin/certificate/generate', {
        eventId,
        personId,
      });
    },
  });
  return (
    <List>
      {data.length >= 1 &&
        data.map((data, i) => (
          <ListItem key={i}>
            <div className="w-full">
              <div className={'flex items-center justify-between'}>
                <div>
                  <Typography variant={'h6'}>{data.person.name}</Typography>
                  <Typography variant={'small'}>{data.person.email}</Typography>
                </div>
                <Button
                  size={'sm'}
                  // disabled={data.absences.some((val) => val.valid === false)}
                  onClick={() => {
                    generateCertificateMutation.mutate(
                      { eventId: data.eventId, personId: data.personId },
                      {
                        onSuccess: (data) => {
                          console.log('mutate:', data);
                        },
                        onError: (error) => {
                          console.error('mutate error:', error);
                        },
                      },
                    );
                  }}
                >
                  <FaSync />
                </Button>
              </div>

              <Typography variant={'small'}>Absence : </Typography>
              <div className={'grid grid-cols-4'}>
                {data.absences.map((abs) => (
                  <div
                    className={
                      'inline-flex items-center justify-between gap-2 border p-1 text-sm'
                    }
                    key={abs.day}
                  >
                    <small>{abs.date}</small>
                    {/*<small>Day {abs.day}</small>*/}
                    {abs.valid ? (
                      <FaRegCircleCheck className={'size-3 text-green-600'} />
                    ) : (
                      <FaRegCircleXmark className={'size-3 text-red-600'} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <ListItemSuffix className={'flex gap-2'}>
              {/*<Button*/}

              {/*>*/}
              {/*  Send Email*/}
              {/*</Button>*/}
            </ListItemSuffix>
          </ListItem>
        ))}
    </List>
  );
};

export default EventDetailsPage;
