'use client'
import { FaDoorClosed, FaSignOutAlt } from 'react-icons/fa';
import React from 'react';
import { useRouter } from 'next/navigation';

function ButtonLogout() {
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        router.push('/api/auth/signout');
      }}
      className="space-y-4"
    >
      <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800 dark:text-white">
        <div className="rounded-full text-xl">
          <FaSignOutAlt />
        </div>
        <button
          className="text-sm font-medium text-navy-700 dark:text-white"
          type={'submit'}
        >
          Sign Out
        </button>
      </div>
    </form>
  );
}

export default ButtonLogout;
