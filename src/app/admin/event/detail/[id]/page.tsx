'use client';
import {
  Button,
  List,
  ListItem,
  ListItemSuffix,
  Typography,
} from '@material-tailwind/react';
import { getEventDetail } from 'actions/event';
import Card from 'components/card';
import { usePathname, useRouter } from 'next/navigation';
import { FiLoader } from 'react-icons/fi';
import { MdNavigateBefore, MdNavigateNext, MdPerson } from 'react-icons/md';
import { useMutation, useQuery } from 'react-query';
import { FormEvent } from '../../form-event';

import axios from 'axios';
import Link from 'next/link';
import { useEffect } from 'react';
import { FaSync } from 'react-icons/fa';
import { FaRegCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';
import { IoDocuments } from 'react-icons/io5';
import Widget from '../../../../../components/widget/Widget';
import { usePagination } from '../../../../../hooks/use-pagination';
import GenerateCertificate from './components/generate-certificate';

const EventDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { page, limit, skip, onPaginationChange } = usePagination();
  const { data, error, isFetching, refetch } = useQuery({
    queryKey: ['event-detail', params, limit, page],
    queryFn: async () => {
      return await getEventDetail(+params.id, page, limit);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
            <div className="mt-6 grid grid-cols-1 gap-5 rounded-lg md:grid-cols-2">
              <Widget
                icon={<MdPerson className="h-7 w-7" />}
                title={'Persons'}
                subtitle={`${data?.totalPerson}` ?? '0'}
              />
              <Widget
                icon={<IoDocuments className="h-6 w-6" />}
                title={'Certificate'}
                subtitle={`${data?.totalCertificate}` ?? '0'}
              />
              {/*<Widget*/}
              {/*  icon={<MdCalendarToday className="h-7 w-7" />}*/}
              {/*  title={'Event'}*/}
              {/*  subtitle={data?.totalEvent ?? '0'}*/}
              {/*/>*/}
            </div>

            <GenerateCertificate event={data} />
          </Card>
        </div>
      </div>
      <Card extra={'w-full h-full px-6 pb-6 sm:overflow-x-auto space-y-2'}>
        <div className="relative flex items-center justify-between pt-4">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Person Absence
          </div>
          <Link href={`${pathname}/add-bulk`}>
            <Button className="max-w-sm">Add Bulk Absence</Button>
          </Link>
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
  const generateCertificateMutation = useMutation({
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
          <ListItem key={data.id}>
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
