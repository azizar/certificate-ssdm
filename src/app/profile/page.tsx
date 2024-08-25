'use client';
import Banner from 'components/admin/profile/Banner';
import General from 'components/admin/profile/General';
import Notification from 'components/admin/profile/Notification';
import Project from 'components/admin/profile/Project';
import Storage from 'components/admin/profile/Storage';
import Upload from 'components/admin/profile/Upload';
import { useSession } from 'next-auth/react';
import Card from '../../components/card';
import CardMenu from '../../components/card/CardMenu';
import React from 'react';
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Typography,
} from '@material-tailwind/react';

import Image from 'next/image';
import { BiCalendarEvent } from 'react-icons/bi';
import avatar from '/public/img/avatars/avatar11.png';
import banner from '/public/img/profile/banner.png';
import { FaDownload } from 'react-icons/fa';

const ProfileOverview = () => {
  const session = useSession();
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
                  alt=""
                />
              </div>
            </div>

            {/* Name and position */}
            <div className="mt-16 flex flex-col items-center">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white">
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
                  6
                </h4>
                <p className="text-sm font-normal text-gray-600">
                  Event Attended
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                  4
                </h4>
                <p className="text-sm font-normal text-gray-600">
                  Certificates
                </p>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-span-8 lg:!mb-0">
          <Card extra={'w-full h-full p-[16px] bg-cover'}>
            <div className="relative flex items-center justify-between pt-4">
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Your Certificates
              </div>
              <CardMenu />
            </div>
            <List>
              {[1, 2, 3].map((data, i) => (
                <ListItem
                  key={i}
                  className={'hover:cursor-default hover:bg-transparent'}
                >
                  <ListItemPrefix>
                    <BiCalendarEvent size={38} />
                  </ListItemPrefix>
                  <div className="">
                    <Typography variant={'h6'}>Event {data}</Typography>
                    <Typography variant={'small'}>{session.data?.user?.email ||""}</Typography>
                  </div>

                  <ListItemSuffix className={'flex gap-2'}>
                    <Button
                      onClick={() => {}}
                      className={'inline-flex items-center gap-2'}
                    >
                      <FaDownload /> Materi
                    </Button>
                    <Button
                      onClick={() => {}}
                      className={'inline-flex items-center gap-2'}
                    >
                      <FaDownload /> Seritifkat
                    </Button>
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

export default ProfileOverview;
