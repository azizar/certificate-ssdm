import { FaDoorClosed } from 'react-icons/fa';
import React from 'react';

function ButtonLogout() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-4"
    >
      <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800 dark:text-white">
        <div className="rounded-full text-xl">
          <FaDoorClosed />
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
