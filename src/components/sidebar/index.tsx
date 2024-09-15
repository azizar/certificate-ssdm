/* eslint-disable */

import { HiX } from 'react-icons/hi';
import Links from './components/Links';

import { MdGeneratingTokens } from 'react-icons/md';
import { IRoute } from 'types/navigation';
import Image from 'next/image';
import React from 'react';

function SidebarHorizon(props: { routes: IRoute[]; [x: string]: any }) {
  const { routes, open, setOpen } = props;
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? 'translate-x-0' : '-translate-x-96 xl:translate-x-0'
      }`}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={() => setOpen(false)}
      >
        <HiX />
      </span>

      <div className={`ml-[20px] mr-[24px] mt-[50px] flex items-center`}>
        <div className="ml-1 mt-1 inline-flex h-2.5 font-poppins text-[26px]  font-bold text-navy-700 dark:text-white">
          {/*Cert*/}
          {/*<MdGeneratingTokens className="h-6 w-6" />*/}
          {/*<span className="font-medium">Gen</span>*/}
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
      </div>
      <div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>

      {/* Free Horizon Card */}
      <div className="flex justify-center">{/* <SidebarCard /> */}</div>

      {/* Nav item end */}
    </div>
  );
}

export default SidebarHorizon;
