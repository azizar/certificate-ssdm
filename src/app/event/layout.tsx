// Chakra imports

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div>
        <div className="relative float-right h-full min-h-screen w-full dark:!bg-navy-900">
          <main className={`mx-auto min-h-screen`}>{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
