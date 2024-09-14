'use client';
import Card from '../../../components/card';
import CardMenu from '../../../components/card/CardMenu';
import React, { useCallback, useState } from 'react';
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Spinner,
  Typography,
} from '@material-tailwind/react';



import Image from 'next/image';
import { BiCalendarEvent } from 'react-icons/bi';
import avatar from '/public/default-user.png';
import banner from '/public/img/profile/banner.png';
import { FaDownload } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useSession } from 'next-auth/react';
import { SetupPersonProfile } from './SetupPersonProfile';

const ProfileOverview = () => {
  const session = useSession();
  const { data: certificates, isFetching } = useQuery({
    queryKey: ['my-certificate'],
    queryFn: async () => {
      const resp = await fetch('/api/my-certificate');
      const { data } = await resp.json();
      return data;
    },
  });

  if (certificates)
    return (
      <div className="flex w-full flex-col gap-5 lg:gap-5">
        {/*<pre>{JSON.stringify(session, null, 2)}</pre>*/}
        <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
          <div className="col-span-4 lg:!mb-0">
            <Card extra={'items-center w-full h-full p-[16px] bg-cover'}>
              {/* Background and profile */}
              <div
                className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
                style={{ backgroundImage: `url(${banner.src})` }}
              >
                <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
                  <Image
                    width="2"
                    height="20"
                    className="h-full w-full rounded-full"
                    src={avatar}
                    alt="User Avatar"
                  />
                </div>
              </div>

              {/* Name and position */}
              <div className="mt-16 flex flex-col items-center">
                <h4 className="text-center text-xl font-bold text-navy-700 dark:text-white sm:text-base">
                  {session?.data?.user?.name}
                </h4>
                <h5 className="text-base font-normal text-gray-600">
                  {session?.data?.user?.email}
                </h5>
              </div>

              {/* Post followers */}
              <div className="mb-3 mt-6 flex gap-4 md:!gap-14">
                <div className="flex flex-col items-center justify-center">
                  <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                    0
                  </h4>
                  <p className="text-sm font-normal text-gray-600">
                    Event Attended
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                    {certificates.length || 0}
                  </h4>
                  <p className="text-sm font-normal text-gray-600">
                    Certificates
                  </p>
                </div>
              </div>
              {/*<div className={'w-full border-t-2 py-4 space-y-4'}>*/}
              {/*  <Typography variant={'h5'}>Pengaturan Sertifikat</Typography>*/}
              {/*  <SetupPersonProfile session={session.data} />*/}
              {/*</div>*/}
            </Card>
          </div>
          <div className="col-span-8 lg:!mb-0">
            <Card extra={'w-full h-full p-[16px] bg-cover'}>
              <div className="text-xl font-bold text-navy-700 dark:text-white sm:text-center">
                <Typography variant={'lead'}> Your Certificates</Typography>
              </div>
              <List>
                {certificates.length >= 1 &&
                  certificates.map((data, i) => (
                    <ListItem
                      key={i}
                      className={'hover:cursor-default hover:bg-transparent'}
                    >
                      <ListItemPrefix>
                        <Typography variant={'h6'}>{i + 1}.</Typography>
                      </ListItemPrefix>
                      <div className="">
                        <Typography variant={'h6'}>
                          Event {data?.event?.name}
                        </Typography>
                      </div>

                      <ListItemSuffix className={'flex gap-2'}>
                        <ButtonDownload event={data} />
                      </ListItemSuffix>
                    </ListItem>
                  ))}
              </List>
            </Card>
          </div>
        </div>
        {/* all project & ... */}
      </div>
    );
};

const ButtonDownload = ({ event }: { event }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDownload = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        '/api/my-certificate/download/' + data?.event.id,
      );

      const blob = await response.blob();

      const filename =
        response.headers
          .get('Content-Disposition')
          .split(';')[1]
          .split('=')[1] ?? 'certificate.pdf';

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      // a.download = filename;
      a.target = '_blank';

      function handleDownload() {
        setTimeout(() => {
          URL.revokeObjectURL(url);
          a.removeEventListener('click', handleDownload);
        }, 150);
      }

      a.addEventListener('click', handleDownload, false);
      a.click();
    } catch (e) {
      console.log(e);
      alert('Error download certificate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={() => handleDownload(event)}
      className={'inline-flex items-center gap-2'}
    >
      {isLoading ? <Spinner /> : <FaDownload />}
    </Button>
  );
};
export default ProfileOverview;
