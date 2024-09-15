'use client';
import React, { ReactNode, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import Sidebar from '../../components/sidebar';
import routes from '../../routes';
import { DrawerDefault } from '../admin/CustomDrawer';
import { getActiveNavbar, getActiveRoute } from '../../utils/navigation';
import Footer from '../../components/footer/Footer';
import { usePathname } from 'next/navigation';
import { MdGeneratingTokens } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import Dropdown from '../../components/dropdown';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsArrowBarUp } from 'react-icons/bs';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import Image from 'next/image';

import avatar from '/public/default-user.png';
import ButtonLogout from '../../components/ui/button-logout';

export default function PersonLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <SessionProvider>
      <div className="flex h-full w-full bg-background-100 dark:bg-background-900">
        <div className="h-full w-full font-dm dark:bg-navy-900">
          <main
            className={`mx-2.5  flex-none transition-all dark:bg-navy-900 
              md:pr-2 xl:ml-2`}
          >
            <div>
              <Navbar
                onOpenSidenav={() => setOpen(!open)}
                brandText={getActiveRoute(routes, pathname)}
                secondary={getActiveNavbar(routes, pathname)}
              />
              <div className="mx-auto min-h-screen p-2 !pt-[10px] md:p-2">
                {children}
              </div>
              <div className="p-3">
                <Footer />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}

const Navbar = (props: {
  onOpenSidenav: () => void;
  brandText: string;
  secondary?: boolean | string;
  [x: string]: any;
}) => {
  const { onOpenSidenav, brandText, mini, hovered } = props;
  const [darkmode, setDarkmode] = React.useState(
    document.body.classList.contains('dark'),
  );
  const session = useSession();

  return (
    <nav className="sticky top-0 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-1 hidden h-2.5 font-poppins text-[26px] font-bold text-navy-700  dark:text-white md:block ">
        <div className={'flex items-center gap-2'}>
          {/*<Image*/}
          {/*  src={'/logo-polri.png'}*/}
          {/*  width={40}*/}
          {/*  height={40}*/}
          {/*  alt={'Logo Polri'}*/}
          {/*/>*/}
          <Image
            src={'/logo-ssdm.png'}
            width={40}
            height={40}
            alt={'Logo Polri'}
          />
          <span>Bagrimdik PNS</span>

          {/*<MdGeneratingTokens className="h-6 w-6" />*/}
          {/*<span className="font-medium">Gen</span>*/}
        </div>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div>
        {/* start Notification */}
        <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white" />
            </p>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          classNames={'py-2 top-4 -left-[230px] md:-left-[440px] w-max'}
        >
          <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-navy-700 dark:text-white">
                Notification
              </p>
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                Mark all read
              </p>
            </div>

            <button className="flex w-full items-center">
              <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                <BsArrowBarUp />
              </div>
              <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                  New Update: Horizon UI Dashboard PRO
                </p>
                <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                  A new update for your downloaded item is available!
                </p>
              </div>
            </button>

            <button className="flex w-full items-center">
              <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                <BsArrowBarUp />
              </div>
              <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                  New Update: Horizon UI Dashboard PRO
                </p>
                <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                  A new update for your downloaded item is available!
                </p>
              </div>
            </button>
          </div>
        </Dropdown>
        {/* start Horizon PRO */}

        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove('dark');
              setDarkmode(false);
            } else {
              document.body.classList.add('dark');
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <Image
              width="2"
              height="20"
              className="h-10 w-10 rounded-full"
              src={session?.data?.user?.image || avatar}
              alt="Elon Musk"
            />
          }
          classNames={'py-2 top-8 -left-[180px] w-max'}
        >
          <div className="full flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
            <div className="ml-4 mt-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  {session.data?.user?.name ?? session?.data?.user?.email}
                </p>{' '}
              </div>
            </div>
            {/*<div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 " />*/}

            <div className="m-2 mt-3 flex flex-col">
              {/*<a*/}
              {/*  href=" "*/}
              {/*  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"*/}
              {/*>*/}
              {/*  Profile Settings*/}
              {/*</a>*/}
              {/*<a*/}
              {/*  href=" "*/}
              {/*  className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"*/}
              {/*>*/}
              {/*  Newsletter Settings*/}
              {/*</a>*/}
              <ButtonLogout />
            </div>
          </div>
        </Dropdown>
      </div>
    </nav>
  );
};
