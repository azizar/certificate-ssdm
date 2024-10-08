import avatar from '/public/img/avatars/avatar11.png';
import banner from '/public/img/profile/banner.png';
import Card from 'components/card';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const Banner = () => {
  const session = useSession();

  return (
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
          <p className="text-sm font-normal text-gray-600">Event Attended</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
            4
          </h4>
          <p className="text-sm font-normal text-gray-600">Certificates</p>
        </div>

      </div>
    </Card>
  );
};

export default Banner;
